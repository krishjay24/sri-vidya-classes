import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyEnquiry, validateEnquiry, formatEnquiry, whatsappUrl, loadDraft, saveDraft, draftKey } from '../src/lib/enquiry'
import { publishableAchievements, publishableGallery } from '../src/config/showcase'
import type { Achievement, GalleryPhoto } from '../src/config/showcase'
const valid={...emptyEnquiry,studentName:'QA Student',guardianName:'QA Guardian',contactName:'QA Adult',classLevel:'10',board:'CBSE',program:'school-academics-foundation',phone:'9876543210',consent:true}
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers()})
describe('Enquiry validation and privacy boundaries',()=>{
 it('accepts an admission enquiry with an optional empty message',()=>expect(validateEnquiry(valid,'admission')).toEqual({}))
 it.each(['','12345','0000000000','987654321012','abc9876543'])('rejects invalid phone %s',phone=>expect(validateEnquiry({...valid,phone},'admission').phone).toBeTruthy())
 it.each(['9876543210','+919876543210','+91 9876543210','+91-9876543210'])('accepts supported phone formatting %s',phone=>expect(validateEnquiry({...valid,phone},'admission').phone).toBeUndefined())
 it('requires guardian consent and valid listed selections',()=>{
  const errors=validateEnquiry({...valid,consent:false,classLevel:'99',board:'unlisted',program:'unlisted',request:'Unconfirmed demo'},'admission')
  for(const key of ['consent','classLevel','board','program','request'])expect(errors[key as keyof typeof errors]).toBeTruthy()
 })
 it('rejects control characters in names and overlong messages',()=>{
  const errors=validateEnquiry({...valid,studentName:'QA\nInjected',message:'a'.repeat(1001)},'admission')
  expect(errors.studentName).toBeTruthy();expect(errors.message).toBeTruthy()
 })
 it('requires a meaningful contact message',()=>expect(validateEnquiry({...valid,message:'short'},'contact').message).toBeTruthy())
 it('preserves Unicode and URL-reserved characters in the reviewed message',()=>{
  const message=formatEnquiry({...valid,message:'QA & ? + # తెలుగు'},'admission')
  const url=new URL(whatsappUrl(message)!)
  expect(url.pathname).toBe('/919959010394');expect(url.searchParams.get('text')).toBe(message)
  expect(message).toContain('Board: CBSE');expect(message).toContain('Class: 10');expect(message).toContain('QA & ? + # తెలుగు')
 })
})
describe('Tab-scoped draft handling',()=>{
 beforeEach(()=>{
  const values=new Map<string,string>()
  vi.stubGlobal('sessionStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)})
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-30T00:00:00Z'))
 })
 it('isolates drafts and expires them after 24 hours',()=>{
  saveDraft('admission',valid);expect(loadDraft('admission').studentName).toBe('QA Student');expect(loadDraft('contact')).toEqual(emptyEnquiry)
  vi.advanceTimersByTime(24*60*60*1000+1);expect(loadDraft('admission')).toEqual(emptyEnquiry)
  expect(sessionStorage.getItem(draftKey('admission'))).toBeNull()
 })
 it('handles corrupt drafts',()=>{sessionStorage.setItem(draftKey('contact'),'{broken');expect(loadDraft('contact')).toEqual(emptyEnquiry)})
 it('does not accept string consent as boolean consent',()=>{
  sessionStorage.setItem(draftKey('admission'),JSON.stringify({values:{...valid,consent:'true'},expires:Date.now()+1000}))
  expect(loadDraft('admission').consent).toBe(false)
 })
 it('handles unavailable browser storage',()=>{
  vi.stubGlobal('sessionStorage',{getItem:()=>{throw Error('Unavailable')}})
  expect(loadDraft('admission')).toEqual(emptyEnquiry)
 })
})
describe('Publication permission gates',()=>{
 const photo:GalleryPhoto={id:'qa',category:'Classroom',src:'/qa-only.webp',alt:'Synthetic test image',width:800,height:600,approved:true,consentConfirmed:true,institutePhoto:true,caption:'QA fixture'}
 const record:Achievement={id:'qa',category:'Board',studentName:'QA fixture',exam:'QA exam',year:2026,result:'QA result',description:'Synthetic test only',photo,context:'sri-vidya-coaching',verified:true,approved:true}
 it('withholds unapproved, non-institute or non-consented photography',()=>{
  expect(publishableGallery([photo])).toHaveLength(1)
  expect(publishableGallery([{...photo,approved:false},{...photo,institutePhoto:false},{...photo,consentConfirmed:false}])).toEqual([])
 })
 it('requires verified results and the external institution when applicable',()=>{
  expect(publishableAchievements([record])).toHaveLength(1)
  expect(publishableAchievements([{...record,verified:false},{...record,context:'external-achievement'}])).toEqual([])
  expect(publishableAchievements([{...record,context:'external-achievement',institutionName:'QA institution'}])).toHaveLength(1)
 })
})
