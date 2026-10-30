// Usage: node scripts/optimize-photo.mjs <approved-source-path> <unique-slug>
// Converts one approved local photograph; never changes the original.
import sharp from 'sharp'
import { mkdir, access } from 'node:fs/promises'
import path from 'node:path'
const [source, slug] = process.argv.slice(2)
if (!source || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) throw Error('Provide an approved source image and a unique lowercase slug.')
const directory = path.resolve('public/media', slug)
try { await access(directory); throw Error('Output already exists. Choose a unique slug to preserve existing photographs.') } catch (error) { if (error.code !== 'ENOENT') throw error }
const image = sharp(path.resolve(source)).rotate()
const metadata = await image.metadata()
const originalWidth = metadata.autoOrient?.width ?? metadata.width
if (!originalWidth) throw Error('Image dimensions unavailable')
await mkdir(directory, { recursive: true })
const widths = [...new Set([480, 800, 1200, 1600].map(width => Math.min(width, originalWidth)))]
const outputs=[]
for (const width of widths) {
 const filename = `${slug}-${width}.webp`
 const result = await image.clone().resize({ width, withoutEnlargement:true }).webp({quality:82,effort:5}).toFile(path.join(directory, filename))
 outputs.push({src:`/media/${slug}/${filename}`,width:result.width,height:result.height})
}
const largest=outputs.at(-1)
console.log(JSON.stringify({...largest,srcSet:outputs.map(item=>`${item.src} ${item.width}w`).join(', '),alt:'REQUIRED: describe the approved photograph',approved:false,consentConfirmed:false},null,2))
