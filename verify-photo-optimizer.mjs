import sharp from 'sharp'
import path from 'node:path'
import { mkdtemp, readdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
const directory=await mkdtemp(path.resolve('artifacts/phase5-optimizer-'))
const source=path.join(directory,'synthetic-check.png')
await sharp({create:{width:1000,height:700,channels:3,background:'#102d52'}}).png().toFile(source)
const script=path.resolve('scripts/optimize-photo.mjs')
const result=spawnSync(process.execPath,[script,source,'qa-synthetic'],{cwd:directory,encoding:'utf8'})
if(result.status!==0)throw Error(result.stderr)
const config=JSON.parse(result.stdout)
const files=await readdir(path.join(directory,'public/media/qa-synthetic'))
if(files.length!==3)throw Error('Unexpected variant count')
for(const name of files){
 const metadata=await sharp(path.join(directory,'public/media/qa-synthetic',name)).metadata()
 if(metadata.format!=='webp'||metadata.width>1000||metadata.exif)throw Error('Incorrect WebP output')
}
const second=spawnSync(process.execPath,[script,source,'qa-synthetic'],{cwd:directory,encoding:'utf8'})
if(second.status===0)throw Error('Overwrite protection failed')
if(config.approved||config.consentConfirmed)throw Error('Approval flags should default to false')
console.log(JSON.stringify({webpVariants:files.length,noUpscaling:true,overwriteProtection:'passed',approvalDefaults:false}))
