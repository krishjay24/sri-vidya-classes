import {createServer} from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import path from 'node:path'
import {gzipSync} from 'node:zlib'
import {pathToFileURL} from 'node:url'
export async function createDistServer({directory='dist',port=4173,host='127.0.0.1'}={}){
 const root=path.resolve(directory)
 const manifest=JSON.parse(await readFile(path.join(root,'route-manifest.json'),'utf8'))
 const known=new Set(manifest.routes.map(route=>route.path))
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json'}
 const server=createServer(async(request,response)=>{
  if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{Allow:'GET, HEAD'});response.end();return}
  try{
   const url=new URL(request.url,'http://localhost')
   const pathname=decodeURIComponent(url.pathname)
   const normalized=pathname==='/'?'/':pathname.replace(/\/index\.html$|\/+$/g,'')||'/'
   if((pathname==='/index.html'||pathname!==normalized)&&known.has(normalized)){
    response.writeHead(301,{Location:normalized+url.search});response.end();return
   }
   let target=known.has(pathname)?path.join(root,pathname==='/'?'index.html':pathname.slice(1),'index.html'):path.resolve(root,'.'+pathname)
   if(pathname==='/')target=path.join(root,'index.html')
   if(!target.startsWith(root+path.sep)&&target!==root){response.writeHead(400);response.end();return}
   let status=pathname==='/404.html'?404:200
   try{if(!(await stat(target)).isFile())throw Error('Not a file')}catch{target=path.join(root,'404.html');status=404}
   const type=mime[path.extname(target)]??'application/octet-stream'
   const headers={'Content-Type':type,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':(pathname.startsWith('/social/')||pathname.startsWith('/media/education/'))?'public, max-age=3600, must-revalidate':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'}
   const route=manifest.routes.find(route=>route.path===pathname)
   if(!manifest.policy.indexing||status===404||route&&!route.indexable)headers['X-Robots-Tag']='noindex, nofollow'
   let body=await readFile(target)
   if(/gzip/.test(request.headers['accept-encoding']??'')&&/text|javascript|json|xml/.test(type)){body=gzipSync(body);headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding'}
   headers['Content-Length']=String(body.length)
   response.writeHead(status,headers);response.end(request.method==='HEAD'?undefined:body)
  }catch{response.writeHead(400,{'Content-Type':'text/plain'});response.end('Invalid request')}
 })
 await new Promise(resolve=>server.listen(port,host,resolve))
 return server
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const index=process.argv.indexOf('--port');const port=index>=0?Number(process.argv[index+1]):4173
 await createDistServer({port});console.log(`Prerendered site: http://127.0.0.1:${port}`)
}
