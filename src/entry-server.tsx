import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { publicRoutes, seoPolicy, getPageSeo, renderSeoHead } from './config/seo'
export { publicRoutes, seoPolicy, getPageSeo, renderSeoHead }
export function render(path:string){return renderToString(<StaticRouter location={path}><AppRoutes /></StaticRouter>)}
