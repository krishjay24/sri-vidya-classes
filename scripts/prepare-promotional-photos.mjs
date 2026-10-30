// Rebuild local responsive photographs from the reviewed Pexels downloads.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
const photos = [
 ['classroom',6936022,'RDNE Stock project','students-studying-inside-the-classroom','Students concentrating on their work in a classroom'],
 ['mentoring',8197536,'Yan Krukau','student-and-teacher-looking-at-the-blackboard','A teacher and student discussing mathematics at a blackboard'],
 ['school',5621937,'Gustavo Fring','woman-and-child-writing-on-whiteboard','A teacher helping a child work through mathematics on a whiteboard'],
 ['molecular-model',3825527,'RF._.studio _','crop-chemist-holding-in-hands-molecule-model','Hands holding a colourful molecular teaching model'],
 ['senior-study',8199659,'Yan Krukau','students-studying-inside-the-library','Students studying with books and notes in a library'],
 ['study-discussion',16420458,'Ludovic Delot','a-group-of-students-sitting-in-a-library-and-studying','Students discussing study materials around a library table'],
 ['problem-solving',7594201,'Mikhail Nilov','a-man-writing-on-a-notebook-while-studying','A student writing notes beside a laptop'],
 ['revision',7516381,'SHVETS production','focused-female-student-writing-in-notebook-during-exam-preparation-in-library','A student reviewing notes and writing at a library desk'],
 ['glassware',9628840,'Ivan S','close-up-shot-of-laboratory-glasswares','Laboratory glassware arranged on a work surface'],
 ['science-learning',8471975,'MART PRODUCTION','students-experimenting-using-laboratory-equipment-inside-the-laboratory','Two pupils exploring science with laboratory equipment'],
 ['study-method',7128752,'cottonbro studio','student-preparing-for-a-test','A student organising notes and books for revision'],
]
await mkdir('public/media/education',{recursive:true})
const records=[]
const contactSheet=[]
for(const [i,[key,id,author,slug,alt]] of photos.entries()){
 const input=`artifacts/licensed-photo-sources/${id}.jpg`
 // A consistent 3:2 crop reserves space before loading. No retouching or face changes.
 for(const width of [480,800,1200,1600])await sharp(input).rotate().resize(width,Math.round(width*2/3),{fit:'cover',position:'centre'}).webp({quality:78,effort:5}).toFile(`public/media/education/${key}-${width}.webp`)
 records.push({key,id,author,alt,source:`https://www.pexels.com/photo/${slug}-${id}/`,download:`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,license:'Pexels License',licenseUrl:'https://www.pexels.com/license/',reviewed:'2026-10-30',use:'Illustrative promotional photography only; not Sri Vidya students, staff or facilities.',widths:[480,800,1200,1600],transform:'3:2 centre crop, resize, WebP compression; metadata stripped.'})
 const label=Buffer.from(`<svg width="320" height="25"><rect width="320" height="25" fill="white"/><text x="8" y="18" font-size="16">${key} (${id})</text></svg>`)
 contactSheet.push({input:await sharp(input).resize(320,215,{fit:'cover'}).extend({bottom:25,background:'white'}).composite([{input:label,top:215,left:0}]).png().toBuffer(),left:i%4*320,top:Math.floor(i/4)*240})
}
await sharp({create:{width:1280,height:720,channels:3,background:'white'}}).composite(contactSheet).png().toFile('artifacts/photo-review.png')
await writeFile('public/media/education/credits.json',JSON.stringify(records,null,2)+'\n')
await writeFile('src/config/promotionalPhotos.ts',`// Licensed promotional photos. Never use these as approved institute records.\nexport const promotionalPhotos = ${JSON.stringify(Object.fromEntries(records.map(({key,alt,author,source})=>[key,{alt,author,source}])),null,2)} as const\nexport type PromotionalPhotoKey = keyof typeof promotionalPhotos\nexport const programPhotos: Record<string, PromotionalPhotoKey> = {\n 'school-academics-foundation':'school',\n 'board-jee-neet':'senior-study',\n 'organic-chemistry-mentorship':'molecular-model',\n}\n`)
console.log(`Prepared ${records.length} photographs, ${records.length*4} responsive WebP files, credits and review sheet.`)
