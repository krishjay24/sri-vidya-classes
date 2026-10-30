import { chromium } from '@playwright/test'
const browser = await chromium.launch({channel:'chrome'})
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
for (const width of [390, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto('http://127.0.0.1:5173/')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
  const layout = await page.evaluate(() => {
    const boxes = ['.hero-message','.portrait-stage','.program-panel'].map(s => { const r=document.querySelector(s).getBoundingClientRect();return { x:r.x,y:r.y,right:r.right,bottom:r.bottom } })
    const overlap = boxes.some((a,i) => boxes.slice(i+1).some(b => Math.min(a.right,b.right)>Math.max(a.x,b.x) && Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y)))
    return { overflow:document.documentElement.scrollWidth>innerWidth,heroHeight:document.querySelector('.premium-hero').getBoundingClientRect().height,overlap }
  })
  if (layout.overflow || layout.overlap) throw Error(JSON.stringify({width,...layout}))
  if(width===1440 && (layout.heroHeight<600 || layout.heroHeight>720)) throw Error('Desktop hero height')
  if(width<1200){
    await page.getByRole('button',{name:'Open navigation'}).click()
    const dialog=page.getByRole('dialog')
    await dialog.waitFor({state:'visible'})
    if(!await dialog.getByRole('link',{name:'Home',exact:true}).getAttribute('aria-current')) throw Error('Missing active link')
    for(let i=0;i<14;i++){
      await page.keyboard.press('Tab')
      if(!await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement))) throw Error('Focus escaped drawer')
    }
    await page.keyboard.press('Escape')
    if(!await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e===document.activeElement)) throw Error('Focus not restored')
    await page.getByRole('button',{name:'Open navigation'}).click()
    await dialog.getByRole('link',{name:'Contact',exact:true}).click()
    await page.waitForURL('**/contact')
    if(await dialog.isVisible()) throw Error('Drawer remained open after route')
    await page.goto('http://127.0.0.1:5173/')
  }
  await page.screenshot({path:`artifacts/phase2-${width}.png`,fullPage:true})
  console.log(JSON.stringify({width,...layout,drawer:width<1200?'passed':'desktop navigation'}))
}
await page.emulateMedia({reducedMotion:'reduce'})
if(await page.locator('.academic-symbol').first().evaluate(e=>getComputedStyle(e).animationName)!=='none') throw Error('Reduced motion failed')
console.log(JSON.stringify({reducedMotion:'passed',runtimeErrors:errors}))
if(errors.length) throw Error('Runtime errors')
await browser.close()

