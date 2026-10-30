export type ResultCategory = 'Board' | 'IIT-JEE' | 'NEET' | 'Foundation'
export type GalleryCategory = 'Classroom' | 'Activities' | 'Events' | 'Achievements'
export interface ApprovedPhoto {
  src: string; srcSet?: string; width: number; height: number; alt: string
  approved: boolean; consentConfirmed: boolean
}
export interface Achievement {
  id: string; category: ResultCategory; studentName: string; exam: string; year: number
  result: string; description: string; photo: ApprovedPhoto
  context: 'sri-vidya-coaching' | 'external-achievement'
  institutionName?: string; verified: boolean; approved: boolean
}
export interface GalleryPhoto extends ApprovedPhoto {
  id: string; category: GalleryCategory; caption: string; institutePhoto: boolean
}
// Add only verified records with permission to publish names, results and photos.
export const achievements: Achievement[] = []
export const galleryPhotos: GalleryPhoto[] = []
export const resultCategories: ResultCategory[] = ['Board', 'IIT-JEE', 'NEET', 'Foundation']
export const galleryCategories: GalleryCategory[] = ['Classroom', 'Activities', 'Events', 'Achievements']
export function isApprovedPhoto(photo: ApprovedPhoto) {
  return photo.approved && photo.consentConfirmed && !!photo.src.trim() && !!photo.alt.trim() && photo.width > 0 && photo.height > 0
}
export function publishableAchievements(records: Achievement[]) {
  return records.filter(record => record.verified && record.approved && isApprovedPhoto(record.photo) && record.studentName.trim() && record.exam.trim() && record.result.trim() && record.description.trim() && Number.isInteger(record.year) && record.year > 0 && (record.context === 'sri-vidya-coaching' || (record.context === 'external-achievement' && record.institutionName?.trim())))
}
export function publishableGallery(records: GalleryPhoto[]) {
  return records.filter(photo => isApprovedPhoto(photo) && photo.institutePhoto && photo.caption.trim())
}
