import WhatsAppIcon from './WhatsAppIcon'
import { trackEvent } from '../lib/analytics'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Copy, RotateCcw } from 'lucide-react'
import { programs } from '../config/academics'
import { institute } from '../config/institute'
import { boardOptions, classOptions, draftKey, emptyEnquiry, formatEnquiry, loadDraft, saveDraft, validateEnquiry, whatsappUrl } from '../lib/enquiry'
import type { EnquiryErrors, EnquiryKind, EnquiryValues } from '../lib/enquiry'

export default function EnquiryForm({ kind }: { kind: EnquiryKind }) {
 const [values,setValues]=useState(()=>({...emptyEnquiry}))
 const [errors,setErrors]=useState<EnquiryErrors>({})
 const [review,setReview]=useState(false)
 const [status,setStatus]=useState('')
 const [storageUnavailable,setStorageUnavailable]=useState(false)
 const form=useRef<HTMLFormElement>(null)
 const preview=useRef<HTMLTextAreaElement>(null)
 useEffect(()=>{const frame=requestAnimationFrame(()=>setValues(loadDraft(kind)));return()=>cancelAnimationFrame(frame)},[kind])
 const update=(key:keyof EnquiryValues,value:string|boolean)=>{
  const next={...values,[key]:value}
  setValues(next);setReview(false);setStatus('')
  try { saveDraft(kind,next) } catch { setStorageUnavailable(true) }
  setErrors(current=>({...current,[key]:undefined}))
 }
 const submit=(event:FormEvent)=>{
  event.preventDefault()
  const issues=validateEnquiry(values,kind)
  setErrors(issues);setStatus('')
  if(Object.keys(issues).length){
   setReview(false)
   requestAnimationFrame(()=>form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
   return
  }
  trackEvent(kind==='admission'?'admission_enquiry_reviewed':'contact_enquiry_reviewed',kind==='admission'?values.program:undefined)
  setReview(true)
  requestAnimationFrame(()=>document.getElementById(`${kind}-review-title`)?.focus())
 }
 const field=(key:keyof EnquiryValues,label:string,options?:string[]|{value:string;label:string}[],optional=false)=>{
  const id=`${kind}-${key}`
  const common={id,name:key,'aria-invalid':!!errors[key],'aria-describedby':errors[key]?`${id}-error`:undefined,required:!optional,value:String(values[key]),onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>update(key,event.target.value)}
  return <div className={`enquiry-field ${key==='message'?'field-full':''}`} key={key}><label htmlFor={id}>{label}{optional?<span>Optional</span>:<span aria-hidden="true">*</span>}</label>{options?<select {...common}><option value="">Select {label.toLowerCase()}</option>{options.map(option=>typeof option==='string'?<option key={option} value={option}>{option}</option>:<option key={option.value} value={option.value}>{option.label}</option>)}</select>:key==='message'?<textarea {...common} rows={4} maxLength={1000} placeholder="Please avoid sensitive information such as Aadhaar numbers or medical details." />:<input {...common} type={key==='phone'?'tel':'text'} inputMode={key==='phone'?'tel':'text'} autoComplete={key==='phone'?'tel':key==='contactName'||key==='guardianName'?'name':'off'} maxLength={key==='phone'?16:80} />}{key==='message'&&<span className="field-hint">{values.message.length}/1,000 characters</span>}{errors[key]&&<p className="field-error" id={`${id}-error`}>{errors[key]}</p>}</div>
 }
 const text=formatEnquiry(values,kind)
 const url=whatsappUrl(text)
 return <div className="enquiry-form-card"><div className="enquiry-form-heading"><span className="eyebrow">{kind==='admission'?'YOUR NEXT CHAPTER':'WE’RE LISTENING'}</span><h2>{kind==='admission'?'Let’s start your enquiry.':'How can we help?'}</h2><p>Complete the details, review your message, then continue to WhatsApp. You must press Send there.</p></div><form ref={form} noValidate onSubmit={submit} aria-label={kind==='admission'?'Admission enquiry':'Contact enquiry'}><p className="required-note">Fields marked * are required.</p>{Object.values(errors).some(Boolean)&&<div className="form-error-summary" role="alert">Please check the highlighted fields. Your entered details are still here.</div>}<div className="enquiry-fields">{kind==='admission'?<>{field('studentName','Student name')}{field('guardianName','Parent / guardian name')}{field('classLevel','Class',classOptions.map(value=>({value,label:`Class ${value}`})))}{field('board','Board',boardOptions)}{field('program','Interested program',programs.map(program=>({value:program.slug,label:program.name})))}{field('phone','Contact number')}{(institute.counsellingOffered||institute.demoClassOffered)&&field('request','Enquiry type',['Admission enquiry',...(institute.counsellingOffered?['Counselling request']:[]),...(institute.demoClassOffered?['Demo-class request']:[])])}</>:<>{field('contactName','Your name')}{field('phone','Contact number')}</>}{field('message','Message',undefined,kind==='admission')}</div><div className="consent-field"><input id={`${kind}-consent`} name="consent" type="checkbox" checked={values.consent} required aria-invalid={!!errors.consent} aria-describedby={errors.consent?`${kind}-consent-error`:undefined} onChange={event=>update('consent',event.target.checked)} /><label htmlFor={`${kind}-consent`}>I am a parent/guardian or an adult enquirer. I agree to share these details with Sri Vidya Classes through WhatsApp for a response to my enquiry. <Link to="/privacy">Privacy information</Link></label></div>{errors.consent&&<p className="field-error" id={`${kind}-consent-error`}>{errors.consent}</p>}<div className="form-buttons"><button type="submit" className="button">Review enquiry <ArrowRight size={17} /></button><button type="button" className="clear-draft" onClick={()=>{setValues({...emptyEnquiry});setErrors({});setReview(false);setStatus('Draft cleared.');try{sessionStorage.removeItem(draftKey(kind))}catch{/* Storage can be unavailable. */}}}><RotateCcw size={15} />Clear draft</button></div><p className="draft-notice">{storageUnavailable?'Browser storage is unavailable. Your draft stays on this page while open but may not survive navigation.':'Your draft is saved in this browser tab for up to 24 hours, including across navigation. Clear it when using a shared device.'} Nothing is sent by reviewing this form.</p></form>{review&&<section className="enquiry-review" aria-labelledby={`${kind}-review-title`}><h3 id={`${kind}-review-title`} tabIndex={-1}><Check size={20} />Review before sending</h3><label htmlFor={`${kind}-preview`}>Your WhatsApp message</label><textarea ref={preview} id={`${kind}-preview`} readOnly value={text} rows={12} /><p>These details have not been sent. WhatsApp opens with this message filled in; check the recipient and press Send there.</p><div className="review-actions">{url?<a className="button" href={url} target="_blank" rel="noopener noreferrer" onClick={()=>setStatus('WhatsApp may open in another tab or app. Press Send there to share your enquiry. This website cannot confirm delivery.')}><WhatsAppIcon size={20} />Continue to WhatsApp</a>:<p className="whatsapp-unavailable">The WhatsApp number is awaiting confirmation. Please call the institute; your enquiry has not been sent.</p>}<button type="button" className="copy-enquiry" onClick={async()=>{try{await navigator.clipboard.writeText(text);setStatus('Message copied. It has not been sent.')}catch{preview.current?.focus();preview.current?.select();setStatus('Select and copy the message above. It has not been sent.')}}}><Copy size={16} />Copy message</button></div></section>}<p className="form-status" role="status" aria-live="polite">{status}</p></div>
}






