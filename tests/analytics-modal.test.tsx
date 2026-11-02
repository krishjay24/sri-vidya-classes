// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnalyticsHooks from '../src/components/AnalyticsHooks'
const analytics = vi.hoisted(()=>({available:true,saved:null as boolean|null,blocked:false,choose:vi.fn(),page:vi.fn()}))
vi.mock('../src/lib/analytics',()=>({analyticsAvailable:()=>analytics.available,savedConsent:()=>analytics.saved,privacySignal:()=>analytics.blocked,setAnalyticsConsent:analytics.choose,trackPageView:analytics.page,trackEvent:vi.fn(),consentKey:'test-consent'}))
let root: Root
let host: HTMLDivElement
let trigger: HTMLButtonElement
beforeEach(()=>{
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT',true)
 analytics.available=true;analytics.saved=null;analytics.blocked=false;vi.clearAllMocks()
 Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value(){this.setAttribute('open','')}})
 Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value(){this.removeAttribute('open')}})
 host=document.createElement('div');trigger=document.createElement('button');trigger.textContent='Analytics preferences'
 document.body.append(host,trigger);root=createRoot(host)
 trigger.onclick=()=>window.dispatchEvent(new Event('sri-vidya:analytics-settings'))
})
afterEach(async()=>{await act(async()=>root.unmount());document.body.innerHTML='';document.body.style.cssText='';vi.unstubAllGlobals()})
async function mount(){await act(async()=>root.render(<MemoryRouter><AnalyticsHooks /></MemoryRouter>));await act(async()=>{await new Promise(resolve=>requestAnimationFrame(resolve))})}
function button(label:string){return [...document.querySelectorAll('dialog button')].find(item=>item.textContent===label) as HTMLButtonElement}
describe('Analytics consent modal',()=>{
 it('opens immediately without scrolling and portals outside the application with labels and scroll lock',async()=>{
  await mount();const dialog=document.querySelector('dialog')!
  expect(dialog.parentElement).toBe(document.body);expect(host.contains(dialog)).toBe(false)
  expect(dialog.hasAttribute('open')).toBe(true);expect(dialog.getAttribute('aria-modal')).toBe('true')
  expect(document.activeElement?.id).toBe('analytics-title');expect(document.body.style.overflow).toBe('hidden')
  expect(analytics.choose).toHaveBeenCalledWith(false)
 })
 it.each([true,false])('does not reopen a stored %s choice; footer reopens it and restores focus/styles',async saved=>{
  analytics.saved=saved;document.body.style.overflow='auto';await mount();expect(document.querySelector('dialog')).toBeNull()
  trigger.focus();await act(async()=>trigger.click());expect(document.querySelector('dialog')).not.toBeNull()
  await act(async()=>button('Reject analytics').click())
  expect(analytics.choose).toHaveBeenLastCalledWith(false,true);expect(document.querySelector('dialog')).toBeNull()
  expect(document.activeElement).toBe(trigger);expect(document.body.style.overflow).toBe('auto')
 })
 it('allows opt-in only through the explicit button; backdrop and Escape keep consent unchanged',async()=>{
  await mount();const dialog=document.querySelector('dialog')!
  await act(async()=>{dialog.click();dialog.dispatchEvent(new Event('cancel',{cancelable:true}))})
  expect(analytics.choose).toHaveBeenCalledTimes(1);expect(document.querySelector('dialog')).not.toBeNull()
  await act(async()=>button('Allow analytics').click());expect(analytics.choose).toHaveBeenLastCalledWith(true,true)
  expect(document.querySelector('dialog')).toBeNull();expect(document.body.style.overflow).toBe('')
 })
 it('preserves privacy signals and keeps the policy readable without leaving the dialog',async()=>{
  analytics.blocked=true;await mount();expect(document.querySelector('dialog')).toBeNull()
  await act(async()=>trigger.click());expect(button('Allow analytics').disabled).toBe(true)
  expect(document.querySelector('dialog a')?.getAttribute('href')).toBe('/privacy')
  expect(document.querySelector('dialog a')?.getAttribute('target')).toBe('_blank')
 })
})
