import sharp from 'sharp'
import { mkdir,writeFile } from 'node:fs/promises'
import path from 'node:path'
const xml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
function wrap(text,length=25){const lines=[];let line='';for(const word of text.split(/\s+/)){if((line+' '+word).trim().length>length&&line){lines.push(line);line=word}else line=(line+' '+word).trim()}if(line)lines.push(line);return lines.slice(0,4)}
export async function generateSeoMedia(routes,directory){
 await mkdir(path.join(directory,'social'),{recursive:true})
 const crest=await sharp('src/assets/branding/sri-vidya-crest-original.png').resize(104,104,{fit:'contain'}).png().toBuffer()
 const portrait=await sharp('src/assets/faculty/t-balu-mahendra-original.png').resize({height:540}).png().toBuffer()
 for(const route of [...routes,{path:'/404',label:'Find your next step',title:'Page not found'}]){
  const label=route.path==='/'?'A stronger foundation. A brighter tomorrow.':route.label
  const lines=wrap(label)
  const size=lines.length>3?42:48
  const text=lines.map((line,index)=>`<text x="64" y="${265+index*60}" font-size="${size}" font-weight="700">${xml(line)}</text>`).join('')
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#102D52"/><path d="M0 614H1200" stroke="#BB1633" stroke-width="32"/><circle cx="1000" cy="320" r="260" fill="#F3C94E"/><g fill="white" font-family="Arial, sans-serif"><text x="190" y="100" font-size="34" font-weight="700">Sri Vidya Classes</text><text x="192" y="133" font-size="15" letter-spacing="3" fill="#F3C94E">KADAPA · LEARNING WITH PURPOSE</text>${text}<text x="64" y="546" font-size="18" fill="#F3C94E">IIT-JEE · NEET · FOUNDATION · CHEMISTRY</text><text x="64" y="580" font-size="17">T. Balu Mahendra sir</text></g></svg>`
  const buffer=await sharp(Buffer.from(svg)).composite([{input:crest,left:64,top:48},{input:portrait,left:795,top:75}]).png({compressionLevel:9}).toBuffer()
  const name=route.path==='/'?'home':route.path.slice(1).replaceAll('/','-')
  await writeFile(path.join(directory,'social',name+'.png'),buffer)
 }
 for(const size of [32,64,180,192,512])await sharp('src/assets/branding/sri-vidya-crest-original.png').resize(size,size,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(path.join(directory,`sri-vidya-icon-${size}.png`))
 const png=await sharp('src/assets/branding/sri-vidya-crest-original.png').resize(256,256,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer()
 await writeFile(path.join(directory,'favicon.svg'),`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256"><title>Sri Vidya Classes official crest</title><image width="256" height="256" xlink:href="data:image/png;base64,${png.toString('base64')}"/></svg>`)
 const small=await sharp('src/assets/branding/sri-vidya-crest-original.png').resize(32,32).png().toBuffer()
 const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=32;header[7]=32;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(small.length,14);header.writeUInt32LE(22,18)
 await writeFile(path.join(directory,'favicon.ico'),Buffer.concat([header,small]))
 await writeFile(path.join(directory,'site.webmanifest'),JSON.stringify({name:'Sri Vidya Classes',short_name:'Sri Vidya',start_url:'/',display:'standalone',background_color:'#F8FAFD',theme_color:'#102D52',icons:[192,512].map(size=>({src:`/sri-vidya-icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))},null,2))
}

