import PromotionalPhoto from '../PromotionalPhoto'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Pause, Play, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { chemistryStory, reactionInventory } from '../../config/science'
import type { MatterState } from '../../config/science'
import { useReducedMotion, useScienceVisibility } from '../../hooks/useScienceMotion'
import ElementExplorer from './ElementExplorer'
import MatterModel from './MatterModel'
import MoleculeDiagram from './MoleculeDiagram'

export default function ChemistryShowcase(){
 const {root,inView}=useScienceVisibility()
 const reduced=useReducedMotion()
 const [step,setStep]=useState(0)
 const [playing,setPlaying]=useState(false)
 const [storyPaused,setStoryPaused]=useState(false)
 const [reacted,setReacted]=useState(false)
 const [transferDone,setTransferDone]=useState(false)
 const [matter,setMatter]=useState<MatterState>('solid')
 const [particles,setParticles]=useState(false)
 const stage=chemistryStory[step]
 const inventory=reacted?reactionInventory.products:reactionInventory.reactants
 const completeTransfer=useCallback(()=>setTransferDone(true),[])
 const selectStep=(index:number)=>{setPlaying(false);setStoryPaused(false);setParticles(false);setStep(index);setReacted(false);setTransferDone(false)}
 useEffect(()=>{
  if(!playing||!inView||reduced)return
  const timer=window.setTimeout(()=>{
   if(step===chemistryStory.length-1){setPlaying(false);return}
   const next=step+1
   setStep(next)
   if(next===3){setReacted(true);setTransferDone(false)}
   if(next===4)setMatter('solid')
  },stage.duration)
  return()=>window.clearTimeout(timer)
 },[playing,inView,reduced,step,stage.duration])
 useEffect(()=>{
  if(!particles||!inView||reduced)return
  const timer=window.setTimeout(()=>setParticles(false),6000)
  return()=>window.clearTimeout(timer)
 },[particles,inView,reduced,matter])
 useEffect(()=>{
  if(step!==4||!playing||!inView||reduced)return
  const liquid=window.setTimeout(()=>setMatter('liquid'),1700)
  const gas=window.setTimeout(()=>setMatter('gas'),3400)
  return()=>{window.clearTimeout(liquid);window.clearTimeout(gas)}
 },[step,playing,inView,reduced])
 const play=()=>{
  if(playing){setPlaying(false);setStoryPaused(true);return}
  setParticles(false)
  if(step===chemistryStory.length-1){setStep(0);setReacted(false);setTransferDone(false)}
  if(step===4)setMatter('solid')
  setStoryPaused(false);setPlaying(true)
 }
 return <section ref={root} className="section chemistry-showcase" aria-labelledby="chemistry-title" data-science-active={inView&&!reduced} data-story-step={step} data-playing={playing&&!reduced}>
  <div className="container"><div className="science-section-heading"><div><span className="eyebrow">THE CHEMISTRY STUDIO</span><h2 id="chemistry-title">See the idea.<br /><span>Follow the change.</span></h2></div><p>A small interactive lesson in connections, conservation and curiosity. Explore at your own pace, or play the visual story.</p></div>
  <div className="chemistry-studio-layout"><div className="science-workspace"><div className="science-toolbar"><span className="science-kicker">LEARNING IN MOTION <span aria-hidden="true">/</span> 0{step+1}</span><div><button type="button" aria-label="Restart chemistry story" onClick={()=>selectStep(0)}><RotateCcw size={17} /><span>Reset</span></button>{!reduced&&<button type="button" onClick={play} aria-pressed={playing}>{playing?<Pause size={17} />:<Play size={17} />}<span>{playing?'Pause story':step===5?'Replay story':'Play story'}</span></button>}</div></div>
    <div className="story-step-controls" role="group" aria-label="Chemistry story stages">{chemistryStory.map((item,index)=><button type="button" key={item.short} aria-pressed={step===index} onClick={()=>selectStep(index)}><span aria-hidden="true">0{index+1}</span>{item.short}</button>)}</div>
    <div className="science-stage"><div className="science-stage-heading"><h3>{stage.title}</h3><p id="science-stage-description" role="status" aria-live="polite">{stage.description}</p></div><div className="science-visual" aria-describedby="science-stage-description">
     {step<4&&<><MoleculeDiagram step={step} reacted={reacted} productsVisible={reacted&&(transferDone||reduced)} onComplete={completeTransfer} active={inView&&!reduced&&!storyPaused} reduced={reduced} /><div className="science-equation" role="img" aria-label="Hydronium aqueous plus hydroxide aqueous forms two water molecules, liquid"><span>H<sub>3</sub>O<sup>+</sup><small>(aq)</small></span><span>+</span><span>OH<sup>−</sup><small>(aq)</small></span><span className="equation-arrow">→</span><span>2H<sub>2</sub>O<small>(l)</small></span></div><div className="reaction-action">{step===3?<><button type="button" className="science-action" disabled={reacted&&!transferDone&&!reduced} onClick={()=>{if(reacted){setReacted(false);setTransferDone(false)}else{setStoryPaused(false);setReacted(true);setTransferDone(reduced)}}}>{reacted?'Show reactants':'Transfer the proton'}<ArrowRight size={16} /></button><span role="status">{reacted&&(transferDone||reduced)?'Products: ':'Reactants: '}{inventory.H} H atoms · {inventory.O} O atoms · total charge {inventory.charge}</span></>:<span className="science-note">{step===0?'Diagram assembly, not a chemical reaction pathway.':'H: hydrogen · O: oxygen. Connectivity is shown schematically.'}</span>}</div></>}
     {step===4&&<><MatterModel state={matter} onChange={value=>{setPlaying(false);setStoryPaused(false);setMatter(value);setParticles(false)}} active={inView&&!reduced&&(playing||particles)} reduced={reduced} />{!reduced&&<button type="button" className="science-action" onClick={()=>setParticles(!particles)} disabled={playing}>{particles?<Pause size={16} />:<Play size={16} />}{particles?'Pause particles':'Animate particles'}</button>}</>}
     {step===5&&<div className="science-conclusion"><span className="conclusion-mark" aria-hidden="true"><Check size={32} /></span><span className="science-kicker">UNDERSTANDING IS THE CONNECTION</span><p>Understand the mechanism.<br /><strong>Don’t just memorise<br />the reaction.</strong></p><Link to="/programs/organic-chemistry-mentorship">Explore Organic Chemistry <ArrowRight size={17} /></Link></div>}
    </div></div><div className="science-stage-footer"><button type="button" disabled={step===0} onClick={()=>selectStep(step-1)} aria-label="Previous chemistry stage"><ArrowLeft size={18} /><span>Previous</span></button><p>{reduced?'Reduced motion: choose any stage to explore the static diagrams.':playing&&!inView?'Story paused while out of view.':'Illustrative models, not exact molecular trajectories or simulations.'}</p><button type="button" disabled={step===5} onClick={()=>selectStep(step+1)} aria-label="Next chemistry stage"><span>Next</span><ArrowRight size={18} /></button></div>
   </div><ElementExplorer /></div>
   <div className="science-photo-note"><PromotionalPhoto photo="glassware" /><div><span className="science-kicker">FROM REPRESENTATION TO UNDERSTANDING</span><h3>Models help us ask better questions.</h3><p>The diagrams explain particles and bonds. Laboratory photographs offer context, without implying that this equipment belongs to Sri Vidya Classes.</p></div></div>
   <div className="science-footnote"><p>Neutralization: atoms and overall charge are conserved. The matter model is a separate illustration; the ordered solid represents a crystalline solid.</p><div><a href="https://openstax.org/books/chemistry/pages/14-summary" target="_blank" rel="noopener noreferrer">Reaction reference ↗</a><a href="https://openstax.org/books/chemistry-2e/pages/1-2-phases-and-classification-of-matter" target="_blank" rel="noopener noreferrer">Matter reference ↗</a></div></div>
  </div>
 </section>
}






