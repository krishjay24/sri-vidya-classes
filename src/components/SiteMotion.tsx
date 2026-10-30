import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export function AcademicLoader(){
 const [pending,setPending]=useState(true)
 useEffect(()=>{
  let active=true
  const images=Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="eager"]'))
  const resources=[document.fonts.ready,...images.map(image=>image.decode().catch(()=>undefined))]
  Promise.allSettled(resources).then(()=>{if(active)setPending(false)})
  return()=>{active=false}
 },[])
 if(!pending)return null
 return <div className="academic-loader" aria-hidden="true"><span className="loader-book"><BookOpen size={32} strokeWidth={1.5} /></span><span className="loader-symbols">∑ &nbsp; π &nbsp; C—C</span><svg className="loader-molecule" viewBox="0 0 90 44" width="76" height="40" fill="none"><path d="M20 8 45 29 70 8" stroke="#268b88" strokeWidth="2" /><circle cx="45" cy="29" r="10" fill="#BB1633" /><circle cx="20" cy="8" r="6" fill="#102D52" /><circle cx="70" cy="8" r="6" fill="#102D52" /></svg><span className="loader-brand">Sri Vidya <strong>Classes</strong><small>LEARNING WITH PURPOSE</small></span></div>
}
export function ScrollProgress(){
 const bar=useRef<HTMLDivElement>(null)
 const {pathname}=useLocation()
 useEffect(()=>{
  let frame=0
  const update=()=>{
   frame=0
   const maximum=document.documentElement.scrollHeight-window.innerHeight
   const fraction=maximum>0?Math.min(1,Math.max(0,window.scrollY/maximum)):0
   if(bar.current)bar.current.style.transform=`scaleX(${fraction})`
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true})
  window.addEventListener('resize',schedule)
  const observer=new ResizeObserver(schedule)
  observer.observe(document.body)
  update()
  return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer.disconnect();if(frame)cancelAnimationFrame(frame)}
 },[pathname])
 return <div ref={bar} className="scroll-progress" aria-hidden="true" />
}

