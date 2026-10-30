import {chromium} from '@playwright/test'
const b=await chromium.launch({channel:'chrome'})
const p=await b.newPage({reducedMotion:'reduce',viewport:{width:390,height:1000}})
const errors=[];p.on('pageerror',e=>errors.push(e.message))
for(const route of ['/ABOUT','/PROGRAMS/board-jee-neet','/404.html']){
 const r=await p.goto('http://127.0.0.1:4173'+route);await p.waitForTimeout(150)
 console.log(JSON.stringify({route,status:r.status(),h1:await p.locator('h1').innerText(),errors:errors.splice(0).map(e=>e.slice(0,100))}))
}
await p.goto('http://127.0.0.1:4173/')
const target=p.locator('.hero-message .button-secondary')
await target.focus()
const check=()=>p.evaluate(()=>{const el=document.activeElement,r=el.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,top=document.elementFromPoint(x,y);return {scroll:scrollY,focused:el.textContent,top:top?.closest('.contact-controls')?'fixed controls':top?.textContent,obscured:!!top?.closest('.contact-controls')}})
console.log('focus before '+JSON.stringify(await check()))
await p.addStyleTag({content:'html{scroll-padding-top:110px;scroll-padding-bottom:100px}a,button,input,select,textarea{scroll-margin-bottom:100px}'})
await p.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)})
await target.focus()
console.log('focus with padding '+JSON.stringify(await check()))
await b.close()
