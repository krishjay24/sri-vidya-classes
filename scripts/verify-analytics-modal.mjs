import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { createDistServer } from './serve-dist.mjs'

const server = await createDistServer({ port: 0 })
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ channel: 'chrome' })
try {
 for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 640 }]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  const requests = []
  page.on('request', request => { if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url()) })
  await page.goto(origin)
  // Local preview intentionally blocks analytics. Reopen through the real footer control.
  const trigger = page.getByRole('button', { name: 'Analytics preferences' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Your Privacy Preferences' })
  await expect(dialog).toBeVisible()
  assert.equal(await page.locator('body').evaluate(body => body.style.overflow), 'hidden')
  assert.equal(await dialog.evaluate(element => element.parentElement === document.body), true)
  const box = await dialog.boundingBox()
  assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height)
  assert(Math.abs(box.x + box.width / 2 - viewport.width / 2) < 2)
  assert(Math.abs(box.y + box.height / 2 - viewport.height / 2) < 2)
  await expect(dialog.locator('h2')).toBeFocused()
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name: 'Allow analytics' })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name: 'Reject analytics' })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('link', { name: /Privacy Policy/ })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name: 'Allow analytics' })).toBeFocused()
  await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('link', { name: /Privacy Policy/ })).toBeFocused()
  await page.keyboard.press('Escape'); await expect(dialog).toBeVisible()
  await page.mouse.click(2, 2); await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Allow analytics' }).click()
  await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused()
  await trigger.click(); await dialog.getByRole('button', { name: 'Reject analytics' }).click()
  await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused()
  assert.equal(await page.locator('body').evaluate(body => body.style.overflow), '')
  await page.reload(); await expect(dialog).toHaveCount(0)
  assert.equal(requests.length, 0)
  await page.close()
  console.log(`Analytics modal: ${viewport.width}x${viewport.height} layout, keyboard, buttons, restoration and no GA requests passed`)
 }
} finally {
 await browser.close()
 await new Promise(resolve => server.close(resolve))
}
