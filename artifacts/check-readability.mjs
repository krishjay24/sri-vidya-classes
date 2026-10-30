import {chromium} from '@playwright/test'
const browser=await chromium.launch({channel:'chrome'})
const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:1200,height:1000}})
await page.goto('http://127.0.0.1:4173/')
await page.evaluate(()=>document.fonts.ready)
const result=await page.evaluate(()=>{
 const children=[...document.querySelector('.header-inner').children].filter(element=>element.getBoundingClientRect().width>0)
 const boxes=children.map(element=>element.getBoundingClientRect())
 return {overflow:document.documentElement.scrollWidth>innerWidth,headerOverlap:boxes.some((a,index)=>boxes.slice(index+1).some(b=>Math.min(a.right,b.right)>Math.max(a.left,b.left))),copyright:document.querySelector('.footer-bottom').textContent.includes('© 2026 K J Tech Solutions. All Rights Reserved.')}
})
if(result.overflow||result.headerOverlap||!result.copyright)throw Error(JSON.stringify(result))
await page.setViewportSize({width:390,height:1000})
await page.goto('http://127.0.0.1:4173/contact')
await page.evaluate(()=>document.fonts.ready)
await page.screenshot({path:'artifacts/readability-contact-390.png',fullPage:true})
console.log(JSON.stringify(result))
await browser.close()
