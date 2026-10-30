import { useEffect } from 'react'
import { programs } from '../config/academics'
import { setAnalyticsConsent, trackEvent } from '../lib/analytics'
export default function AnalyticsHooks(){
 useEffect(()=>{
  const consent=(event:Event)=>setAnalyticsConsent((event as CustomEvent<{granted?:boolean}>).detail?.granted===true)
  const click=(event:MouseEvent)=>{
   const link=(event.target as Element)?.closest?.('a[href]')
   if(!link)return
   const href=link.getAttribute('href')??''
   if(href.startsWith('tel:')){trackEvent('call_clicked');return}
   try{
    const url=new URL(href,window.location.origin)
    if(url.protocol==='https:'&&url.hostname==='wa.me'){trackEvent('whatsapp_opened');return}
    if(url.origin===window.location.origin){
     const program=programs.find(item=>url.pathname===`/programs/${item.slug}`)
     if(program)trackEvent('program_interest',program.slug)
    }
   }catch{/* Malformed links never enter analytics. */}
  }
  window.addEventListener('sri-vidya:analytics-consent',consent)
  document.addEventListener('click',click,{capture:true})
  return()=>{window.removeEventListener('sri-vidya:analytics-consent',consent);document.removeEventListener('click',click,{capture:true});setAnalyticsConsent(false)}
 },[])
 return null
}
