import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import SeoMetadata from './components/SeoMetadata'
import AnalyticsHooks from './components/AnalyticsHooks'
export default function App(){return <BrowserRouter><SeoMetadata /><AnalyticsHooks /><AppRoutes /></BrowserRouter>}
