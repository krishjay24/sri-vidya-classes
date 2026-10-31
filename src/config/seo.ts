import { articles } from './articles'
import { programs } from './academics'
import { contact } from './contact'
import { achievements, galleryPhotos, publishableAchievements, publishableGallery } from './showcase'
export interface SeoPolicy {siteUrl:string;production:boolean;domainVerified:boolean;businessApproved:boolean;indexing:boolean}
export const seoPolicy:SeoPolicy=__SEO_CONFIG__
export interface PublicRoute {path:string;title:string;description:string;label:string;indexable:boolean}
const pages:PublicRoute[]=[
 {path:'/',title:'Sri Vidya Classes, Kadapa | IIT-JEE, NEET & Foundation',description:'Explore school foundation, Classes 11–12 Board + JEE + NEET and Organic Chemistry Mentorship at Sri Vidya Classes, Kadapa, with T. Balu Mahendra sir.',label:'Home',indexable:true},
 {path:'/about',title:'About Sri Vidya Classes, Kadapa | Learning with Understanding',description:'Discover the teaching philosophy, learning values and academic focus of Sri Vidya Classes in Kadapa, with T. Balu Mahendra sir at its heart.',label:'About',indexable:true},
 {path:'/faculty',title:'T. Balu Mahendra sir | Sri Vidya Classes Faculty, Kadapa',description:'Meet T. Balu Mahendra sir at Sri Vidya Classes, Kadapa. Explore Chemistry mentorship and a teaching approach focused on understanding and practice.',label:'Faculty',indexable:true},
 {path:'/programs',title:'Academic Programs in Kadapa | Sri Vidya Classes',description:'Explore Classes 4–10 School Academics/Foundation, Classes 11–12 Board + JEE + NEET and Organic Chemistry Mentorship. Enquire about suitability and availability.',label:'Programs',indexable:true},
 {path:'/admissions',title:'Admission Enquiry | Sri Vidya Classes, Kadapa',description:'Choose your class, board and program to prepare an admission enquiry for Sri Vidya Classes, Kadapa. Review your details and choose when to send through WhatsApp.',label:'Admissions',indexable:true},
 {path:'/contact',title:'Contact Sri Vidya Classes | APHB Colony, Kadapa',description:'Contact Sri Vidya Classes on 9959010394. Find the institute at APHB Colony, beside Bandhan Bank, near Rajeev Park, Kadapa 516001. Please call before visiting.',label:'Contact',indexable:true},
 {path:'/faqs',title:'Classes & Admissions FAQs | Sri Vidya Classes, Kadapa',description:'Find answers about classes, programs, admission enquiries, curriculum, practice and guidance at Sri Vidya Classes. Contact the institute for confirmed details.',label:'FAQs',indexable:true},
 {path:'/learning-hub',title:'Learning Hub | JEE, NEET, Chemistry & Study Notes',description:'Read educational notes on concept-based learning, JEE and NEET preparation, school foundations, study techniques and organic chemistry, with worked exercises.',label:'Learning Hub',indexable:true},
 {path:'/counselling',title:'Academic Guidance Enquiries | Sri Vidya Classes, Kadapa',description:'Ask about suitable academic pathways at Sri Vidya Classes. Share the student’s class and goals; scheduled counselling and demo classes are not yet confirmed.',label:'Counselling & guidance',indexable:true},
 {path:'/results',title:'Verified Results & Achievements | Sri Vidya Classes',description:'A space for verified, approved student achievements at Sri Vidya Classes, with clear coaching and external-institution context. Records are shared only with permission.',label:'Results & Achievements',indexable:publishableAchievements(achievements).length>0},
 {path:'/gallery',title:'Classroom & Events Gallery | Sri Vidya Classes, Kadapa',description:'Explore approved Sri Vidya Classes photographs across Classroom, Activities, Events and Achievements. Institute photographs are shared only with permission.',label:'Gallery',indexable:publishableGallery(galleryPhotos).length>0},
 {path:'/privacy',title:'Privacy & Enquiry Information | Sri Vidya Classes',description:'Learn how Sri Vidya Classes enquiry forms use browser-tab drafts, consent and WhatsApp handoff. Reviewing a form does not submit your information.',label:'Privacy',indexable:true},
 {path:'/terms',title:'Website Terms | Sri Vidya Classes',description:'Read the current website information and terms notice for Sri Vidya Classes. An enquiry does not reserve a place or confirm admission.',label:'Terms',indexable:false},
]
export const publicRoutes:PublicRoute[]=[...pages,...programs.map(program=>({path:`/programs/${program.slug}`,title:program.slug==='school-academics-foundation'?'Classes 4–10 Foundation, Kadapa | Sri Vidya Classes':program.slug==='board-jee-neet'?'Classes 11–12 Board, JEE & NEET | Sri Vidya Classes, Kadapa':'Organic Chemistry Mentorship, Kadapa | Sri Vidya Classes',description:program.description+' Explore the overview, learning approach and eligibility; contact Sri Vidya Classes in Kadapa for confirmed details.',label:program.name,indexable:true})),...articles.map(article=>({path:`/learning-hub/${article.slug}`,title:`${article.title} | Sri Vidya Learning Hub`,description:article.summary,label:article.title,indexable:true}))]
export function normalizePath(input:string){const path=input.split(/[?#]/)[0];return path==='/'?'/':path.replace(/\/+$/,'')||'/'}
export function absoluteUrl(path:string,policy:SeoPolicy=seoPolicy){return new URL(path,policy.siteUrl+'/').href}
export function getPageSeo(input:string,policy:SeoPolicy=seoPolicy){
 const path=normalizePath(input)
 const route=publicRoutes.find(item=>item.path===path)
 const article=articles.find(item=>`/learning-hub/${item.slug}`===path)
 const program=programs.find(item=>`/programs/${item.slug}`===path)
 const title=route?.title??'Page Not Found | Sri Vidya Classes, Kadapa'
 const description=route?.description??'This page is unavailable. Explore Sri Vidya Classes programs, learning notes or contact the institute in Kadapa.'
 const canonical=absoluteUrl(route?path:'/404.html',policy)
 const image=absoluteUrl(`/social/${path==='/'?'home':route?path.slice(1).replaceAll('/','-'):'404'}.png?v=logo-1`,policy)
 const breadcrumbs=[{name:'Home',url:absoluteUrl('/',policy)},...(program?[{name:'Programs',url:absoluteUrl('/programs',policy)}]:article?[{name:'Learning Hub',url:absoluteUrl('/learning-hub',policy)}]:[]),...(path!=='/'&&route?[{name:route.label,url:canonical}]:[])]
 const organizationId=absoluteUrl('/#organization',policy)
 const organization={'@type':'EducationalOrganization','@id':organizationId,name:contact.name,url:absoluteUrl('/',policy),description:'School academics, foundation learning, Board + JEE + NEET preparation and Organic Chemistry Mentorship in Kadapa.',logo:{'@type':'ImageObject',url:absoluteUrl('/sri-vidya-icon-512.png',policy),width:512,height:512},image:absoluteUrl('/social/home.png?v=logo-1',policy),telephone:`+91${contact.phone}`,address:{'@type':'PostalAddress',...contact.postalAddress},areaServed:{'@type':'City',name:'Kadapa'},contactPoint:{'@type':'ContactPoint',telephone:`+91${contact.phone}`,contactType:'admission enquiries'}}
 const graph:Record<string,unknown>[]=[organization]
 if(route){
  graph.push({'@type':path==='/about'?'AboutPage':path==='/contact'?'ContactPage':path==='/programs'||path==='/learning-hub'?'CollectionPage':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'en-IN',about:{'@id':organizationId},...(path!=='/'?{breadcrumb:{'@id':canonical+'#breadcrumb'}}:{})})
  if(path!=='/')graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumb',itemListElement:breadcrumbs.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:item.url}))})
  const course=(item:typeof programs[number])=>({'@type':'Course','@id':absoluteUrl(`/programs/${item.slug}#course`,policy),name:item.name,description:item.description,url:absoluteUrl(`/programs/${item.slug}`,policy),courseCode:item.slug,educationalLevel:item.label,provider:{'@id':organizationId}})
  if(program)graph.push(course(program))
  if(path==='/programs'){graph.push(...programs.map(course));graph.push({'@type':'ItemList',itemListElement:programs.map((item,index)=>({'@type':'ListItem',position:index+1,item:{'@id':absoluteUrl(`/programs/${item.slug}#course`,policy)}}))})}
  if(article)graph.push({'@type':'Article','@id':canonical+'#article',mainEntityOfPage:{'@id':canonical+'#webpage'},headline:article.title,description:article.summary,image:[image],articleSection:article.category,inLanguage:'en-IN',author:{'@type':'Organization',name:'Sri Vidya Learning Hub',url:absoluteUrl('/learning-hub',policy)},publisher:{'@id':organizationId},citation:article.sources.map(source=>source.url)})
 }
 return {path,route,title,description,canonical,image,breadcrumbs,status:route?200:404,robots:policy.indexing&&route?.indexable?'index,follow,max-image-preview:large':'noindex,nofollow',type:article?'article':'website',schema:{'@context':'https://schema.org','@graph':graph}}
}
export const escapeHtml=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
export function renderSeoHead(path:string,policy:SeoPolicy=seoPolicy){
 const seo=getPageSeo(path,policy),escape=escapeHtml
 const meta=(key:string,value:string,property=false)=>`<meta ${property?'property':'name'}="${key}" content="${escape(value)}" data-seo="true">`
 return [`<title data-seo="true">${escape(seo.title)}</title>`,meta('description',seo.description),meta('robots',seo.robots),`<link rel="canonical" href="${escape(seo.canonical)}" data-seo="true">`,meta('og:type',seo.type,true),meta('og:site_name',contact.name,true),meta('og:locale','en_IN',true),meta('og:title',seo.title,true),meta('og:description',seo.description,true),meta('og:url',seo.canonical,true),meta('og:image',seo.image,true),meta('og:image:secure_url',seo.image,true),meta('og:image:type','image/png',true),meta('og:image:width','1200',true),meta('og:image:height','630',true),meta('og:image:alt',`${contact.name}, Kadapa — official Sri Vidya Classes logo`,true),meta('twitter:card','summary_large_image'),meta('twitter:title',seo.title),meta('twitter:description',seo.description),meta('twitter:image',seo.image),meta('twitter:image:alt',`${contact.name}, Kadapa — official Sri Vidya Classes logo`),`<script type="application/ld+json" data-seo="true">${JSON.stringify(seo.schema).replaceAll('<','\\u003c')}</script>`].join('\n')
}

