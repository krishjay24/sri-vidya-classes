import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { programs } from '../config/academics'
import { analyticsAvailable, consentKey, privacySignal, savedConsent, setAnalyticsConsent, trackEvent, trackPageView } from '../lib/analytics'
export default function AnalyticsHooks() {
 const { pathname } = useLocation()
 const [open,setOpen] = useState(false)
 useEffect(() => {
  setAnalyticsConsent(savedConsent() === true)
  const frame = requestAnimationFrame(() => setOpen(analyticsAvailable() && savedConsent() === null && !privacySignal()))
  const settings = () => setOpen(true)
  const sync = (event: StorageEvent) => { if (event.key === consentKey || event.key === null) setAnalyticsConsent(savedConsent() === true) }
  const consent = (event: Event) => { setAnalyticsConsent((event as CustomEvent<{granted?: boolean}>).detail?.granted === true,true); setOpen(false) }
  const click = (event: MouseEvent) => {
   const link = (event.target as Element)?.closest?.('a[href]')
   if (!link) return
   const href = link.getAttribute('href') ?? ''
   if (href.startsWith('tel:')) { trackEvent('phone_click'); return }
   try {
    const url = new URL(href,window.location.origin)
    if (url.protocol === 'https:' && url.hostname === 'wa.me') { trackEvent('whatsapp_click'); return }
    if (url.origin !== window.location.origin) return
    const program = programs.find(item => window.location.pathname === `/programs/${item.slug}`)
    if (program && ['/contact','/admissions'].includes(url.pathname)) trackEvent('program_enquiry_click',program.slug)
    else if (url.pathname === '/admissions' || url.hash === '#admission-enquiry' || link.matches('.admissions-actions a, .academic-enquiry a.button')) trackEvent('admission_click')
   } catch { /* Malformed links never enter analytics. */ }
  }
  window.addEventListener('sri-vidya:analytics-consent',consent)
  window.addEventListener('sri-vidya:analytics-settings',settings)
  window.addEventListener('storage',sync)
  document.addEventListener('click',click,{capture:true})
  return () => { cancelAnimationFrame(frame); window.removeEventListener('sri-vidya:analytics-consent',consent); window.removeEventListener('sri-vidya:analytics-settings',settings); window.removeEventListener('storage',sync); document.removeEventListener('click',click,{capture:true}) }
 },[])
 useEffect(() => { trackPageView(pathname) },[pathname])
 const choose = (granted: boolean) => { setAnalyticsConsent(granted,true); setOpen(false) }
 return open ? <section className="analytics-consent" aria-label="Analytics preferences"><p>Allow optional Google Analytics cookies to help us understand page visits and enquiry actions? We exclude enquiry details and URL query strings. <Link to="/privacy">Privacy information</Link>. Change your choice anytime using Analytics preferences in the footer.</p>{privacySignal() && <p>Your browser privacy preference blocks analytics.</p>}<div><button type="button" onClick={() => choose(true)} disabled={privacySignal()}>Allow analytics</button><button type="button" onClick={() => choose(false)}>Reject / withdraw analytics</button></div></section> : null
}
