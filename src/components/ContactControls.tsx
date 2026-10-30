import { useSyncExternalStore } from 'react'
import WhatsAppIcon from './WhatsAppIcon'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { institute } from '../config/institute'
import { whatsappUrl } from '../lib/enquiry'
const subscribeScroll=(notify:()=>void)=>{
 window.addEventListener('scroll',notify,{passive:true})
 return()=>window.removeEventListener('scroll',notify)
}
export default function ContactControls(){
 const showTop=useSyncExternalStore(subscribeScroll,()=>window.scrollY>400,()=>false)
 const whatsapp=whatsappUrl('Hello Sri Vidya Classes, I would like to enquire about your programs and admissions.')
 return <div className="contact-controls" role="group" aria-label="Quick contact controls">{whatsapp?<a href={whatsapp} target="_blank" rel="noopener noreferrer" className="quick-whatsapp" aria-label="Open Sri Vidya Classes WhatsApp; press Send in WhatsApp"><WhatsAppIcon size={23} /><span>WhatsApp</span></a>:<a href="/contact#contact-enquiry" className="quick-whatsapp"><MessageCircle size={21} /><span>Contact</span></a>}<a className="quick-call" href={`tel:+91${institute.phone}`} aria-label={`Call Sri Vidya Classes on ${institute.phone}`}><Phone size={20} aria-hidden="true" /><span>Call</span></a><button type="button" className="quick-top" data-visible={showTop} aria-hidden={!showTop} tabIndex={showTop?0:-1} aria-label="Back to top" onClick={()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('page-top')?.focus({preventScroll:true})}}><ArrowUp size={20} aria-hidden="true" /><span>Top</span></button></div>
}

