import { chromium } from '@playwright/test'
const browser = await chromium.launch({channel:'chrome'})
const page = await browser.newPage()
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:1000})
 await page.goto('http://127.0.0.1:5173/')
 await page.evaluate(()=>document.fonts.ready)
 await page.emulateMedia({reducedMotion:'reduce'})
 const sections = page.locator('.homepage-content section')
 if(await sections.count()!==10) throw Error('Unexpected section count')
 for(const section of await sections.all()){
  await section.scrollIntoViewIfNeeded()
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
  if(overflow) throw Error(`Overflow at ${width}`)
 }
 const faq=page.locator('.home-faqs summary').first()
 await faq.focus(); await page.keyboard.press('Enter')
 if(!await faq.evaluate(el=>el.parentElement.open)) throw Error('FAQ did not open')
 await page.keyboard.press('Enter')
 if(await faq.evaluate(el=>el.parentElement.open)) throw Error('FAQ did not close')
 if(await page.locator('.testimonials-section').count()) throw Error('Unapproved testimonials')
 await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)})
 await page.screenshot({path:`artifacts/homepage-${width}.png`,fullPage:true})
 console.log(JSON.stringify({width,sections:await sections.count(),overflow:false,faqKeyboard:'passed'}))
}
const routes=await page.locator('.homepage-content a[href^="/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href')))])
for(const route of routes){
 await page.goto(`http://127.0.0.1:5173${route}`)
 if(await page.getByText('404 · PAGE NOT FOUND',{exact:true}).count()) throw Error(`Broken route: ${route}`)
}
await page.emulateMedia({reducedMotion:'no-preference'})
await page.goto('http://127.0.0.1:5173/')
for(const section of await page.locator('.homepage-content section').all()){
 await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(1600)
 const hidden=await section.locator('[data-reveal]').evaluateAll(nodes=>nodes.some(el=>Number(getComputedStyle(el).opacity)<.99))
 if(hidden) throw Error('Reveal left content hidden')
}
await page.emulateMedia({reducedMotion:'reduce'})
await page.waitForTimeout(100)
const stale=await page.locator('.homepage-content [data-reveal]').evaluateAll(nodes=>nodes.some(el=>el.style.opacity || el.style.transform))
if(stale) throw Error('Motion cleanup failed')
console.log(JSON.stringify({internalRoutes:routes.length,reveals:'passed',reducedMotion:'passed',runtimeErrors:errors}))
await browser.close()
if(errors.length) throw Error('Runtime errors')



