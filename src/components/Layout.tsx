import { AcademicLoader, ScrollProgress } from './SiteMotion'
import Header, { Brand } from './Header'
import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import ContactControls from './ContactControls'
import { institute } from '../config/institute'

export default function Layout() {

  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView()); return }
    window.scrollTo(0, 0)
    if (pathname !== '/') document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div id="page-top" tabIndex={-1} />
    <ScrollProgress />
    <AcademicLoader />
    <Header />
    <main id="main-content" tabIndex={-1}><Outlet /></main>
    <footer><div className="container footer-grid"><div><Brand /><p>A thoughtful beginning to your next chapter.</p><span className="footer-label">T. Balu Mahendra</span></div><div><h2>Explore</h2><Link to="/about">About the institute</Link><Link to="/programs">Programs</Link><Link to="/faculty">Meet the faculty</Link></div><div><h2>Useful links</h2><Link to="/admissions">Admissions</Link><Link to="/learning-hub">Learning Hub</Link><Link to="/faqs">FAQs</Link><Link to="/contact">Contact</Link></div><div><h2>Stay connected</h2>{institute.address && <p>{institute.address}</p>}{institute.phone && <a href={`tel:${institute.phone}`}>{institute.phone}</a>}{institute.socials.map(s => <a href={s.url} key={s.name} target="_blank" rel="noopener noreferrer">{s.name}</a>)}<a href={`tel:+91${institute.secondaryPhone}`}>{institute.secondaryPhone}</a><p>Please call ahead before visiting.</p></div></div><div className="container footer-bottom"><span>© 2026 Sri Vidya Classes. All Rights Reserved.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><span className="footer-credit">Developed by K J Tech Solutions</span></div></footer>
    <ContactControls />
  </>
}







