import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useHomepageReveals() {
 const root=useRef<HTMLDivElement>(null)
 useEffect(()=>{
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const observers:IntersectionObserver[]=[]
   const registered=new WeakSet<HTMLElement>()
   const context=gsap.context(()=>{},root)
   const register=()=>root.current?.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach(group=>{
    if(registered.has(group))return
    registered.add(group)
    const targets=Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'))
    let timeline:gsap.core.Timeline|null=null
    const observer=new IntersectionObserver(entries=>{
     const visible=entries.some(entry=>entry.isIntersecting)
     if(!visible){timeline?.pause();group.dataset.revealState='paused';return}
     group.dataset.revealState='playing'
     if(timeline){timeline.play();return}
     context.add(()=>{
      timeline=gsap.timeline({onComplete:()=>{group.dataset.revealState='complete';observer.disconnect()}})
      targets.forEach((target,index)=>{
       const photo=target.classList.contains('spotlight-media')
       const card=target.classList.contains('signature-card')||target.classList.contains('learning-card')
       timeline!.fromTo(target,{opacity:0,y:photo?12:card?26:16,...(photo?{clipPath:'inset(0% 0% 10% 0% round 24px)'}:card?{scale:.985}:{} )},{opacity:1,y:0,scale:1,...(photo?{clipPath:'inset(0% 0% 0% 0% round 24px)'}:{}),duration:photo?.95:.7,ease:'power2.out',clearProps:'opacity,transform,clipPath'},index*.09)
      })
     })
    },{threshold:.08})
    observer.observe(group);observers.push(observer)
   })
   register()
   const changes=new MutationObserver(register)
   if(root.current)changes.observe(root.current,{childList:true,subtree:true})
   return()=>{changes.disconnect();observers.forEach(observer=>observer.disconnect());context.revert();root.current?.querySelectorAll('[data-reveal-state]').forEach(group=>group.removeAttribute('data-reveal-state'))}
  })
  return()=>media.revert()
 },[])
 return root
}
