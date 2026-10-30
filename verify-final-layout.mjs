import {chromium} from '@playwright/test'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
const browser=await chromium.launch({channel:'chrome'})
const context=await browser.newContext({reducedMotion:'reduce'})
const page=await context.newPage()
const errors=[],failedRequests=[],findings=[]
page.on('pageerror',error=>errors.push(error.message))
page.on('requestfailed',request=>failedRequests.push({url:request.url(),failure:request.failure()?.errorText}))
const manifest=JSON.parse(await readFile('dist/route-manifest.json','utf8'))
const widths=[360,390,768,1024,1440,1920]
await mkdir('artifacts/final-qa',{recursive:true})
for(const width of widths){
 await page.setViewportSize({width,height:1000})
 for(const route of [...manifest.routes.map(route=>route.path),'/missing-page']){
  const response=await page.goto('http://127.0.0.1:4173'+route)
  await page.evaluate(()=>document.fonts.ready)
  if(response.status()!==(route==='/missing-page'?404:200))findings.push({width,route,type:'http-status',status:response.status()})
  for(const image of await page.locator('img').all()){
   await image.scrollIntoViewIfNeeded()
   try{await image.evaluate(element=>element.decode())}catch{findings.push({width,route,type:'image-load',src:await image.getAttribute('src')})}
   if(!await image.getAttribute('alt'))findings.push({width,route,type:'image-alt'})
  }
  await page.evaluate(()=>scrollTo(0,0))
  const layout=await page.evaluate(()=>{
   const visible=element=>{const rect=element.getBoundingClientRect();return rect.width>0&&rect.height>0&&getComputedStyle(element).visibility!=='hidden'}
   const rect=element=>{const box=element.getBoundingClientRect();return {x:box.x,y:box.y,right:box.right,bottom:box.bottom}}
   const overlap=(a,b)=>Math.min(a.right,b.right)>Math.max(a.x,b.x)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y)+1
   const header=[...document.querySelector('.header-inner').children].filter(visible).map(rect)
   return {overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('main h1').length,headerOverlap:header.some((a,index)=>header.slice(index+1).some(b=>overlap(a,b))),progressHeight:getComputedStyle(document.querySelector('.scroll-progress')).height,main:!!document.querySelector('main'),footer:!!document.querySelector('footer'),unnamedButtons:[...document.querySelectorAll('main button')].filter(visible).filter(button=>!button.textContent.trim()&&!button.getAttribute('aria-label')).length,unlabelledInputs:[...document.querySelectorAll('main input,main select,main textarea')].filter(input=>!input.labels?.length&&!input.getAttribute('aria-label')&&!input.getAttribute('aria-labelledby')).length}
  })
  if(layout.overflow||layout.headerOverlap||layout.h1!==1||layout.unnamedButtons||layout.unlabelledInputs||layout.progressHeight!=='1px')findings.push({width,route,type:'layout-accessibility',...layout})
  // Test fixed controls against real links at different scroll positions, not only document overflow.
  for(const portion of [0,.5,1]){
   await page.evaluate(portion=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*portion),portion)
   const obscured=await page.evaluate(()=>{
    const bar=document.querySelector('.contact-controls')
    const controls=bar.getBoundingClientRect()
    const candidates=[...document.querySelectorAll('main a,main button,main summary,footer a')].filter(element=>{
     const r=element.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2
     return r.width>0&&r.height>0&&r.top>=0&&r.bottom<=innerHeight&&x>controls.left&&x<controls.right&&y>controls.top&&y<controls.bottom
    })
    return candidates.filter(element=>{
     element.focus()
     const r=element.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)
     return hit&&bar.contains(hit)
    }).map(element=>element.textContent.trim().slice(0,80))
   })
   if(obscured.length)findings.push({width,route,type:'keyboard-focus-obscured',portion,obscured})
  }
  if(['/','/admissions','/contact','/programs','/gallery'].includes(route)){
   await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
   await page.screenshot({path:`artifacts/final-qa/${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true})
  }
 }
 console.log(JSON.stringify({width,routes:manifest.routes.length+1,findings:findings.filter(finding=>finding.width===width).length}))
}
await writeFile('artifacts/final-qa/layout-results.json',JSON.stringify({widths,routes:manifest.routes.length,findings,errors,failedRequests},null,2))
console.log(JSON.stringify({findings,errors,failedRequests}))
await context.close();await browser.close()
if(findings.length||errors.length||failedRequests.length)process.exitCode=1

