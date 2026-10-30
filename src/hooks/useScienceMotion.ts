import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
const subscribeMotion=(callback:()=>void)=>{
 const media=window.matchMedia('(prefers-reduced-motion: reduce)')
 media.addEventListener('change',callback)
 return()=>media.removeEventListener('change',callback)
}
export function useReducedMotion(){return useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>true)}
export function useScienceVisibility(){
 const root=useRef<HTMLElement>(null)
 const [inView,setInView]=useState(false)
 const [pageVisible,setPageVisible]=useState(true)
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>setInView(entries.some(entry=>entry.isIntersecting)),{threshold:.12})
  if(root.current)observer.observe(root.current)
  const change=()=>setPageVisible(!document.hidden)
  document.addEventListener('visibilitychange',change)
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',change)}
 },[])
 return {root,inView:inView&&pageVisible}
}
