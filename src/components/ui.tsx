import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Button({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={`button ${secondary ? 'button-secondary' : ''}`} to={to}>{children}</Link>
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}
export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>
}
export function ResponsiveImage({ alt, ...props }: ComponentProps<'img'>) {
  return <img loading="lazy" decoding="async" {...props} alt={alt} className={`responsive-image ${props.className ?? ''}`} />
}
export function Motion({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`motion ${className}`}>{children}</div>
}

