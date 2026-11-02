// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

async function setup() {
 vi.resetModules()
 vi.stubEnv('PROD',true)
 vi.stubEnv('MODE','production')
 vi.stubEnv('VITE_ANALYTICS_ENABLED','true')
 vi.stubGlobal('window',Object.assign(new EventTarget(),{location:{origin:'https://sri-vidya-classes.netlify.app',pathname:'/admissions',search:'?email=private@example.com',hash:'#private'}}))
 vi.stubGlobal('navigator',{webdriver:false,doNotTrack:'0'})
 return import('../src/lib/analytics')
}
beforeEach(()=>{document.head.innerHTML='';localStorage.clear()})
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals()})
function commands() { return ((window as unknown as {dataLayer?: IArguments[]}).dataLayer ?? []).map(item=>Array.from(item)) }
describe('Consent-gated GA4',()=>{
 it('loads nothing before consent, configures once and deduplicates route views',async()=>{
  const a=await setup()
  a.trackPageView();a.trackEvent('phone_click')
  expect(document.querySelector('script')).toBeNull();expect(commands()).toEqual([])
  a.setAnalyticsConsent(true);a.setAnalyticsConsent(true);a.trackPageView('/admissions?secret=value');a.trackPageView('/admissions#secret')
  expect(document.querySelectorAll('script')).toHaveLength(1)
  expect(commands().filter(c=>c[0]==='config')).toHaveLength(1)
  expect(commands().filter(c=>c[1]==='page_view')).toHaveLength(1)
  a.trackPageView('/contact');a.trackPageView('/admissions')
  expect(commands().filter(c=>c[1]==='page_view')).toHaveLength(3)
  expect(commands().find(c=>c[0]==='config')?.[2]).toMatchObject({send_page_view:false})
 })
 it('allowlists paths/programs and never forwards personal input or unknown events',async()=>{
  const a=await setup();a.setAnalyticsConsent(true)
  a.trackPageView('/student/private@example.com?phone=123')
  a.trackEvent('whatsapp_click','private@example.com')
  a.trackEvent('generate_lead' as Parameters<typeof a.trackEvent>[0])
  const serialized=JSON.stringify(commands())
  expect(serialized).not.toMatch(/private@example|secret|phone=123|generate_lead/)
  expect(serialized).toContain('/404')
  expect(commands().find(c=>c[1]==='whatsapp_click')?.[2]).toMatchObject({page_referrer:'',page_location:'https://sri-vidya-classes.netlify.app/admissions'})
 })
 it('withdraws, clears pending commands and cookies, and allows re-consent',async()=>{
  const a=await setup();a.setAnalyticsConsent(true,true)
  document.cookie='_ga=example; path=/'
  a.setAnalyticsConsent(false,true);a.trackEvent('phone_click');a.trackPageView('/contact')
  expect(commands()).toEqual([]);expect(document.cookie).not.toContain('_ga=')
  expect(a.savedConsent()).toBe(false)
  a.setAnalyticsConsent(true,true)
  expect(commands().filter(c=>c[1]==='page_view')).toHaveLength(1)
  expect(document.querySelectorAll('script')).toHaveLength(1)
 })
 it.each(['dnt','gpc','webdriver','development','test','localhost','disabled'])('blocks %s',async mode=>{
  const a=await setup()
  if(mode==='dnt') vi.stubGlobal('navigator',{doNotTrack:'1'})
  if(mode==='gpc') vi.stubGlobal('navigator',{globalPrivacyControl:true})
  if(mode==='webdriver') vi.stubGlobal('navigator',{webdriver:true})
  if(mode==='development') vi.stubEnv('PROD',false)
  if(mode==='test') vi.stubEnv('MODE','test')
  if(mode==='disabled') vi.stubEnv('VITE_ANALYTICS_ENABLED','false')
  if(mode==='localhost') Object.assign(window.location,{origin:'http://localhost:5173'})
  a.setAnalyticsConsent(true);a.trackPageView();a.trackEvent('whatsapp_click')
  expect(document.querySelector('script')).toBeNull();expect(commands()).toEqual([])
 })
 it('expires consent and responds to a privacy signal after opt-in',async()=>{
  const a=await setup();a.setAnalyticsConsent(true,true)
  vi.stubGlobal('navigator',{globalPrivacyControl:true});a.trackEvent('phone_click');expect(commands()).toEqual([])
  localStorage.setItem(a.consentKey,JSON.stringify({granted:true,expires:Date.now()-1}));expect(a.savedConsent()).toBeNull()
 })
})
