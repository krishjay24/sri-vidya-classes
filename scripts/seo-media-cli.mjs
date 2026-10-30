import {generateSeoMedia} from './seo-media.mjs'
let input=''
for await(const chunk of process.stdin)input+=chunk
await generateSeoMedia(JSON.parse(input),process.argv[2])
