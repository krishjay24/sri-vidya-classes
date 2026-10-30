import { chromium } from '@playwright/test'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage()
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
const origin='http://127.0.0.1:5173'
for(const width of [360,390,768,1024,1440,1920]){
 await page.setViewportSize({width,height:1000})
 for(const route of ['/results','/gallery']){
  await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready)
  if(await page.locator('main h1').count()!==1)throw Error('Page heading')
  if(await page.locator('.showcase-empty').count()!==1)throw Error('Public empty state')
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`Overflow ${width} ${route}`)
  if(route==='/gallery'){
   await page.getByRole('button',{name:'Events',exact:false}).click()
   if(await page.getByRole('button',{name:'Events',exact:false}).getAttribute('aria-pressed')!=='true')throw Error('Empty filter not selected')
   await page.getByRole('button',{name:'View all photographs'}).click()
   if(await page.getByRole('button',{name:'All',exact:false}).getAttribute('aria-pressed')!=='true')throw Error('Filter reset')
  }
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
  await page.screenshot({path:`artifacts/phase5-${route.slice(1)}-${width}.png`,fullPage:true})
 }
 console.log(JSON.stringify({width,publicEmptyStates:'passed',overflow:false}))
}
// Synthetic blocks and QA labels only. These records exist solely in intercepted browser responses.
const photo=(id,category,overrides={})=>({id,category,src:'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${id==='qa-2'?1000:600}"><rect width="100%" height="100%" fill="${id==='qa-2'?'#eaf3fc':'#f3c94e'}"/><text x="30" y="80" font-size="28">QA synthetic image ${id}</text></svg>`),width:800,height:id==='qa-2'?1000:600,alt:`QA synthetic block ${id}`,caption:`QA image ${id}`,approved:true,consentConfirmed:true,institutePhoto:true,...overrides})
const photos=[photo('qa-1','Classroom'),photo('qa-2','Activities'),photo('qa-3','Classroom'),photo('qa-rejected','Events',{approved:false}),photo('qa-no-consent','Events',{consentConfirmed:false}),photo('qa-stock','Events',{institutePhoto:false})]
const result=(id,category,overrides={})=>({id,category,studentName:`QA fixture ${id}`,exam:'QA examination',year:2026,result:'QA value — not a real result',description:'Synthetic interaction test record only.',photo:photo(id,category),context:'sri-vidya-coaching',verified:true,approved:true,...overrides})
const records=[result('qa-board','Board'),result('qa-neet','NEET',{context:'external-achievement',institutionName:'QA external institution'}),result('qa-unverified','IIT-JEE',{verified:false}),result('qa-no-consent','Foundation',{photo:photo('qa-no-consent','Foundation',{consentConfirmed:false})}),result('qa-no-institution','Board',{context:'external-achievement'})]
await page.route('**/src/config/showcase.ts',async route=>{
 const response=await route.fetch()
 let body=await response.text()
 if(!body.includes('const achievements = [];')||!body.includes('const galleryPhotos = [];'))throw Error('Fixture injection did not match transformed source')
 body=body.replace('const achievements = [];',`const achievements = ${JSON.stringify(records)};`).replace('const galleryPhotos = [];',`const galleryPhotos = ${JSON.stringify(photos)};`)
 await route.fulfill({response,body})
})
for(const width of [360,390,768,1024,1440,1920]){
 await page.setViewportSize({width,height:1000})
 await page.goto(origin+'/results')
 if(await page.locator('.achievement-card').count()!==2)throw Error('Result approval gate')
 if(await page.getByRole('button',{name:'IIT-JEE',exact:false}).count())throw Error('Unavailable result category exposed')
 await page.getByRole('button',{name:'NEET',exact:false}).click()
 if(await page.locator('.achievement-card').count()!==1)throw Error('Result category filtering')
 if(!await page.locator('.achievement-disclosure').isVisible())throw Error('External context disclosure missing')
 await page.getByRole('button',{name:'Board',exact:false}).click()
 if(!await page.getByText('Sri Vidya coaching result',{exact:true}).isVisible())throw Error('Coaching label')
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Populated result overflow')
 await page.goto(origin+'/gallery')
 if(await page.locator('.editorial-gallery figure').count()!==3)throw Error('Gallery approval gate')
 await page.getByRole('button',{name:'Classroom',exact:false}).click()
 if(await page.locator('.editorial-gallery figure').count()!==2)throw Error('Gallery category filter')
 const opener=page.getByRole('button',{name:'View photo: QA image qa-1',exact:true})
 await opener.click()
 const dialog=page.getByRole('dialog')
 await dialog.waitFor({state:'visible'})
 if(await page.evaluate(()=>document.body.style.overflow)!=='hidden')throw Error('Scroll lock')
 await page.getByRole('button',{name:'Next photo',exact:true}).click()
 if(await dialog.locator('h2').innerText()!=='QA image qa-3')throw Error('Next within filtered set')
 await page.keyboard.press('ArrowRight')
 if(await dialog.locator('h2').innerText()!=='QA image qa-1')throw Error('Wrap next')
 await page.keyboard.press('ArrowLeft')
 if(await dialog.locator('h2').innerText()!=='QA image qa-3')throw Error('Previous key')
 for(let i=0;i<7;i++){
  await page.keyboard.press('Tab')
  if(!await dialog.evaluate(el=>el.contains(document.activeElement)))throw Error('Lightbox focus escaped')
 }
 await page.locator('.lightbox-image').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:250,clientY:100}]})
 await page.locator('.lightbox-image').dispatchEvent('touchend',{touches:[],changedTouches:[{identifier:0,clientX:100,clientY:110}]})
 if(await dialog.locator('h2').innerText()!=='QA image qa-1')throw Error('Swipe next')
 if(await dialog.evaluate(el=>el.scrollWidth>el.clientWidth))throw Error('Lightbox overflow')
 await page.keyboard.press('Escape')
 if(await dialog.count())throw Error('Escape close')
 if(!await opener.evaluate(el=>el===document.activeElement))throw Error('Focus restoration')
 if(await page.evaluate(()=>document.body.style.overflow)==='hidden')throw Error('Scroll lock cleanup')
 await page.getByRole('button',{name:'Activities',exact:false}).click()
 await page.getByRole('button',{name:'View photo: QA image qa-2',exact:true}).click()
 if(!await page.getByRole('button',{name:'Next photo',exact:true}).isDisabled())throw Error('Single image navigation')
 await page.getByRole('button',{name:'Close photo viewer'}).click()
 await page.getByRole('button',{name:'Events',exact:false}).click()
 if(!await page.getByText('No events photographs yet.',{exact:true}).isVisible())throw Error('Category empty state')
 await page.getByRole('button',{name:'View all photographs'}).click()
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Gallery overflow')
 console.log(JSON.stringify({width,approvalGates:'passed',filters:'passed',lightbox:'passed',swipe:'passed',focus:'passed'}))
}
await page.emulateMedia({reducedMotion:'reduce'})
if(await page.locator('.editorial-gallery figure').first().evaluate(el=>getComputedStyle(el).animationName)!=='none')throw Error('Reduced motion')
console.log(JSON.stringify({reducedMotion:'passed',runtimeErrors:errors}))
await browser.close()
if(errors.length)throw Error('Runtime errors')


