import { chromium } from '@playwright/test'
const browser = await chromium.launch({channel:'chrome'})
const page = await browser.newPage()
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
const paths=['/about','/faculty','/programs','/programs/school-academics-foundation','/programs/board-jee-neet','/programs/organic-chemistry-mentorship','/faqs']
for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:1000})
 await page.emulateMedia({reducedMotion:'reduce'})
 for(const path of paths){
  await page.goto(`http://127.0.0.1:5173${path}`)
  await page.evaluate(()=>document.fonts.ready)
  if(await page.locator('main h1').count()!==1) throw Error(`Heading ${path}`)
  if(await page.locator('nav[aria-label="Breadcrumb"]').count()!==1) throw Error(`Breadcrumb ${path}`)
  if((await page.title()).includes('Page unavailable')) throw Error(`Metadata ${path}`)
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw Error(`Overflow ${width} ${path}`)
  if(path.startsWith('/programs/')){
   for(const id of ['overview','subjects','curriculum','methodology','eligibility']) if(await page.locator(`#${id}`).count()!==1) throw Error(`Missing ${id}`)
   await page.getByRole('navigation',{name:'On this program page'}).getByRole('link',{name:'Eligibility'}).click()
   const top=await page.locator('#eligibility').evaluate(e=>e.getBoundingClientRect().top)
   if(top<80) throw Error('Anchor hidden by header')
  }
  if(path==='/faqs'){
   if(await page.locator('.academic-faq-category').count()!==5) throw Error('FAQ categories')
   for(const summary of await page.locator('.home-faqs summary').all()){
    await summary.focus();await page.keyboard.press('Enter')
    if(!await summary.evaluate(e=>e.parentElement.open)) throw Error('Accordion keyboard')
    await page.keyboard.press('Enter')
   }
  }
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
  await page.screenshot({path:`artifacts/academic-${path.split('/').filter(Boolean).join('-')}-${width}.png`,fullPage:true})
 }
 console.log(JSON.stringify({width,routes:paths.length,overflow:false,breadcrumbs:'passed',programSections:'passed',faqKeyboard:'passed'}))
}
await page.setViewportSize({width:390,height:844})
await page.goto('http://127.0.0.1:5173/programs')
await page.getByRole('button',{name:'Open navigation'}).click()
const drawer=page.getByRole('dialog')
if(await drawer.getByRole('link',{name:'Programs',exact:true}).getAttribute('aria-current')!=='page') throw Error('Active mobile link')
await page.keyboard.press('Escape')
if(!await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e===document.activeElement)) throw Error('Mobile focus restoration')
await page.getByRole('button',{name:'Open navigation'}).click()
await drawer.getByRole('link',{name:'Faculty',exact:true}).click()
await page.waitForURL('**/faculty')
if(await drawer.isVisible()) throw Error('Drawer route close')
const destinations=new Set()
for(const path of paths){
 await page.goto(`http://127.0.0.1:5173${path}`)
 for(const href of await page.locator('main a[href^="/"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')))) destinations.add(href)
}
for(const href of destinations){
 await page.goto(`http://127.0.0.1:5173${href}`)
 if(await page.getByText('404 · PAGE NOT FOUND',{exact:true}).count()) throw Error(`Broken CTA ${href}`)
}
await page.goto('http://127.0.0.1:5173/programs/not-a-program')
if(!await page.getByText('404 · PAGE NOT FOUND',{exact:true}).count()) throw Error('Unknown program fallback')
console.log(JSON.stringify({mobileNavigation:'passed',ctaDestinations:destinations.size,unknownProgram:'404',runtimeErrors:errors}))
await browser.close()
if(errors.length) throw Error('Runtime errors')
