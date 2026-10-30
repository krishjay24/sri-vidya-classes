import {chromium} from '@playwright/test'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage({reducedMotion:'reduce'})
for(const width of [390,768,1200,1440]){
 await page.setViewportSize({width,height:1000})
 for(const [route,label] of [['/learning-hub','hub'],['/learning-hub/resonance-without-moving-atoms','article']]){
  await page.goto('http://127.0.0.1:5173'+route)
  await page.evaluate(()=>document.fonts.ready)
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
  await page.waitForTimeout(50)
  await page.screenshot({path:`artifacts/phase7-${label}-${width}.png`,fullPage:true})
 }
}
await browser.close()
