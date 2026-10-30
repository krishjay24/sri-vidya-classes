import {readFile,writeFile,mkdir} from 'node:fs/promises'
import path from 'node:path'
import { publicRoutes,seoPolicy,getPageSeo,renderSeoHead,render } from '../dist-ssr/entry-server.js'
import {configureFontCache} from './font-cache.mjs'
await configureFontCache()
const {spawnSync}=await import('node:child_process')
const {createSitemap,createRobots}=await import('./seo-environment.mjs')
const output=path.resolve('dist')
const template=await readFile(path.join(output,'index.html'),'utf8')
const media=spawnSync(process.execPath,[path.resolve('scripts/seo-media-cli.mjs'),output],{input:JSON.stringify(publicRoutes),encoding:'utf8'})
if(media.status!==0)throw Error(media.stderr||'Social image generation failed')
if(media.stderr)process.stderr.write(media.stderr)
const routes=[...publicRoutes,{path:'/404.html'}]
for(const route of routes){
 const html=template.replace('<!--seo-head-->',renderSeoHead(route.path)).replace('<div id="root"></div>',`<div id="root">${render(route.path)}</div>`)
 const target=route.path==='/404.html'?path.join(output,'404.html'):route.path==='/'?path.join(output,'index.html'):path.join(output,route.path.slice(1),'index.html')
 await mkdir(path.dirname(target),{recursive:true});await writeFile(target,html)
}
await writeFile(path.join(output,'sitemap.xml'),createSitemap(publicRoutes,seoPolicy))
await writeFile(path.join(output,'robots.txt'),createRobots(seoPolicy))
const redirects=['/404.html /404.html 404!','/index.html / 301!',...publicRoutes.filter(route=>route.path!=='/').flatMap(route=>[`${route.path}/ ${route.path} 301!`,`${route.path}/index.html ${route.path} 301!`,`${route.path} ${route.path}/index.html 200!`]),'/* /404.html 404']
await writeFile(path.join(output,'_redirects'),redirects.join('\n')+'\n')
const headers=['/*','  Cache-Control: public, max-age=0, must-revalidate','  X-Content-Type-Options: nosniff','  Referrer-Policy: strict-origin-when-cross-origin','  Permissions-Policy: camera=(), microphone=(), geolocation=()',...(seoPolicy.indexing?[]:['  X-Robots-Tag: noindex, nofollow']),'/assets/*','  Cache-Control: public, max-age=31536000, immutable','/social/*','  Cache-Control: public, max-age=3600, must-revalidate','/media/education/*','  Cache-Control: public, max-age=3600, must-revalidate','/404.html','  X-Robots-Tag: noindex, nofollow']
if(seoPolicy.indexing)for(const route of publicRoutes.filter(route=>!route.indexable))headers.push(route.path,'  X-Robots-Tag: noindex, nofollow',route.path+'/index.html','  X-Robots-Tag: noindex, nofollow')
await writeFile(path.join(output,'_headers'),headers.join('\n')+'\n')
await writeFile(path.join(output,'route-manifest.json'),JSON.stringify({policy:seoPolicy,routes:publicRoutes.map(route=>({path:route.path,indexable:route.indexable,canonical:getPageSeo(route.path).canonical})),notFound:'/404.html'},null,2))
console.log(`Prerendered ${publicRoutes.length} public routes plus 404. Indexing: ${seoPolicy.indexing?'enabled':'disabled (staging-safe)'}.`)


