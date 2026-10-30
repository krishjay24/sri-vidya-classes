import {writeFile,mkdir} from 'node:fs/promises'
import path from 'node:path'
export async function configureFontCache(){
 if(process.platform!=='win32')return
 const directory=path.resolve('node_modules/.cache/sri-vidya-fonts')
 await mkdir(path.join(directory,'cache'),{recursive:true})
 const config=path.join(directory,'fonts.conf')
 const cache=path.join(directory,'cache').replaceAll('\\','/').replaceAll('&','&amp;')
 await writeFile(config,`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>C:/Windows/Fonts</dir><cachedir>${cache}</cachedir></fontconfig>`)
 process.env.FONTCONFIG_PATH=directory.replaceAll('\\','/')
 process.env.FONTCONFIG_FILE=config.replaceAll('\\','/')
}
