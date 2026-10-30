import fs from 'node:fs'
function edit(file,callback){let source=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'');fs.writeFileSync(file,callback(source))}
function replace(source,old,next){if(!source.includes(old))throw Error('Missing target: '+old.slice(0,100));return source.replace(old,next)}
const photoImport="import PromotionalPhoto from '../components/PromotionalPhoto'\n"
edit('src/pages/Home.tsx',source=>{
 source=photoImport+"import { programPhotos } from '../config/promotionalPhotos'\n"+source
 source=replace(source,'<div className="signature-card-top">','<PromotionalPhoto photo={programPhotos[program.slug]} attributionLink={false} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /><div className="signature-card-top">')
 source=replace(source,'<span className="why-watermark" aria-hidden="true">Learn.<br />Grow.</span>','<PromotionalPhoto photo="mentoring" />')
 source=replace(source,'<ol className="approach-steps">','<div className="approach-photo-layout"><PromotionalPhoto photo="study-method" /><ol className="approach-steps">')
 source=replace(source,'</li>)}</ol></div></section>','</li>)}</ol></div></div></section>')
 return source
})
edit('src/pages/AcademicPages.tsx',source=>{
 source=photoImport+"import { programPhotos } from '../config/promotionalPhotos'\n"+source
 source=replace(source,': <div className="academic-hero-art"',": kind === 'about' ? <PromotionalPhoto photo=\"classroom\" eager /> : <div className=\"academic-hero-art\"")
 // The environment placeholder remains reserved for future approved institute photos.
 source=replace(source,'<div className="catalogue-index"><span>0{index+1}</span><GraduationCap size={46} strokeWidth={1} aria-hidden="true" /></div>','<PromotionalPhoto photo={programPhotos[program.slug]} sizes="(max-width: 700px) 100vw, 30vw" />')
 source=replace(source,'<section id="overview"><span','<PromotionalPhoto photo={programPhotos[program.slug]} sizes="(max-width: 900px) 100vw, 65vw" /><section id="overview"><span')
 source=replace(source,'<h2>From an idea<br />to its application.</h2>','<h2>From an idea<br />to its application.</h2><PromotionalPhoto photo="molecular-model" />')
 return source
})
edit('src/pages/LearningPages.tsx',source=>{
 source=photoImport+"import type { PromotionalPhotoKey } from '../config/promotionalPhotos'\n"+source
 const start=source.indexOf(' const icons=')
 const end=source.indexOf('\n}\nfunction ArticleCard',start)
 if(start<0||end<0)throw Error('Article cover boundary missing')
 source=source.slice(0,start)+` const photos:Record<LearningArticle['cover'],PromotionalPhotoKey>={concept:'mentoring',jee:'problem-solving',neet:'science-learning',foundation:'school',study:'revision',chemistry:'glassware'}
 return <div className={\`article-cover photographic-cover \${large?'cover-large':''}\`}><PromotionalPhoto photo={photos[article.cover]} attributionLink={false} eager={large} sizes={large?'(max-width: 1280px) 100vw, 1280px':'(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw'} /><span className="cover-edition">SRI VIDYA · LEARNING NOTES</span><span className="cover-topic">{article.category}</span></div>`+source.slice(end)
 return source
})
edit('src/pages/EnquiryPages.tsx',source=>{
 source=photoImport+source
 source=replace(source,'<section className="admissions-hero"><div className="container">','<section className="admissions-hero"><div className="container admissions-photo-hero">')
 source=replace(source,'<a href="#admission-enquiry" className="button">Start an enquiry <ArrowRight size={17} /></a>','<a href="#admission-enquiry" className="button">Start an enquiry <ArrowRight size={17} /></a><PromotionalPhoto photo="study-discussion" eager />')
 source=replace(source,'<div className="guidance-card"><h3>','<div className="guidance-card"><PromotionalPhoto photo="study-discussion" /><h3>')
 return source
})
edit('src/components/science/ChemistryShowcase.tsx',source=>{
 source="import PromotionalPhoto from '../PromotionalPhoto'\n"+source
 return replace(source,'   <div className="science-footnote">','   <div className="science-photo-note"><PromotionalPhoto photo="glassware" /><div><span className="science-kicker">FROM REPRESENTATION TO UNDERSTANDING</span><h3>Models help us ask better questions.</h3><p>The diagrams explain particles and bonds. Laboratory photographs offer context, without implying that this equipment belongs to Sri Vidya Classes.</p></div></div>\n   <div className="science-footnote">')
})
// Remove obsolete floating-control declarations throughout the stylesheet; one definition follows.
edit('src/index.css',source=>source.replace(/[^{}]*\.contact-controls[^{}]*\{[^{}]*\}/g,rule=>rule.includes('body:has')||rule.includes('.contact-controls')?'':rule).replace('background:linear-gradient(90deg,var(--color-navy),var(--color-crimson));transform:scaleX(0)','background:linear-gradient(90deg,#102d52,#438ac0,#f3c94e);transform:scaleX(0)'))
