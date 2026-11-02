import { publicRoutes, normalizePath } from '../config/seo'
import { programs } from '../config/academics'
export const measurementId = 'G-BJ8EPS3NBT'
export const consentKey = 'sri-vidya-analytics-consent-v1'
export type AnalyticsEvent = 'admission_enquiry_reviewed' | 'contact_enquiry_reviewed' | 'whatsapp_click' | 'phone_click' | 'admission_click' | 'program_enquiry_click'
const allowedEvents: AnalyticsEvent[] = ['admission_enquiry_reviewed','contact_enquiry_reviewed','whatsapp_click','phone_click','admission_click','program_enquiry_click']
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined }
let consent = false
let initialized = false
let lastPath: string | undefined
const origin = 'https://sri-vidya-classes.netlify.app'
export function privacySignal() { return typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || (navigator as Navigator & {globalPrivacyControl?: boolean}).globalPrivacyControl === true) }
export function analyticsAvailable() {
 return typeof window !== 'undefined' && import.meta.env.PROD && import.meta.env.MODE !== 'test' && import.meta.env.VITE_ANALYTICS_ENABLED === 'true' && window.location.origin === origin && !navigator.webdriver
}
export function savedConsent() {
 try { const stored = JSON.parse(localStorage.getItem(consentKey) ?? 'null'); return stored?.expires > Date.now() && typeof stored.granted === 'boolean' ? stored.granted as boolean : null } catch { return null }
}
function safePage(pathname = window.location.pathname) {
 const route = publicRoutes.find(route => route.path === normalizePath(pathname))
 return { page_location: origin + (route?.path ?? '/404'), page_title: route?.title ?? 'Page not found', page_referrer: '' }
}
function clearCookies() {
 for (const cookie of document.cookie.split(';')) {
  const name = cookie.trim().split('=')[0]
  if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) continue
  for (const domain of ['', '; domain=sri-vidya-classes.netlify.app', '; domain=.sri-vidya-classes.netlify.app']) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax; Secure`
 }
}
export function setAnalyticsConsent(granted: boolean, persist = false) {
 const wasConsented = consent
 consent = granted && !privacySignal() && analyticsAvailable()
 if (persist) { try { localStorage.setItem(consentKey, JSON.stringify({granted: granted && !privacySignal(), expires: Date.now() + 180*24*60*60*1000})) } catch { /* Consent lasts only for this page if storage is blocked. */ } }
 if (typeof window === 'undefined') return
 const target = window as unknown as AnalyticsWindow
 target[`ga-disable-${measurementId}`] = !consent
 if (!consent) {
  lastPath = undefined
  if (initialized) target.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})
  // Discard queued events if consent is withdrawn while the tag is downloading.
  if (target.dataLayer) target.dataLayer.length = 0
  clearCookies()
  return
 }
 if (wasConsented) { trackPageView(); return }
 if (!initialized) {
  initialized = true
  target.dataLayer = target.dataLayer ?? []
  // Google tag requires an Arguments object in the dataLayer queue.
  // eslint-disable-next-line prefer-rest-params
  target.gtag = function() { target.dataLayer!.push(arguments) }
  target.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})
  target.gtag('js',new Date())
  target.gtag('config',measurementId,{send_page_view:false,...safePage(),allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000})
  const script = document.createElement('script')
  script.id = 'sri-vidya-ga4'; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
 } else {
  target.gtag?.('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})
  target.gtag?.('js',new Date())
  target.gtag?.('config',measurementId,{send_page_view:false,...safePage(),allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000})
 }
 trackPageView()
}
function canTrack() {
 if (privacySignal()) { setAnalyticsConsent(false); return false }
 return consent && analyticsAvailable()
}
export function trackPageView(pathname = typeof window !== 'undefined' ? window.location.pathname : '/') {
 if (!canTrack()) return
 const page = safePage(pathname)
 if (lastPath === page.page_location) return
 lastPath = page.page_location
 const target = window as unknown as AnalyticsWindow
 target.gtag?.('set',page)
 target.gtag?.('event','page_view',{...page,send_to:measurementId})
}
export function trackEvent(event: AnalyticsEvent, programId?: string) {
 if (!canTrack() || !allowedEvents.includes(event)) return
 const program = programs.find(item => item.slug === programId)
 const detail = {event,path:new URL(safePage().page_location).pathname,...(program ? {programId:program.slug} : {})}
 ;(window as unknown as AnalyticsWindow).gtag?.('event',event,{...safePage(),send_to:measurementId,...(program ? {program_id:program.slug} : {})})
 window.dispatchEvent(new CustomEvent('sri-vidya:analytics',{detail}))
}
