import { achievements, galleryPhotos, publishableAchievements, publishableGallery } from './showcase'
import { programs } from './academics'
export const signaturePrograms = programs
export const homepage = {
  classroomPhoto: '', // Approved WebP path. Never substitute an unrelated institute photo.
  classroomPhotoAlt: 'T. Balu Mahendra teaching at Sri Vidya Classes',
  gallery: publishableGallery(galleryPhotos),
  results: publishableAchievements(achievements).filter(record => record.context === 'sri-vidya-coaching').map(record => ({ title: record.studentName + ' · ' + record.exam + ' · ' + record.year, detail: record.result + ' — ' + record.description })), // Only approved, verified records.
  testimonials: [] as { quote: string; name: string; role: string }[], // Requires consent and approval.
}
export const faqs = [
  { question: 'Which programs can I enquire about?', answer: 'You can enquire about Classes 4–10 School Academics/Foundation, Classes 11–12 Board + JEE + NEET, and Organic Chemistry Mentorship. Contact the institute to confirm availability and the right fit.' },
  { question: 'How do I enquire about admission?', answer: 'Call 9959010394 to speak with Sri Vidya Classes. Share the student’s class and the program you are interested in, and ask about the next steps.' },
  { question: 'Where can I find fees and class timings?', answer: 'Please contact the institute for confirmed fees, batch timings and admission requirements. These details are not yet published on this website.' },
  { question: 'Are verified student results available?', answer: 'Approved result records are not yet available on the website. Results and achievements will be added after verification.' },
]


