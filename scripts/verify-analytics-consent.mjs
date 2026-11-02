import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { createDistServer } from './serve-dist.mjs'
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const server = await createDistServer({ port: 0 })
const origin = `http://127.0.0.1:${server.address().port}`
// Optional read-only comparison against Evergreen's existing production build.
const referenceRoot = process.argv[2] && path.resolve(process.argv[2], 'dist')
const reference = referenceRoot && createServer(async (request, response) => {
 const pathname = new URL(request.url, 'http://localhost').pathname
 const target = path.resolve(referenceRoot, '.' + (pathname === '/' ? '/index.html' : pathname))
 if (!target.startsWith(referenceRoot + path.sep)) { response.writeHead(400); response.end(); return }
 try {
  const body = await readFile(target)
  const types = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.svg':'image/svg+xml' }
  response.setHeader('Content-Type', types[path.extname(target)] ?? 'application/octet-stream'); response.end(body)
 } catch { response.writeHead(404); response.end() }
})
if (reference) await new Promise(resolve => reference.listen(0, '127.0.0.1', resolve))
const browser = await chromium.launch({ channel: 'chrome' })
try {
 for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 640 }]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  const requests = []
  page.on('request', request => { if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url()) })
  await page.goto(origin)
  const trigger = page.getByRole('button', { name: 'Analytics preferences' })
  await trigger.click()
  // Confirm that the card remains viewport-fixed even with the footer far below it.
  await page.evaluate(() => window.scrollTo(0, 0))
  const card = page.getByRole('complementary', { name: 'Analytics preferences' })
  await expect(card).toBeVisible()
  const metrics = await card.evaluate(element => {
   const css = getComputedStyle(element), box = element.getBoundingClientRect()
   return { x:box.x, bottom:innerHeight-box.bottom, width:box.width, padding:css.padding, radius:css.borderRadius, position:css.position, zIndex:css.zIndex, font:getComputedStyle(element.querySelector('h2')).fontSize }
  })
  assert.equal(metrics.x, 16); assert.equal(metrics.bottom, 16)
  assert.equal(metrics.width, viewport.width >= 640 ? 416 : viewport.width - 104)
  assert.equal(await page.locator('body').evaluate(body => body.style.overflow), '')
  assert.equal(await card.evaluate(element => element.parentElement === document.body && !element.closest('footer')), true)
  await page.keyboard.press('Escape'); await expect(card).toBeVisible()
  await page.mouse.click(viewport.width - 2, 2); await expect(card).toBeVisible()
  await card.getByRole('button', { name: 'Allow analytics' }).focus()
  await page.keyboard.press('Tab'); await expect(card.getByRole('button', { name: 'Decline', exact:true })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(card.getByRole('link')).toBeFocused()
  if (reference) {
   const ref = await browser.newPage({ viewport, reducedMotion:'reduce' })
   await ref.goto(`http://127.0.0.1:${reference.address().port}`)
   await ref.waitForLoadState('networkidle')
   await ref.getByRole('button', { name:'Analytics preferences', exact:true }).click()
   await ref.evaluate(() => window.scrollTo(0,0))
   const referenceCard = ref.getByRole('complementary', { name:'Analytics preferences' })
   await expect(referenceCard).toBeVisible()
   const refMetrics = await referenceCard.evaluate(element => {
    const css=getComputedStyle(element),box=element.getBoundingClientRect()
    return { x:box.x,bottom:innerHeight-box.bottom,width:box.width,padding:css.padding,radius:css.borderRadius,position:css.position,zIndex:css.zIndex,font:getComputedStyle(element.querySelector('h2')).fontSize }
   })
   assert.deepEqual(metrics,refMetrics)
   if ([1440,390].includes(viewport.width)) {
    await page.evaluate(() => document.activeElement?.blur())
    const shots = await Promise.all([referenceCard.screenshot(),card.screenshot()])
    const comparison = await browser.newPage({viewport:{width:920,height:440},deviceScaleFactor:1})
    await comparison.setContent(`<body style="margin:0;padding:24px;background:#e4e8ec;font:14px Arial;display:flex;gap:24px"><section><p>Evergreen Solar Energies (${viewport.width}px viewport)</p><img src="data:image/png;base64,${shots[0].toString('base64')}" /></section><section><p>Sri Vidya Classes (${viewport.width}px viewport)</p><img src="data:image/png;base64,${shots[1].toString('base64')}" /></section></body>`)
    await mkdir('artifacts',{recursive:true})
    await comparison.screenshot({path:`artifacts/analytics-consent-comparison-${viewport.width}.png`})
    await comparison.close()
   }
   await ref.close()
  }
  await card.getByRole('button', { name:'Allow analytics' }).click(); await expect(card).toHaveCount(0)
  await trigger.click(); await card.getByRole('button', { name:'Decline',exact:true }).click(); await expect(card).toHaveCount(0)
  await page.reload(); await expect(card).toHaveCount(0)
  await trigger.click(); await card.getByRole('link').click()
  await expect(page).toHaveURL(origin + '/privacy'); await expect(card).toBeVisible()
  assert.equal(requests.length, 0)
  await page.close()
  console.log(`Consent card: ${viewport.width}x${viewport.height} placement, interaction, privacy navigation and no GA requests passed${reference ? '; Evergreen geometry matched' : ''}`)
 }
} finally {
 await browser.close()
 await new Promise(resolve => server.close(resolve))
 if (reference) await new Promise(resolve => reference.close(resolve))
}
