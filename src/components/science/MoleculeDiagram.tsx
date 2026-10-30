import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
export default function MoleculeDiagram({step,reacted,productsVisible,onComplete,active,reduced}:{step:number;reacted:boolean;productsVisible:boolean;onComplete:()=>void;active:boolean;reduced:boolean}){
 const root=useRef<SVGSVGElement>(null)
 const animation=useRef<gsap.core.Timeline|null>(null)
 const done=useRef(onComplete)
 const marker=useId()
 useEffect(()=>{done.current=onComplete},[onComplete])
 useEffect(()=>{
  if(reduced)return
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({paused:true})
   animation.current=tl
   if(step===0)tl.fromTo('[data-atom]',{opacity:0,scale:.7,transformOrigin:'center'},{opacity:1,scale:1,duration:.6,stagger:.09,ease:'back.out(1.25)'})
   if(step===1)tl.fromTo('[data-bond]',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.8,stagger:.12,ease:'power2.out'})
   if(step===2)tl.fromTo('[data-assembly]',{rotation:-4,transformOrigin:'50% 50%'},{rotation:0,duration:1,ease:'power2.out'})
   if(step===3&&!reacted)tl.fromTo('[data-electron-arrow]',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.9,stagger:.15,ease:'power2.out'})
   if(step===3&&reacted){
    tl.fromTo('[data-transfer]',{attr:{transform:'translate(0 0)'}},{attr:{transform:'translate(156 0)'},duration:1.4,ease:'power2.inOut'},0)
    tl.fromTo('[data-breaking]',{attr:{x2:222},opacity:1},{attr:{x2:378},opacity:0,duration:1.4},0)
    tl.fromTo('[data-forming]',{attr:{x1:222},opacity:0},{attr:{x1:378},opacity:1,duration:1.4},0)
    tl.call(()=>done.current())
   }
  },root)
  return()=>{ctx.revert();animation.current=null}
 },[step,reacted,reduced])
 useEffect(()=>{if(active&&!reduced)animation.current?.play();else animation.current?.pause()},[active,reduced,step,reacted])
 const bonded=step>0
 const atoms=[{id:'O-a',x:180,y:160,symbol:'O'},{id:'H-a',x:124,y:126,symbol:'H'},{id:'H-b',x:220,y:112,symbol:'H'},{id:'O-b',x:420,y:160,symbol:'O'},{id:'H-c',x:476,y:126,symbol:'H'}]
 return <svg ref={root} className="molecule-diagram" viewBox={step===0?'60 40 480 260':'95 75 410 225'} role="img" aria-label={step===0?'Diagram pieces: four hydrogen atoms and two oxygen atoms.':reacted?'Proton transfer schematic, ending with two water molecules.':'Connectivity diagram of hydronium, H3O+, and hydroxide, OH−.'}><defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7" fill="#74ded8" /></marker></defs><g data-assembly>{bonded&&<g className="chemical-bonds" fill="none" stroke="#87dfe7" strokeWidth="3" strokeLinecap="round"><line data-bond pathLength="1" x1="180" y1="160" x2="124" y2="126" /><line data-bond pathLength="1" x1="180" y1="160" x2="220" y2="112" /><line data-bond pathLength="1" x1="420" y1="160" x2="476" y2="126" /><line data-bond data-breaking pathLength="1" x1="180" y1="160" x2={reacted?378:222} y2="210" opacity={reacted?0:1} /><line data-forming x1={reacted?378:222} y1="210" x2="420" y2="160" opacity={reacted?1:0} /></g>}{step===3&&!reacted&&<g className="electron-arrows" fill="none" stroke="#74ded8" strokeWidth="2"><path data-electron-arrow pathLength="1" d="M392 174 Q310 135 236 198" markerEnd={`url(#${marker})`} /><path data-electron-arrow pathLength="1" d="M201 186 Q159 212 173 183" markerEnd={`url(#${marker})`} /><circle cx="390" cy="172" r="2" fill="#74ded8" /><circle cx="398" cy="177" r="2" fill="#74ded8" /></g>}{atoms.map((atom,index)=><g key={atom.id} transform={`translate(${step===0?atom.x+(index%2? -30:18):atom.x} ${step===0?atom.y+(index%2?-35:20):atom.y})`}><g data-atom><circle r={atom.symbol==='O'?25:19} fill={atom.symbol==='O'?'#BB1633':'#f2f7ff'} stroke={atom.symbol==='O'?'#ef9bad':'#a8ddeb'} strokeWidth="2" /><text textAnchor="middle" dy=".35em" fill={atom.symbol==='O'?'white':'#102D52'} fontSize="18" fontWeight="700">{atom.symbol}</text></g></g>)}<g data-transfer transform={`translate(${reacted?156:0} 0)`}><g transform={`translate(222 ${step===0?240:210})`}><g data-atom><circle r="19" fill="#f2f7ff" stroke={step===3?'#b6a4f0':'#a8ddeb'} strokeWidth={step===3?4:2} /><text textAnchor="middle" dy=".35em" fill="#102D52" fontSize="18" fontWeight="700">H</text></g></g></g></g>{bonded&&<g className="species-labels" fill="currentColor" fontSize="19" textAnchor="middle"><text x="180" y="285">{productsVisible?'H₂O':'H₃O⁺'}</text><text x="420" y="285">{productsVisible?'H₂O':'OH⁻'}</text><text x="300" y="168" fontSize="23" opacity=".6">+</text></g>}</svg>
}




