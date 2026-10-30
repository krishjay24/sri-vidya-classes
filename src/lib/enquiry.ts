import { institute } from '../config/institute'
import { programs } from '../config/academics'
export type EnquiryKind = 'admission' | 'contact'
export interface EnquiryValues {
 studentName: string; classLevel: string; board: string; program: string
 guardianName: string; contactName: string; phone: string; message: string; consent: boolean
 request: string
}
export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>
export const classOptions = Array.from({length:9},(_,index)=>String(index+4))
export const boardOptions = ['Andhra Pradesh State Board', 'CBSE', 'ICSE / ISC', 'Other', 'Not sure yet']
export const emptyEnquiry: EnquiryValues = { studentName:'',classLevel:'',board:'',program:'',guardianName:'',contactName:'',phone:'',message:'',consent:false,request:'Admission enquiry' }
export function validateEnquiry(values: EnquiryValues, kind: EnquiryKind): EnquiryErrors {
 const errors: EnquiryErrors={}
 const name=(key:'studentName'|'guardianName'|'contactName',label:string)=>{
  const value=values[key].trim()
  if(value.length<2||value.length>80||Array.from(value).some(character=>character.charCodeAt(0)<32)||!/[\p{L}]/u.test(value))errors[key]=`Enter ${label} (2–80 characters).`
 }
 if(kind==='admission'){
  name('studentName','the student’s name');name('guardianName','the parent or guardian’s name')
  if(!classOptions.includes(values.classLevel))errors.classLevel='Select a class from 4 to 12.'
  if(!boardOptions.includes(values.board))errors.board='Select your board or “Not sure yet”.'
  if(!programs.some(program=>program.slug===values.program))errors.program='Select the program you’re interested in.'
 }else name('contactName','your name')
 if(!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(values.phone.trim()))errors.phone='Enter a valid 10-digit Indian mobile number, optionally prefixed with +91.'
 if(values.message.length>1000)errors.message='Keep your message within 1,000 characters.'
 if(kind==='contact'&&values.message.trim().length<10)errors.message='Please write a message of at least 10 characters.'
 if(!values.consent)errors.consent='Please confirm your consent before continuing.'
 const requests=['Admission enquiry',...(institute.counsellingOffered?['Counselling request']:[]),...(institute.demoClassOffered?['Demo-class request']:[])]
 if(kind==='admission'&&!requests.includes(values.request))errors.request='Select an available enquiry type.'
 return errors
}
export function whatsappUrl(message: string) {
 return /^\d{8,15}$/.test(institute.whatsapp) ? `https://wa.me/${institute.whatsapp}?text=${encodeURIComponent(message)}` : null
}
export function formatEnquiry(values: EnquiryValues,kind:EnquiryKind) {
 const lines=['Hello Sri Vidya Classes,', '', kind==='admission'?`I would like to make the following request: ${values.request.toLowerCase()}.`:'I would like to contact the institute.', '']
 if(kind==='admission')lines.push(`Student: ${values.studentName.trim()}`,`Class: ${values.classLevel}`,`Board: ${values.board}`,`Program: ${programs.find(program=>program.slug===values.program)?.name ?? values.program}`,`Parent / guardian: ${values.guardianName.trim()}`)
 else lines.push(`Name: ${values.contactName.trim()}`)
 lines.push(`Contact number: ${values.phone.trim()}`)
 if(values.message.trim())lines.push('',`Message: ${values.message.trim()}`)
 lines.push('', 'I consent to sharing these details with Sri Vidya Classes for a response to this enquiry.', '', 'Please let me know the appropriate next steps. Thank you.')
 return lines.join('\n')
}
export const draftKey=(kind:EnquiryKind)=>`sri-vidya-enquiry-${kind}-v1`
export function loadDraft(kind:EnquiryKind):EnquiryValues {
 try{
  const stored=JSON.parse(sessionStorage.getItem(draftKey(kind))??'null')
  if(!stored||typeof stored.expires!=='number'||stored.expires<Date.now()){sessionStorage.removeItem(draftKey(kind));return {...emptyEnquiry}}
  const values={...emptyEnquiry}
  for(const key of Object.keys(emptyEnquiry) as (keyof EnquiryValues)[]){
   if(key==='consent')values.consent=stored.values?.consent===true
   else if(typeof stored.values?.[key]==='string')values[key]=stored.values[key].slice(0,1000)
  }
  return values
 }catch{return {...emptyEnquiry}}
}

export function saveDraft(kind:EnquiryKind,values:EnquiryValues) {
 sessionStorage.setItem(draftKey(kind),JSON.stringify({values,expires:Date.now()+24*60*60*1000}))
}
