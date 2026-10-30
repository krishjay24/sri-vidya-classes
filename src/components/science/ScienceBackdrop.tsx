import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion, useScienceVisibility } from '../../hooks/useScienceMotion'
export default function ScienceBackdrop(){
 const {root,inView}=useScienceVisibility()
 const reduced=useReducedMotion()
 const timeline=useRef<gsap.core.Timeline|null>(null)
 useEffect(()=>{
  if(reduced)return
  const ctx=gsap.context(()=>{
   timeline.current=gsap.timeline({paused:true})
    .fromTo('[data-science-bond]',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1,stagger:.07,ease:'power2.out'})
    .fromTo('[data-science-particle]',{opacity:0},{opacity:.8,duration:.4,stagger:.12},.4)
    .to('[data-science-particle]',{x:8,y:-10,opacity:.3,duration:2.5,stagger:.12,ease:'sine.inOut'},1)
  },root)
  return()=>{ctx.revert();timeline.current=null}
 },[root,reduced])
 useEffect(()=>{if(inView&&!reduced)timeline.current?.play();else timeline.current?.pause()},[inView,reduced])
 return <aside ref={root} className="portrait-science" data-active={inView&&!reduced} aria-hidden="true"><svg viewBox="0 0 440 480" fill="none"><g stroke="#278b87" strokeWidth="2" className="portrait-water"><path data-science-bond pathLength="1" d="M28 72 58 94 88 72" /><circle cx="58" cy="94" r="13" fill="#eaf8f7" /><circle cx="28" cy="72" r="10" fill="#f8fafd" /><circle cx="88" cy="72" r="10" fill="#f8fafd" /><g fill="#17615f" stroke="none" fontSize="12" fontWeight="600" textAnchor="middle"><text x="58" y="98">O</text><text x="28" y="76">H</text><text x="88" y="76">H</text></g></g><g stroke="#8b73c4" strokeWidth="2" className="portrait-co2"><path data-science-bond pathLength="1" d="M348 219h23m-23 6h23m28-6h23m-23 6h23" /><g fill="#7560ab" stroke="none" fontSize="16" fontWeight="600" textAnchor="middle"><text x="336" y="228">O</text><text x="385" y="228">C</text><text x="435" y="228">O</text></g></g><path data-science-bond pathLength="1" className="portrait-orbit-path" d="M22 308Q-15 190 51 131M355 365Q440 330 426 273" stroke="#5ea9b4" strokeWidth="1" opacity=".4" /><circle data-science-particle cx="25" cy="278" r="4" fill="#3aa9a3" /><circle data-science-particle cx="414" cy="317" r="3" fill="#a28ad6" /><circle data-science-particle cx="90" cy="348" r="3" fill="#67bfdb" /><text x="320" y="62" fill="#407c92" fontSize="15" fontFamily="serif">ΔE</text></svg></aside>
}


