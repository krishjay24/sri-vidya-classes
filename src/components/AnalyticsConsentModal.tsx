import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { privacySignal } from '../lib/analytics'

export default function AnalyticsConsentModal({ onChoose }: { onChoose: (granted: boolean) => void }) {
 const dialog = useRef<HTMLDialogElement>(null)
 useEffect(() => {
  const element = dialog.current!
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const overflow = document.body.style.overflow
  const padding = document.body.style.paddingRight
  const scrollbar = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar + parseFloat(getComputedStyle(document.body).paddingRight || '0')}px`
  element.showModal()
  element.querySelector<HTMLElement>('[data-initial-focus]')?.focus()
  return () => {
   element.close()
   document.body.style.overflow = overflow
   document.body.style.paddingRight = padding
   if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
  }
 }, [])
 // Native modal dialogs provide top-layer rendering, background inertness and Tab containment.
 // Escape leaves consent unchanged; only an explicit button changes the stored preference.
 return createPortal(<dialog ref={dialog} className="analytics-dialog" aria-modal="true" aria-labelledby="analytics-title" aria-describedby="analytics-description" onCancel={event => event.preventDefault()} onKeyDown={event => {
   if (event.key !== 'Tab') return
   const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'))
   const first = controls[0], last = controls[controls.length - 1]
   if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current?.querySelector('h2'))) { event.preventDefault(); last?.focus() }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }}>
  <div className="analytics-dialog-content">
   <span className="analytics-dialog-eyebrow">SRI VIDYA CLASSES</span>
   <h2 id="analytics-title" tabIndex={-1} data-initial-focus>Your Privacy Preferences</h2>
   <p id="analytics-description">Optional Google Analytics helps us understand page visits and enquiry actions. We exclude your enquiry details and URL query strings. You can change your choice anytime through Analytics preferences in the footer.</p>
   {privacySignal() && <p className="analytics-privacy-signal">Your browser privacy preference blocks analytics.</p>}
   <div className="analytics-dialog-actions">
    <button className="analytics-allow" type="button" onClick={() => onChoose(true)} disabled={privacySignal()}>Allow analytics</button>
    <button className="analytics-reject" type="button" onClick={() => onChoose(false)}>Reject analytics</button>
   </div>
   <p className="analytics-dialog-note">To withdraw existing permission, choose Reject analytics.</p>
   <a className="analytics-policy" href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy <span className="analytics-dialog-note">(opens in a new tab)</span></a>
  </div>
 </dialog>, document.body)
}
