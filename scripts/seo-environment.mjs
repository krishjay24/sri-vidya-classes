export function resolveSeoEnvironment(env) {
 const candidate=(env.SEO_SITE_URL??'').trim()
 let siteUrl='https://sri-vidya-classes.invalid'
 if(candidate){
  const url=new URL(candidate)
  const labels=url.hostname.split('.')
  const validDomain=labels.length>1&&labels.every(label=>/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))&&/^(?:[a-z]{2,63}|xn--[a-z0-9-]+)$/.test(labels.at(-1))
  if(url.protocol!=='https:'||!validDomain||url.username||url.password||url.search||url.hash||url.pathname!=='/'||url.port)throw Error('SEO_SITE_URL must be a complete HTTPS origin without a path, port or credentials.')
  siteUrl=url.origin
 }
 const production=env.SEO_ENV==='production'&&(!env.CONTEXT||env.CONTEXT==='production')
 const domainVerified=env.SEO_DOMAIN_VERIFIED==='true'&&!!candidate&&!new URL(siteUrl).hostname.endsWith('.invalid')
 if(production&&env.SEO_ALLOW_INDEXING==='true'&&!domainVerified)throw Error('Production indexing requires a full SEO_SITE_URL and SEO_DOMAIN_VERIFIED=true. No domain is assumed.')
 const businessApproved=env.SEO_BUSINESS_APPROVED==='true'
 return {siteUrl,production,domainVerified,businessApproved,indexing:production&&domainVerified&&businessApproved&&env.SEO_ALLOW_INDEXING==='true'}
}
export function createSitemap(routes,policy){
 // A blocked build has no indexable URLs to submit.
 const indexable=policy.indexing?routes.filter(route=>route.indexable):[]
 const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable.map(route=>`\n  <url><loc>${escape(new URL(route.path,policy.siteUrl+'/').href)}</loc></url>`).join('')}\n</urlset>\n`
}
export function createRobots(policy){return policy.indexing?`User-agent: *\nAllow: /\nSitemap: ${policy.siteUrl}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n'}
