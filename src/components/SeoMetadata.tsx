import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageSeo, renderSeoHead } from '../config/seo'
export default function SeoMetadata(){
 const {pathname,search}=useLocation()
 useEffect(()=>{
  const seo=getPageSeo(pathname)
  const template=document.createElement('template')
  template.innerHTML=renderSeoHead(pathname)
  document.head.querySelectorAll('[data-seo]').forEach(element=>element.remove())
  document.head.append(template.content)
  if(search&&(pathname==='/learning-hub'||pathname==='/gallery'||pathname==='/results'))document.querySelector('meta[name="robots"]')?.setAttribute('content','noindex,follow')
  document.title=seo.title
 },[pathname,search])
 return null
}
