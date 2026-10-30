import sharp from 'sharp'
const crest='src/assets/branding/sri-vidya-crest-original.png'
const portrait='src/assets/faculty/t-balu-mahendra-original.png'
for(const file of [crest,portrait]) {const m=await sharp(file).metadata();console.log(JSON.stringify({file,width:m.width,height:m.height,alpha:m.hasAlpha}))}
await sharp(crest).resize({width:192,withoutEnlargement:true}).webp({quality:92,alphaQuality:100}).toFile('src/assets/branding/sri-vidya-crest.webp')
for(const width of [480,800,1086])await sharp(portrait).resize({width,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(`src/assets/faculty/t-balu-mahendra-${width}.webp`)
for(const size of [32,180,192,512])await sharp(crest).resize(size,size,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(`public/sri-vidya-icon-${size}.png`)
