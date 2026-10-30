import {chromium,expect} from '@playwright/test'
import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
const origin='http://127.0.0.1:4173'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:390,height:1000}})
const errors=[];page.on('pageerror',error=>errors.push(error.message))
for(const route of ['/ABOUT','/PROGRAMS/board-jee-neet','/404.html']){
 const response=await page.goto(origin+route)
 assert.equal(response.status(),404)
 await expect(page.getByRole('heading',{level:1})).toContainText('back on track')
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow')
}
for(const endpoint of ['/','/api/enquiry','/.netlify/functions/enquiry'])assert.equal((await fetch(origin+endpoint,{method:'POST',body:'QA-only-invalid-payload'})).status,405)
await page.goto(origin+'/')
await page.evaluate(()=>{document.body.tabIndex=-1;document.body.focus()})
await page.keyboard.press('Tab')
await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused()
await page.keyboard.press('Enter')
await expect(page.locator('#main-content')).toBeFocused()
await page.locator('.hero-message .button-secondary').focus()
assert(await page.locator('.hero-message .button-secondary').evaluate(element=>{
 const rect=element.getBoundingClientRect()
 return !document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2)?.closest('.contact-controls')
}),'Keyboard focus must remain above the fixed contact bar')
await page.getByRole('button',{name:'Open navigation'}).click()
await expect(page.getByRole('dialog')).toBeVisible()
await page.waitForTimeout(50)
assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden')
const lockedScroll=await page.evaluate(()=>scrollY)
await page.mouse.move(10,400);await page.mouse.wheel(0,500);await page.waitForTimeout(100)
assert.equal(await page.evaluate(()=>scrollY),lockedScroll)
for(let i=0;i<15;i++){await page.keyboard.press('Tab');assert(await page.getByRole('dialog').evaluate(element=>element.contains(document.activeElement)))}
await page.keyboard.press('Shift+Tab')
assert(await page.getByRole('dialog').evaluate(element=>element.contains(document.activeElement)))
await page.keyboard.press('Escape')
await expect(page.getByRole('button',{name:'Open navigation'})).toBeFocused()
await expect(page.getByRole('dialog')).not.toBeVisible()
await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('')
await page.getByRole('button',{name:'Open navigation'}).click()
await page.setViewportSize({width:1440,height:1000})
await expect(page.getByRole('dialog')).not.toBeVisible()
await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('')
for(const selector of ['.hero-message','.portrait-stage','.academic-symbol'])assert.equal(await page.locator(selector).first().evaluate(element=>getComputedStyle(element).animationName),'none')
assert.equal(await page.locator('.scroll-progress').evaluate(element=>getComputedStyle(element).height),'1px')
await page.evaluate(()=>scrollTo(0,document.body.scrollHeight))
await expect.poll(()=>page.locator('.scroll-progress').evaluate(element=>new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBe(1)
assert.equal(await page.locator('.site-header').evaluate(element=>Math.round(element.getBoundingClientRect().top)),0)
await page.getByRole('button',{name:'Back to top'}).click()
assert.equal(await page.evaluate(()=>scrollY),0)
assert(await page.locator('.teacher-portrait').evaluate(element=>element.complete&&element.naturalWidth>0&&getComputedStyle(element).objectFit==='contain'))
const overlap=await page.evaluate(()=>{const caption=document.querySelector('.portrait-name').getBoundingClientRect(),hero=document.querySelector('.premium-hero').getBoundingClientRect();return caption.bottom>hero.bottom})
assert(!overlap)
const measures=[]
for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1})
 const measured=await context.newPage()
 await measured.addInitScript(()=>{
  window.qaVitals={cls:0,lcp:null}
  new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.qaVitals.cls+=entry.value}).observe({type:'layout-shift',buffered:true})
  new PerformanceObserver(list=>{for(const entry of list.getEntries())window.qaVitals.lcp=entry.startTime}).observe({type:'largest-contentful-paint',buffered:true})
 })
 await measured.goto(origin+'/');await measured.evaluate(()=>document.fonts.ready);await measured.waitForTimeout(1000)
 measures.push({width,...await measured.evaluate(()=>window.qaVitals),note:'Unthrottled local Chromium lab observation; not field CWV or Lighthouse.'})
 await measured.locator('.premium-hero').screenshot({path:`artifacts/final-qa/hero-${width}.png`})
 await context.close()
}
await writeFile('artifacts/final-qa/interaction-results.json',JSON.stringify({caseSensitive404:'passed',direct404:'passed',postRequests:'405; no backend enabled',keyboard:'passed',drawer:'passed',reducedMotion:'passed',progress:'1px',portrait:'natural proportions and visible caption',errors,localVitals:measures},null,2))
console.log(JSON.stringify({keyboard:'passed',drawer:'passed',caseSensitive404:'passed',direct404:'passed',backend:'not enabled; POST rejected',localVitals:measures,errors}))
await browser.close();assert.equal(errors.length,0)

