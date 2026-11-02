import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { privacySignal } from '../lib/analytics'

/** Evergreen's non-modal preference card, using Sri Vidya's existing consent handler. */
export default function AnalyticsConsent({ onChoose }: { onChoose: (granted: boolean) => void }) {
 return createPortal(<aside className="analytics-consent-card" aria-label="Analytics preferences">
  <h2>Your privacy, your choice.</h2>
  <p>Allow Google Analytics to measure page views and selected interactions. No form details are sent. Analytics stays off until you choose.</p>
  {privacySignal() && <p className="analytics-privacy-signal">Your browser privacy preference blocks analytics.</p>}
  <div className="analytics-consent-actions">
   <button type="button" className="analytics-allow" onClick={() => onChoose(true)} disabled={privacySignal()}>Allow analytics</button>
   <button type="button" className="analytics-decline" onClick={() => onChoose(false)}>Decline</button>
  </div>
  <Link to="/privacy" className="analytics-policy">Read our privacy policy</Link>
 </aside>, document.body)
}
