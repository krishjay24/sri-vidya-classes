import { publicRoutes } from '../config/seo'
import { programs } from '../config/academics'
export type AnalyticsEvent='admission_enquiry_reviewed'|'contact_enquiry_reviewed'|'program_interest'|'whatsapp_opened'|'call_clicked'
const allowedEvents:AnalyticsEvent[]=['admission_enquiry_reviewed','contact_enquiry_reviewed','program_interest','whatsapp_opened','call_clicked']
let consent=false
function privacySignal(){return typeof navigator!=='undefined'&&(navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl===true)}
export function setAnalyticsConsent(granted:boolean){consent=granted&&!privacySignal()}
export function trackEvent(event:AnalyticsEvent,programId?:string){
 if(typeof window==='undefined'||!consent||privacySignal()||!allowedEvents.includes(event))return
 const known=publicRoutes.find(route=>route.path===window.location.pathname.replace(/\/$/,'')||route.path==='/'&&window.location.pathname==='/')
 const program=programs.find(item=>item.slug===programId)
 // Explicit allowlist: no names, phone numbers, messages, query strings, referrers or draft values.
 window.dispatchEvent(new CustomEvent('sri-vidya:analytics',{detail:{event,path:known?.path??'/404',...(program?{programId:program.slug}:{})}}))
}

