import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { matterDescriptions } from '../../config/science'
import type { MatterState } from '../../config/science'
const liquid=[[64,126],[105,116],[146,132],[187,119],[228,133],[271,120],[77,168],[120,158],[162,175],[205,163],[250,175],[286,161]]
const gas=[[48,50],[143,35],[254,58],[313,32],[82,109],[188,96],[295,119],[39,187],[142,181],[241,200],[310,193],[198,148]]
const solid=Array.from({length:12},(_,index)=>[77+(index%4)*63,105+Math.floor(index/4)*47])
export default function MatterModel({state,onChange,active,reduced}:{state:MatterState;onChange:(state:MatterState)=>void;active:boolean;reduced:boolean}){
 const root=useRef<SVGSVGElement>(null)
 const context=useRef<gsap.Context|null>(null)
 const timeline=useRef<gsap.core.Timeline|null>(null)
 useEffect(()=>{
  if(reduced)return
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({paused:true,repeat:2,yoyo:true})
   timeline.current=tl
   root.current?.querySelectorAll('[data-particle]').forEach((particle,index)=>{
    const dx=state==='solid'?(index%2?2:-2):state==='liquid'?(index%2?9:-9):((index%3)-1)*20
    const dy=state==='solid'?(index%2?-2:2):state==='liquid'?(index%3-1)*7:(index%2?18:-18)
    const positions=state==='solid'?solid:state==='liquid'?liquid:gas
    const [baseX,baseY]=positions[index]
    const boundedX=Math.max(34-baseX,Math.min(326-baseX,dx))
    const boundedY=Math.max(34-baseY,Math.min(221-baseY,dy))
    tl.to(particle,{x:boundedX,y:boundedY,duration:state==='solid'?.65:state==='liquid'?1.2:1.8,ease:'sine.inOut'},0)
   })
  },root)
  context.current=ctx
  return()=>{ctx.revert();timeline.current=null;context.current=null}
 },[state,reduced])
 useEffect(()=>{if(!timeline.current)return;if(active&&!reduced){if(timeline.current.progress()===1)timeline.current.restart();else timeline.current.play()}else timeline.current.pause()},[active,reduced,state])
 const positions=state==='solid'?solid:state==='liquid'?liquid:gas
 return <div className="matter-model"><div className="matter-controls" role="group" aria-label="State of matter">{(['solid','liquid','gas'] as const).map(item=><button key={item} type="button" aria-pressed={state===item} onClick={()=>onChange(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div><svg ref={root} viewBox="0 0 360 255" role="img" aria-label={matterDescriptions[state]}><path d="M20 20v215h320V20" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" />{positions.map(([x,y],index)=><g key={`${state}-${index}`} transform={`translate(${x} ${y})`}><circle data-particle r="12" fill={state==='solid'?'#74ded8':state==='liquid'?'#b6a4f0':'#86dbfa'} /></g>)}</svg><p className="matter-explanation" role="status">{matterDescriptions[state]}</p><span className="science-note">Illustrative particle model. Sizes, paths, speeds and spacing are not to scale.</span></div>
}

