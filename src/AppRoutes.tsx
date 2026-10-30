import { ArticlePage, LearningHubPage } from './pages/LearningPages'
import { AdmissionsPage, ContactPage, CounsellingPage, PrivacyPage } from './pages/EnquiryPages'
import { GalleryPage, ResultsPage } from './pages/ShowcasePages'
import { pageInfo } from './config/pages'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { ContentPage, NotFound } from './pages/ContentPage'
import { AboutPage, FacultyPage, FaqsPage, ProgramDetailPage, ProgramsPage } from './pages/AcademicPages'
const academicRoutes = { '/learning-hub': LearningHubPage, '/admissions': AdmissionsPage, '/contact': ContactPage, '/counselling': CounsellingPage, '/privacy': PrivacyPage, '/results': ResultsPage, '/gallery': GalleryPage, '/about': AboutPage, '/faculty': FacultyPage, '/programs': ProgramsPage, '/faqs': FaqsPage }
export default function AppRoutes() {
  return <Routes><Route caseSensitive element={<Layout />}><Route caseSensitive index element={<Home />} />{Object.entries(academicRoutes).map(([path,Page])=><Route caseSensitive key={path} path={path} element={<Page />} />)}{Object.keys(pageInfo).filter(path=>!(path in academicRoutes)).map(path => <Route caseSensitive key={path} path={path} element={<ContentPage />} />)}<Route caseSensitive path="/programs/:slug" element={<ProgramDetailPage />} /><Route caseSensitive path="/learning-hub/:slug" element={<ArticlePage />} /><Route caseSensitive path="*" element={<NotFound />} /></Route></Routes>
}





