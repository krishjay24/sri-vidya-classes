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
 host=document.createElement('div');trigger=document.createElement('button');trigger.textContent='Analytics preferences'
 document.body.append(host,trigger);root=createRoot(host)
 trigger.onclick=()=>window.dispatchEvent(new Event('sri-vidya:analytics-settings'))
})
afterEach(async()=>{await act(async()=>root.unmount());document.body.innerHTML='';document.body.style.cssText='';vi.unstubAllGlobals()})
async function mount(){await act(async()=>root.render(<MemoryRouter><AnalyticsHooks /></MemoryRouter>));await act(async()=>{await new Promise(resolve=>requestAnimationFrame(resolve))})}
function button(label:string){return [...document.querySelectorAll('aside button')].find(item=>item.textContent===label) as HTMLButtonElement}
describe('Evergreen-style analytics consent card',()=>{
 it('opens immediately outside the application without blocking background scrolling or focus',async()=>{
  await mount();const card=document.querySelector('aside')!
  expect(card.parentElement).toBe(document.body);expect(host.contains(card)).toBe(false)
  expect(card.getAttribute('aria-label')).toBe('Analytics preferences');expect(card.hasAttribute('aria-modal')).toBe(false)
  expect(document.body.style.overflow).toBe('');expect(document.activeElement).not.toBe(card)
  expect(analytics.choose).toHaveBeenCalledWith(false)
 })
 it.each([true,false])('does not reopen a stored %s choice; footer reopens it without changing background styles',async saved=>{
  analytics.saved=saved;document.body.style.overflow='auto';await mount();expect(document.querySelector('aside')).toBeNull()
  trigger.focus();await act(async()=>trigger.click());expect(document.querySelector('aside')).not.toBeNull()
  await act(async()=>button('Decline').click())
  expect(analytics.choose).toHaveBeenLastCalledWith(false,true);expect(document.querySelector('aside')).toBeNull()
  expect(document.activeElement).toBe(trigger);expect(document.body.style.overflow).toBe('auto')
 })
 it('allows opt-in only through the explicit button; outside clicks and Escape keep consent unchanged',async()=>{
  await mount();const card=document.querySelector('aside')!
  await act(async()=>{card.click();window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))})
  expect(analytics.choose).toHaveBeenCalledTimes(1);expect(document.querySelector('aside')).not.toBeNull()
  await act(async()=>button('Allow analytics').click());expect(analytics.choose).toHaveBeenLastCalledWith(true,true)
  expect(document.querySelector('aside')).toBeNull();expect(document.body.style.overflow).toBe('')
 })
 it('synchronizes the open card and consent when another tab stores or clears a choice',async()=>{
  await mount();analytics.saved=false
  await act(async()=>window.dispatchEvent(new StorageEvent('storage',{key:'test-consent'})))
  expect(document.querySelector('aside')).toBeNull();expect(analytics.choose).toHaveBeenLastCalledWith(false)
  analytics.saved=null
  await act(async()=>window.dispatchEvent(new StorageEvent('storage',{key:'test-consent'})))
  expect(document.querySelector('aside')).not.toBeNull()
 })
 it('preserves privacy signals and uses an ordinary in-app privacy link',async()=>{
  analytics.blocked=true;await mount();expect(document.querySelector('aside')).toBeNull()
  await act(async()=>trigger.click());expect(button('Allow analytics').disabled).toBe(true)
  expect(document.querySelector('aside a')?.getAttribute('href')).toBe('/privacy')
  expect(document.querySelector('aside a')?.getAttribute('target')).toBeNull()
 })
})
