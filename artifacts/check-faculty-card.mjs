import {chromium} from '@playwright/test'
const b=await chromium.launch({channel:'chrome'})
const p=await b.newPage({reducedMotion:'reduce'})
for(const width of [390,768,1440]){
 await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:5173/');await p.evaluate(()=>document.fonts.ready)
 const result=await p.evaluate(()=>{const card=document.querySelector('.portrait-name').getBoundingClientRect(),hero=document.querySelector('.premium-hero').getBoundingClientRect(),image=document.querySelector('.teacher-portrait').getBoundingClientRect();return{width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,cardClipped:card.bottom>hero.bottom,overlap:image.bottom-card.top}})
 if(result.overflow||result.cardClipped)throw Error(JSON.stringify(result))
 console.log(result)
 await p.locator('.premium-hero').screenshot({path:`artifacts/faculty-card-lowered-${width}.png`})
}
await b.close()
