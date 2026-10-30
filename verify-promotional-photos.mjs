import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'
import { chromium, expect } from '@playwright/test'

const origin='http://127.0.0.1:4173'
const credits=JSON.parse(await readFile('public/media/education/credits.json','utf8'))
assert.equal(credits.length,11)
for(const photo of credits){
 assert.equal(new URL(photo.source).hostname,'www.pexels.com')
 assert.equal(photo.licenseUrl,'https://www.pexels.com/license/')
 for(const width of photo.widths){
  const metadata=await sharp(`public/media/education/${photo.key}-${width}.webp`).metadata()
  assert.equal(metadata.width,width)
  assert.equal(metadata.height,Math.round(width*2/3))
  assert.equal(metadata.format,'webp')
  assert(!metadata.exif&&!metadata.xmp,'Strip source metadata')
 }
}
// User explicitly excluded these files from edits.
for(const [file,expected] of [
 ['src/pages/ShowcasePages.tsx','9840bb986dfaf8f4507a0705406583aa37b23564482d4e6df95a2f4bf5cd6dc1'],
 ['src/config/showcase.ts','863bddbbde28d777980c2f8252fa3838c6d90a952b33a690da0be1e2b62af2ce'],
])assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),expected,`${file} must remain unchanged`)

const browser=await chromium.launch({channel:'chrome'})
const context=await browser.newContext({reducedMotion:'reduce'})
const page=await context.newPage()
const errors=[]
page.on('pageerror',error=>errors.push(error.message))
const report=[]
try{
 for(const width of [360,390,768,1024,1440,1920]){
  await page.setViewportSize({width,height:1000})
  await page.goto(origin+'/')
  const whatsapp=page.locator('.quick-whatsapp')
  const top=page.locator('.quick-top')
  await expect(whatsapp).toBeVisible()
  await expect(top).toBeHidden()
  await expect(whatsapp).toHaveAttribute('href',/wa\.me\/919959010394/)
  const initial=await whatsapp.boundingBox()
  await page.evaluate(()=>scrollTo(0,700))
  await expect(top).toBeVisible()
  const scrolled=await whatsapp.boundingBox()
  assert.deepEqual(scrolled,initial,'Showing Top must not move WhatsApp')
  const arrow=await top.boundingBox()
  assert.equal(arrow.x,initial.x)
  assert(arrow.y>=initial.y+initial.height+7)
  await expect.poll(()=>page.locator('.scroll-progress').evaluate(el=>{
   const maximum=document.documentElement.scrollHeight-innerHeight
   const actual=new DOMMatrixReadOnly(getComputedStyle(el).transform).a
   return Math.abs(actual-scrollY/maximum)
  })).toBeLessThan(.002)
  await expect(page.locator('.scroll-progress')).toHaveCSS('height','1px')
  await expect(page.locator('.scroll-progress')).toHaveCSS('background-image',/16, 45, 82.*67, 138, 192.*243, 201, 78/)
  await top.click()
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0)
  await expect(top).toBeHidden()
  assert.deepEqual(await whatsapp.boundingBox(),initial)
  await page.evaluate(()=>scrollTo(0,700))
  await page.locator('.signature-card a').first().click()
  await expect(page).toHaveURL(/programs\/school-academics-foundation/)
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0)
  await expect.poll(()=>page.locator('.scroll-progress').evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBe(0)
  await expect(page.locator('.academic-breadcrumb')).toBeInViewport()
  report.push({width,controls:'fixed slots; WhatsApp above conditional Top',progress:'1px, accurate and reset',routeFocus:'no scroll jump'})
 }
 const routes=['/','/about','/faculty','/programs','/programs/school-academics-foundation','/programs/board-jee-neet','/programs/organic-chemistry-mentorship','/admissions','/counselling','/learning-hub']
 const manifest=JSON.parse(await readFile('dist/route-manifest.json','utf8'))
 routes.push(...manifest.routes.map(route=>route.path).filter(path=>path.startsWith('/learning-hub/')))
 const keys=new Set()
 for(const route of routes){
  await page.goto(origin+route)
  assert(await page.locator('.promotional-photo').count(),`Photography missing: ${route}`)
  for(const figure of await page.locator('.promotional-photo').all()){
   const img=figure.locator('img')
   await img.scrollIntoViewIfNeeded()
   await img.evaluate(el=>el.decode())
   assert((await img.getAttribute('src')).startsWith('/media/education/'))
   assert.equal((await img.getAttribute('srcset')).split(',').length,4)
   assert.match(await img.getAttribute('alt'),/illustrative stock photograph/)
   assert.match(await figure.locator('figcaption').textContent(),/not Sri Vidya/)
   keys.add((await img.getAttribute('src')).replace(/-800.webp$/,''))
  }
  assert.equal(await page.locator('a a').count(),0,'No nested attribution links')
 }
 assert.equal(keys.size,11,'No unused downloaded photo variants')
 await page.goto(origin+'/learning-hub')
 const covers=await page.locator('.learning-card .promotional-photo img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')))
 assert.equal(covers.length,6)
 assert.equal(new Set(covers).size,6,'Each article needs a distinct cover')
 assert.deepEqual(errors,[])
 await mkdir('artifacts/visual-enhancement',{recursive:true})
 await writeFile('artifacts/visual-enhancement/results.json',JSON.stringify({photos:11,responsiveWebP:44,gallery:'source and collection unchanged',routesWithPhotos:routes.length,report,errors},null,2))
 console.log(JSON.stringify({photos:11,responsiveWebP:44,uniqueArticleCovers:6,gallery:'unchanged',widths:report,errors}))
}finally{await browser.close()}
