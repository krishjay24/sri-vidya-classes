import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { privacySignal } from '../lib/analytics'

/** Centered modal consent prompt. */
export default function AnalyticsConsent({ onChoose }: { onChoose: (granted: boolean) => void }) {
 const dialogRef = useRef<HTMLDialogElement>(null)
 useEffect(() => {
  const previousFocus = document.activeElement as HTMLElement | null
  const overflow = document.body.style.overflow
  const dialog = dialogRef.current!
  dialog.showModal()
  document.body.style.overflow = 'hidden'
  return () => {
   dialog.close()
   document.body.style.overflow = overflow
   previousFocus?.focus()
  }
 }, [])
 return createPortal(<dialog ref={dialogRef} className="analytics-consent-card" aria-label="Analytics preferences" aria-modal="true" aria-describedby="analytics-consent-description" onCancel={event => event.preventDefault()}>
  <h2>Your privacy, your choice.</h2>
  <p id="analytics-consent-description">Allow Google Analytics to measure page views and selected interactions. No form details are sent. Analytics stays off until you choose.</p>
  {privacySignal() && <p className="analytics-privacy-signal">Your browser privacy preference blocks analytics.</p>}
  <div className="analytics-consent-actions">
   <button type="button" className="analytics-allow" onClick={() => onChoose(true)} disabled={privacySignal()}>Allow analytics</button>
   <button type="button" className="analytics-decline" onClick={() => onChoose(false)}>Decline</button>
  </div>
  <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="analytics-policy">Read our privacy policy</Link>
 </dialog>, document.body)
}
