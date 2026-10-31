import assert from 'node:assert/strict'
import {readFile,stat} from 'node:fs/promises'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'
import {resolveSeoEnvironment,createSitemap,createRobots} from './seo-environment.mjs'
import {createDistServer} from './serve-dist.mjs'
import {getPageSeo,renderSeoHead} from '../dist-ssr/entry-server.js'
const root=path.resolve('dist')
const manifest=JSON.parse(await readFile(path.join(root,'route-manifest.json'),'utf8'))
const titles=new Set(),descriptions=new Set()
const known=new Set(manifest.routes.map(route=>route.path))
let images=0,links=0
for(const route of [...manifest.routes,{path:'/404.html',indexable:false}]){
 const file=route.path==='/'?'index.html':route.path==='/404.html'?'404.html':route.path.slice(1)+'/index.html'
 const html=await readFile(path.join(root,file),'utf8')
 assert(!html.includes('<!--seo-head-->'))
 assert(!html.includes('fonts.googleapis.com'))
 assert(!html.includes('fonts.gstatic.com'))
 const doc=new JSDOM(html).window.document
 assert.equal(doc.querySelectorAll('h1').length,1,`H1 ${route.path}`)
 assert((doc.querySelector('#root')?.textContent??'').length>200,`Crawler-readable content ${route.path}`)
 assert.equal(doc.querySelectorAll('title').length,1)
 assert(!titles.has(doc.title),`Unique title ${route.path}`);titles.add(doc.title)
 const description=doc.querySelector('meta[name="description"]')?.content
 assert(description&&!descriptions.has(description),`Unique description ${route.path}`);descriptions.add(description)
 const expected=getPageSeo(route.path)
 assert.equal(doc.querySelector('link[rel="canonical"]')?.href,expected.canonical)
 assert.equal(new URL(expected.canonical).origin,manifest.policy.siteUrl)
 assert.equal(doc.querySelector('meta[property="og:url"]')?.content,expected.canonical)
 assert.equal(doc.querySelector('meta[name="robots"]')?.content,expected.robots)
 assert.equal(doc.querySelector('meta[property="og:title"]')?.content,doc.title)
 assert.equal(doc.querySelector('meta[property="og:description"]')?.content,description)
 assert.equal(doc.querySelector('meta[name="twitter:card"]')?.content,'summary_large_image')
 const image=doc.querySelector('meta[property="og:image"]')?.content
 assert.equal(new URL(image).origin,manifest.policy.siteUrl)
 assert(image?.startsWith('https://'));assert.equal(image,doc.querySelector('meta[name="twitter:image"]')?.content)
 const metadata=await sharp(path.join(root,new URL(image).pathname)).metadata()
 assert.equal(metadata.width,1200);assert.equal(metadata.height,630);assert.equal(metadata.format,'png');images++
 const graph=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)
 assert.equal(graph['@context'],'https://schema.org')
 const org=graph['@graph'].find(item=>item['@type']==='EducationalOrganization')
 assert.equal(org.name,'Sri Vidya Classes');assert.equal(org.telephone,'+919959010394');assert.equal(org.address.addressLocality,'Kadapa');assert.equal(org.address.postalCode,'516001')
 const data=JSON.stringify(graph)
 for(const match of data.matchAll(/https?:[^"\s]+/g)){
  const url=new URL(match[0])
  if(url.hostname.endsWith('.invalid')||url.pathname.startsWith('/social/')||url.hash||url.pathname.startsWith('/programs/'))assert.equal(url.origin,manifest.policy.siteUrl)
 }
 for(const forbidden of ['aggregateRating','reviewRating','award','price','foundingDate','openingHours','geo'])assert(!new RegExp(`"${forbidden}"\\s*:`).test(data),`No invented ${forbidden}`)
 const crumbs=graph['@graph'].find(item=>item['@type']==='BreadcrumbList')
 if(route.path!=='/'&&route.path!=='/404.html'){
  assert(crumbs);crumbs.itemListElement.forEach((item,index)=>{assert.equal(item.position,index+1);assert(item.item.startsWith(manifest.policy.siteUrl))})
 }
 if(route.path.startsWith('/programs/'))assert(graph['@graph'].some(item=>item['@type']==='Course'))
 if(route.path.startsWith('/learning-hub/')){const article=graph['@graph'].find(item=>item['@type']==='Article');assert(article);assert.equal(article.image[0],image);assert(article.headline);assert(!article.datePublished)}
 for(const link of doc.querySelectorAll('link[href^="/"]'))await stat(path.join(root,link.getAttribute('href')))
 const ids=[...doc.querySelectorAll('[id]')].map(element=>element.id)
 assert.equal(ids.length,new Set(ids).size,`Duplicate IDs ${route.path}`)
 for(const element of doc.querySelectorAll('img')){
  assert(element.hasAttribute('alt'));assert(Number(element.width)>0&&Number(element.height)>0)
  if(element.getAttribute('src')?.startsWith('/'))await stat(path.join(root,element.getAttribute('src')))
 }
 for(const link of doc.querySelectorAll('a[href]')){
  const href=link.getAttribute('href')
  if(href.startsWith('#')){assert(doc.getElementById(href.slice(1)),`Anchor ${href}`);continue}
  if(!href.startsWith('/'))continue
  const url=new URL(href,manifest.policy.siteUrl)
  const normalized=url.pathname.replace(/\/+$/,'')||'/'
  assert(known.has(normalized),`Internal link ${href} in ${route.path}`)
  links++
 }
}
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8')
const xml=new JSDOM(sitemap,{contentType:'application/xml'}).window.document
const locs=[...xml.querySelectorAll('loc')].map(element=>element.textContent)
assert.equal(xml.documentElement.namespaceURI,'http://www.sitemaps.org/schemas/sitemap/0.9')
assert.equal(locs.length,manifest.policy.indexing?manifest.routes.filter(route=>route.indexable).length:0)
assert.equal(new Set(locs).size,locs.length)
for(const loc of locs){assert.equal(new URL(loc).origin,manifest.policy.siteUrl);assert(!loc.includes('?'));assert(manifest.routes.some(route=>route.indexable&&route.canonical===loc))}
const robots=await readFile(path.join(root,'robots.txt'),'utf8')
assert(robots.includes(manifest.policy.indexing?'Allow: /':'Disallow: /'))
assert.equal(robots,createRobots(manifest.policy))
if(manifest.policy.indexing)assert(robots.includes(`Sitemap: ${manifest.policy.siteUrl}/sitemap.xml`))
const redirects=await readFile(path.join(root,'_redirects'),'utf8')
assert(redirects.includes('/* /404.html 404'));assert(!redirects.includes('/* /index.html 200'))
const headers=await readFile(path.join(root,'_headers'),'utf8')
assert(headers.includes('max-age=31536000, immutable'))
if(!manifest.policy.indexing)assert(headers.startsWith('/*\n')&&headers.includes('X-Robots-Tag: noindex, nofollow'))
else assert(!headers.split('/assets/*')[0].includes('X-Robots-Tag'))
for(const file of ['robots.txt','sitemap.xml']){
 assert((await stat(path.join(root,file))).isFile())
 assert(!redirects.split('\n').some(line=>line.startsWith('/'+file+' ')))
}
for(const size of [32,64,180,192,512]){const meta=await sharp(path.join(root,`sri-vidya-icon-${size}.png`)).metadata();assert.equal(meta.width,size);assert.equal(meta.height,size)}
const svg=await readFile(path.join(root,'favicon.svg'),'utf8');assert(svg.includes('data:image/png;base64,'));assert(!svg.includes('vite'))
const ico=await readFile(path.join(root,'favicon.ico'));assert.equal(ico.readUInt16LE(2),1)
const approvedEnv={SEO_SITE_URL:'https://school.example',SEO_ENV:'production',SEO_DOMAIN_VERIFIED:'true',SEO_ALLOW_INDEXING:'true',SEO_BUSINESS_APPROVED:'true'}
const production=resolveSeoEnvironment(approvedEnv)
assert(production.indexing)
const productionXml=new JSDOM(createSitemap(manifest.routes,production),{contentType:'application/xml'}).window.document
assert.equal(productionXml.querySelectorAll('loc').length,manifest.routes.filter(route=>route.indexable).length)
assert(createRobots(production).includes('Sitemap: https://school.example/sitemap.xml'))
for(const CONTEXT of ['deploy-preview','branch-deploy'])assert(!resolveSeoEnvironment({...approvedEnv,CONTEXT}).indexing)
assert(!resolveSeoEnvironment({...approvedEnv,SEO_BUSINESS_APPROVED:'false'}).indexing)
assert(!resolveSeoEnvironment({...approvedEnv,SEO_ALLOW_INDEXING:'false'}).indexing)
assert(!resolveSeoEnvironment({}).indexing)
assert.throws(()=>resolveSeoEnvironment({SEO_SITE_URL:'srividyaclasses'}))
assert.throws(()=>resolveSeoEnvironment({SEO_SITE_URL:'http://school.example'}))
assert.throws(()=>resolveSeoEnvironment({SEO_ENV:'production',SEO_ALLOW_INDEXING:'true'}))
for(const route of manifest.routes){const seo=getPageSeo(route.path,production);assert.equal(seo.robots.startsWith('index'),route.indexable);const doc=new JSDOM(`<head>${renderSeoHead(route.path,production)}</head>`).window.document;assert(doc.querySelector('meta[property="og:image"]').content.startsWith('https://school.example/'))}
const server=await createDistServer({port:0})
try{
 const origin=`http://127.0.0.1:${server.address().port}`
 for(const [pathname,type] of [['/robots.txt','text/plain'],['/sitemap.xml','application/xml']]){
  const response=await fetch(origin+pathname)
  assert.equal(response.status,200)
  assert(response.headers.get('content-type').startsWith(type))
  assert.equal(await response.text(),await readFile(path.join(root,pathname),'utf8'))
 }
 for(const route of manifest.routes){
  const response=await fetch(origin+route.path)
  assert.equal(response.status,200)
  assert.equal(response.headers.get('x-robots-tag')?.includes('noindex')??false,!manifest.policy.indexing||!route.indexable)
 }
 assert.equal((await fetch(origin+'/not-a-public-route')).status,404)
}finally{await new Promise(resolve=>server.close(resolve))}
console.log(JSON.stringify({publicRoutes:manifest.routes.length,crawlerReadable:true,uniqueMetadata:true,socialImages:images,internalLinks:links,schema:'locally validated',sitemapUrls:locs.length,indexing:manifest.policy.indexing,environmentGates:'passed',icons:'passed',staticFileHttp:'passed'}))

