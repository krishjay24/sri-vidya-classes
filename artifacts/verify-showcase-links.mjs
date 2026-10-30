import { chromium } from '@playwright/test'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage()
const destinations=new Set()
for(const route of ['/results','/gallery']){
 await page.goto('http://127.0.0.1:5173'+route)
 for(const href of await page.locator('main a[href^="/"]').evaluateAll(elements=>elements.map(element=>element.getAttribute('href'))))destinations.add(href)
}
for(const href of destinations){
 await page.goto('http://127.0.0.1:5173'+href)
 if(await page.getByText('404 · PAGE NOT FOUND',{exact:true}).count())throw Error('Broken CTA '+href)
}
console.log(JSON.stringify({ctaDestinations:destinations.size,status:'passed'}))
await browser.close()
