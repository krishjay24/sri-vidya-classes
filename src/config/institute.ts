import { contact } from './contact'
import crest from '../assets/branding/sri-vidya-crest.webp'
import portrait from '../assets/faculty/t-balu-mahendra-800.webp'
import portraitSmall from '../assets/faculty/t-balu-mahendra-480.webp'
import portraitLarge from '../assets/faculty/t-balu-mahendra-1086.webp'

// Populate only with institute-approved information. Empty values are not published.
export const institute = {
  ...contact,

  openingHours: '', // Publish only when confirmed.
  counsellingOffered: false,
  demoClassOffered: false,

  logo: crest, // Approved asset path; preserve original proportions.
  facultyPhoto: portrait,
  facultyPhotoSrcSet: `${portraitSmall} 480w, ${portrait} 800w, ${portraitLarge} 1086w`,
  socials: [] as { name: string; url: string }[],
}
