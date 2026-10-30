import {chromium} from '@playwright/test'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage()
await page.emulateMedia({reducedMotion:'reduce'})
for(const width of [390,768,1200,1440]){
 await page.setViewportSize({width,height:1000})
 for(const route of ['/','/faculty']){
  await page.goto('http://127.0.0.1:5173'+route)
  await page.evaluate(()=>document.fonts.ready)
  for(const image of await page.locator('img').all()){
   await image.scrollIntoViewIfNeeded()
   await image.evaluate(el=>el.decode())
  }
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`Overflow ${width} ${route}`)
  if(await page.locator('header .brand img').count()!==1)throw Error('Missing crest')
  const portrait=page.locator(route==='/'?'.teacher-portrait':'.faculty-page-portrait>img')
  if(!await portrait.evaluate(el=>el.complete&&el.naturalWidth>0))throw Error('Portrait not loaded')
  if(await portrait.evaluate(el=>getComputedStyle(el).objectFit)!=='contain')throw Error('Portrait crop')
  await page.evaluate(()=>scrollTo(0,0))
  await page.screenshot({path:`artifacts/approved-assets-${route==='/'?'home':'faculty'}-${width}.png`,fullPage:true})
 }
 console.log(JSON.stringify({width,crest:'loaded',portrait:'loaded',overflow:false}))
}
await browser.close()

