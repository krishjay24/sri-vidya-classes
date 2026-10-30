import sharp from 'sharp'
import { mkdir,writeFile } from 'node:fs/promises'
import path from 'node:path'
export async function generateSeoMedia(routes,directory){
 await mkdir(path.join(directory,'social'),{recursive:true})
 // Preserve the official emblem; social cards contain no portrait or additional text.
 const crest=await sharp('src/assets/branding/sri-vidya-crest-original.png').resize(550,550,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).png().toBuffer()
 const buffer=await sharp({create:{width:1200,height:630,channels:3,background:'#FFFFFF'}}).composite([{input:crest,left:325,top:40}]).png({compressionLevel:9}).toBuffer()
 for(const route of [...routes,{path:'/404'}]){
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

