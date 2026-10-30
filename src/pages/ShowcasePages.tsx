import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { ArrowLeft, ArrowRight, Image, Maximize2, Phone, Trophy, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { achievements, galleryPhotos, resultCategories, galleryCategories, publishableAchievements, publishableGallery } from '../config/showcase'
import type { Achievement, GalleryPhoto } from '../config/showcase'
import { institute } from '../config/institute'
import { Button, ResponsiveImage } from '../components/ui'

function ShowcaseHero({ gallery = false }: { gallery?: boolean }) {
 const name = gallery ? 'Gallery' : 'Results & Achievements'
 return <section className={`showcase-hero ${gallery ? 'showcase-hero-gallery' : ''}`}><div className="container"><nav className="academic-breadcrumb" aria-label="Breadcrumb"><ol><li><Link to="/">Home</Link></li><li aria-current="page">{name}</li></ol></nav><div className="showcase-hero-grid"><div><span className="eyebrow">{gallery ? 'INSIDE SRI VIDYA' : 'PROGRESS, WITH PERSPECTIVE'}</span><h1>{gallery ? <>The moments behind<br />the learning.</> : <>Every achievement.<br />An accurate story.</>}</h1><p>{gallery ? 'Explore real classroom moments, activities and events at Sri Vidya Classes. Every photograph shared here belongs to the institute’s story.' : 'A space for genuine student achievements, shared with permission and clear context. Only verified, approved records appear here.'}</p></div><div className="showcase-hero-symbol" aria-hidden="true">{gallery ? <Image size={80} strokeWidth={1} /> : <Trophy size={80} strokeWidth={1} />}<span>{gallery ? 'A REAL LOOK INSIDE' : 'CLARITY. EFFORT. PROGRESS.'}</span></div></div></div></section>
}
function ShowcaseContact() {
 return <section className="showcase-contact"><div className="container"><div><span className="eyebrow">LET’S START A CONVERSATION</span><h2>Get to know Sri Vidya Classes.</h2><p>Ask about our programs, learning environment and admissions.</p></div><Button to="/contact">Contact the institute <ArrowRight size={17} /></Button><a href={`tel:+91${institute.phone}`}><Phone size={16} />{institute.phone}</a></div></section>
}
export function ResultsPage({ records = achievements }: { records?: Achievement[] }) {
 const approved = publishableAchievements(records)
 const categories = resultCategories.filter(category => approved.some(record => record.category === category))
 const [selected, setSelected] = useState('All')
 const active = selected === 'All' || categories.includes(selected as typeof categories[number]) ? selected : 'All'
 const filtered = approved.filter(record => active === 'All' || record.category === active)
 return <div className="showcase-page"><ShowcaseHero /><section className="section"><div className="container"><div className="showcase-section-top"><div><span className="eyebrow">RESULTS & ACHIEVEMENTS</span><h2>Effort deserves recognition.</h2></div><p>Context matters. Coaching results and achievements associated with other institutions are labelled separately.</p></div>{approved.length > 0 && <><div className="showcase-filters" role="group" aria-label="Filter results">{['All', ...categories].map(category => <button key={category} aria-pressed={active === category} onClick={() => setSelected(category)}>{category}<span>{category === 'All' ? approved.length : approved.filter(record => record.category === category).length}</span></button>)}</div><p className="showcase-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'achievement' : 'achievements'} · {active}</p></>}{filtered.length ? <div className="achievement-grid">{filtered.map(record => <article className="achievement-card" key={record.id}><div className="achievement-photo"><ResponsiveImage src={record.photo.src} srcSet={record.photo.srcSet} width={record.photo.width} height={record.photo.height} alt={record.photo.alt} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /><span>{record.category} · {record.year}</span></div><div className="achievement-body"><span className={`achievement-context ${record.context === 'external-achievement' ? 'external-context' : ''}`}>{record.context === 'sri-vidya-coaching' ? 'Sri Vidya coaching result' : 'External institution achievement'}</span><h3>{record.studentName}</h3><p className="achievement-exam">{record.exam} · {record.year}</p><strong className="achievement-result">{record.result}</strong><p>{record.description}</p>{record.context === 'external-achievement' && <p className="achievement-disclosure">Associated institution: <strong>{record.institutionName}</strong>. This is not presented as a Sri Vidya coaching result.</p>}</div></article>)}</div> : <div className="showcase-empty"><span className="empty-symbol"><Trophy size={42} strokeWidth={1.2} aria-hidden="true" /></span><span className="eyebrow">VERIFICATION BEFORE PUBLICATION</span><h3>Good stories deserve the right details.</h3><p>Verified student results and approved photographs are not yet available. We’ll share achievements here once the records and publication permissions are confirmed.</p><div className="actions"><Button to="/programs">Explore our programs <ArrowRight size={17} /></Button><Button to="/contact" secondary>Ask the institute</Button></div></div>}<div className="showcase-editorial-note"><Trophy size={23} aria-hidden="true" /><p>A result belongs to its specific exam, year and student. An admission offer or an achievement at another institution is not a coaching result or a guarantee of future performance.</p></div></div></section><ShowcaseContact /></div>
}
export function GalleryPage({ photos = galleryPhotos }: { photos?: GalleryPhoto[] }) {
 const approved = publishableGallery(photos)
 const [selected, setSelected] = useState('All')
 const [activeId, setActiveId] = useState<string | null>(null)
 const filtered = approved.filter(photo => selected === 'All' || photo.category === selected)
 const active = filtered.findIndex(photo => photo.id === activeId)
 return <div className="showcase-page"><ShowcaseHero gallery /><section className="section"><div className="container"><div className="showcase-section-top"><div><span className="eyebrow">THE SRI VIDYA EXPERIENCE</span><h2>A window into everyday learning.</h2></div><p>Classroom, activities, events and achievements — through real, approved institute photographs.</p></div><div className="showcase-filters" role="group" aria-label="Filter gallery">{['All', ...galleryCategories].map(category => <button key={category} aria-pressed={selected === category} onClick={() => { setActiveId(null); setSelected(category) }}>{category}<span>{category === 'All' ? approved.length : approved.filter(photo => photo.category === category).length}</span></button>)}</div><p className="showcase-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'photograph' : 'photographs'} · {selected}</p>{filtered.length ? <div className="editorial-gallery">{filtered.map(photo => <figure key={photo.id}><button className="gallery-photo-button" aria-label={`View photo: ${photo.caption}`} aria-haspopup="dialog" onClick={() => setActiveId(photo.id)}><ResponsiveImage src={photo.src} srcSet={photo.srcSet} width={photo.width} height={photo.height} alt={photo.alt} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /><span className="photo-open"><Maximize2 size={18} aria-hidden="true" /></span></button><figcaption><span>{photo.category}</span><h3>{photo.caption}</h3></figcaption></figure>)}</div> : <div className="showcase-empty gallery-empty"><span className="empty-symbol"><Image size={42} strokeWidth={1.2} aria-hidden="true" /></span><span className="eyebrow">REAL MOMENTS, SHARED WITH CARE</span><h3>{approved.length ? `No ${selected.toLowerCase()} photographs yet.` : 'A real look inside. Coming soon.'}</h3><p>{approved.length ? 'Choose another category to explore the available institute photographs.' : 'Approved institute photographs will appear here once they are supplied and publication permissions are confirmed.'}</p>{selected !== 'All' ? <button className="button" onClick={() => setSelected('All')}>View all photographs <ArrowRight size={17} /></button> : <Button to="/about" secondary>Get to know Sri Vidya <ArrowRight size={17} /></Button>}</div>}</div></section><ShowcaseContact />{active >= 0 && <GalleryLightbox key={selected} photos={filtered} initialIndex={active} onClose={() => setActiveId(null)} />}</div>
}
function GalleryLightbox({ photos, initialIndex, onClose }: { photos: GalleryPhoto[]; initialIndex: number; onClose: () => void }) {
 const [index, setIndex] = useState(initialIndex)
 const dialog = useRef<HTMLDialogElement>(null)
 const touch = useRef<{ x: number; y: number } | null>(null)
 const photo = photos[index]
 const move = (delta: number) => setIndex(current => (current + delta + photos.length) % photos.length)
 useEffect(() => {
  const opener = document.activeElement as HTMLElement | null
  const overflow = document.body.style.overflow
  const modal = dialog.current
  modal?.showModal()
  document.body.style.overflow = 'hidden'
  return () => { modal?.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus() }
 }, [])
 const onTouchEnd = (event: TouchEvent) => {
  if (!touch.current || event.changedTouches.length !== 1 || event.touches.length) { touch.current = null; return }
  const dx = event.changedTouches[0].clientX - touch.current.x
  const dy = event.changedTouches[0].clientY - touch.current.y
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && photos.length > 1) move(dx < 0 ? 1 : -1)
  touch.current = null
 }
 return <dialog ref={dialog} className="gallery-lightbox" aria-labelledby="lightbox-caption" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }} onKeyDown={event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  if (event.key === 'Tab') {
   const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
   const first = controls[0], last = controls[controls.length - 1]
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
 }}><div className="lightbox-shell"><div className="lightbox-toolbar"><span role="status" aria-live="polite">{index + 1} / {photos.length} · {photo.category}</span><button className="lightbox-control" autoFocus aria-label="Close photo viewer" onClick={onClose}><X /></button></div><div className="lightbox-image" onTouchStart={event => { touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null }} onTouchEnd={onTouchEnd} onTouchCancel={() => { touch.current = null }}><img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 1000px) 94vw, 1100px" width={photo.width} height={photo.height} alt={photo.alt} decoding="async" /></div><div className="lightbox-bottom"><button className="lightbox-control" disabled={photos.length < 2} aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft /></button><div><h2 id="lightbox-caption">{photo.caption}</h2><p>Use arrow keys or swipe to explore. Escape closes the viewer.</p></div><button className="lightbox-control" disabled={photos.length < 2} aria-label="Next photo" onClick={() => move(1)}><ArrowRight /></button></div></div></dialog>
}


