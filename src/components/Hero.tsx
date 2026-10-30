import ScienceBackdrop from './science/ScienceBackdrop'
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { institute } from '../config/institute'
import { Button, Motion, ResponsiveImage } from './ui'

export default function Hero() {
  return <section className="premium-hero" aria-labelledby="hero-title"><div className="container premium-hero-grid">
    <Motion className="hero-message"><span className="eyebrow"><span className="gold-line" />CLARITY IN EVERY CONCEPT</span><h1 id="hero-title">SRI VIDYA<br /><span>CLASSES.</span></h1><p className="program-line">IIT JEE <span>|</span> NEET <span>|</span> FOUNDATION</p><p className="hero-description">Build strong concepts for the classroom and beyond. Prepare for academic and competitive exams with understanding at the heart of every step.</p><div className="actions"><Button to="/admissions">Enquire for Admission <ArrowRight size={17} aria-hidden="true" /></Button><Button to="/programs" secondary>Explore Programs</Button></div><div className="hero-note"><BookOpen size={19} aria-hidden="true" /><span>Concept-based learning. Purposeful preparation.</span></div></Motion>
    <Motion className="portrait-stage"><div className="portrait-halo" aria-hidden="true" /><ScienceBackdrop /><span className="academic-symbol symbol-one" aria-hidden="true">ƒ(x)</span><span className="academic-symbol symbol-three" aria-hidden="true">π</span>{institute.facultyPhoto ? <ResponsiveImage className="teacher-portrait" src={institute.facultyPhoto} srcSet={institute.facultyPhotoSrcSet} sizes="(max-width: 700px) 320px, (max-width: 1199px) 45vw, 400px" alt="T. Balu Mahendra sir" width={1086} height={1448} loading="eager" fetchPriority="high" /> : <div className="portrait-pending"><BookOpen size={44} strokeWidth={1} aria-hidden="true" /><p>Approved faculty portrait<br />to be added</p></div>}<div className="portrait-name"><span>MEET YOUR FACULTY</span><h2>T. Balu Mahendra <small>sir</small></h2><Link to="/faculty">Get to know sir <ArrowRight size={14} /></Link></div></Motion>
    <Motion className="program-panel"><div className="panel-heading"><GraduationCap size={24} strokeWidth={1.5} aria-hidden="true" /><span>YOUR PATH FORWARD</span></div><h2>One foundation.<br />New possibilities.</h2><ul><li><span>01</span><div><h3>IIT JEE</h3><p>Engineering entrance preparation</p></div></li><li><span>02</span><div><h3>NEET</h3><p>Medical entrance preparation</p></div></li><li><span>03</span><div><h3>FOUNDATION</h3><p>Build academic fundamentals</p></div></li></ul><Link to="/programs">Explore programs <ArrowRight size={16} /></Link></Motion>
  </div></section>
}


