import { promotionalPhotos, type PromotionalPhotoKey } from '../config/promotionalPhotos'

/** Stock imagery stays separate from approved institute photographs. */
export default function PromotionalPhoto({photo,className='',sizes='(max-width: 700px) 100vw, 50vw',eager=false,attributionLink=true}:{photo:PromotionalPhotoKey;className?:string;sizes?:string;eager?:boolean;attributionLink?:boolean}){
 const record=promotionalPhotos[photo]
 const path=`/media/education/${photo}`
 return <figure className={`promotional-photo ${className}`}><img src={`${path}-800.webp`} srcSet={[480,800,1200,1600].map(width=>`${path}-${width}.webp ${width}w`).join(', ')} sizes={sizes} width={1200} height={800} alt={`${record.alt} — illustrative stock photograph`} loading={eager?'eager':'lazy'} decoding="async" /><figcaption>Illustrative stock photo · not Sri Vidya people or facilities.{attributionLink&&<> <a href={record.source} target="_blank" rel="noopener noreferrer">{record.author} / Pexels ↗</a></>}</figcaption></figure>
}
