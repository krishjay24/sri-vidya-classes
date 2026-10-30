import { Link, useLocation } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { pageInfo } from '../config/pages'
export function ContentPage(){
 const {pathname}=useLocation()
 const [title,description]=pageInfo[pathname]
 return <section className="section page-section"><div className="container"><nav className="academic-breadcrumb" aria-label="Breadcrumb"><ol><li><Link to="/">Home</Link></li><li aria-current="page">{title}</li></ol></nav><div className="section-heading"><span className="eyebrow">SRI VIDYA CLASSES</span><h1>{title}</h1><p>{description}</p></div><Card><h2>Website information</h2><p>Program, admission and other institute information will be published after approval. Visiting this website does not constitute an admission application or confirmation. Full terms are awaiting approval.</p></Card></div></section>
}
export function NotFound(){
 return <section className="section page-section"><div className="container"><div className="section-heading"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page is unavailable. Explore Sri Vidya Classes from the homepage.</p></div><Button to="/">Back to home</Button><div className="actions"><Link className="text-link" to="/programs">Explore programs</Link><Link className="text-link" to="/contact">Contact the institute</Link></div></div></section>
}
