import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { institute } from '../config/institute'

const navigation = [['/', 'Home'], ['/about', 'About'], ['/programs', 'Programs'], ['/faculty', 'Faculty'], ['/results', 'Results'], ['/gallery', 'Gallery'], ['/learning-hub', 'Learning Hub'], ['/contact', 'Contact']] as const
export function Brand() {
  return <Link to="/" className="brand" aria-label={`${institute.name} home`}>{institute.logo && <img src={institute.logo} alt="Sri Vidya Classes crest" width={64} height={64} />}<span>Sri Vidya <strong>Classes</strong><small>LEARNING WITH PURPOSE</small></span></Link>
}
export default function Header() {
  const drawer = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const previousOverflow = useRef('')
  const open = () => {
    if (!drawer.current || drawer.current.open) return
    previousOverflow.current = document.body.style.overflow
    drawer.current.showModal()
    document.body.style.overflow = 'hidden'
  }
  const close = () => drawer.current?.close()
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1200px)')
    const onChange = () => { if (media.matches) drawer.current?.close() }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  const links = () => navigation.map(([to, name]) => <NavLink caseSensitive end={to === '/'} key={to} to={to} onClick={close}>{name}</NavLink>)
  return <header className="site-header"><div className="container header-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{links()}</nav><div className="header-contact"><a className="header-phone" href={`tel:+91${institute.phone}`}><Phone size={15} aria-hidden="true" />{institute.phone}</a><Link className="nav-cta" to="/admissions">Admission Enquiry <ArrowUpRight size={15} aria-hidden="true" /></Link></div><button ref={trigger} className="menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" onClick={open}><Menu /></button></div>
    <dialog ref={drawer} className="mobile-drawer" aria-labelledby="drawer-title" onClose={() => { document.body.style.overflow = previousOverflow.current; trigger.current?.focus() }} onKeyDown={e => {
      if (e.key !== 'Tab') return
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }} onClick={e => { if (e.target === e.currentTarget) close() }}>
      <div className="drawer-content"><div className="drawer-top"><span id="drawer-title">Sri Vidya Classes</span><button aria-label="Close navigation" autoFocus onClick={close}><X /></button></div><p className="drawer-label">EXPLORE SRI VIDYA</p><nav aria-label="Mobile navigation">{links()}</nav><div className="drawer-bottom"><a className="header-phone" href={`tel:+91${institute.phone}`}><Phone size={17} aria-hidden="true" />{institute.phone}</a><Link className="nav-cta" to="/admissions" onClick={close}>Admission Enquiry <ArrowUpRight size={16} /></Link></div></div>
    </dialog>
  </header>
}



