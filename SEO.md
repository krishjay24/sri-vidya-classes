# SEO verification and production activation

The site stays non-indexable until the exact final HTTPS domain is supplied and verified. The supplied value `srividyaclasses` has no extension, so it is not treated as a domain. Local/staging builds use the reserved `https://sri-vidya-classes.invalid` origin for clearly identifiable placeholders. These are not live canonical or social-image addresses.

## What the build produces

`npm run build` runs TypeScript, the Vite client/SSR builds, React prerendering, image generation and artifact validation. It outputs:

- 22 route-specific HTML documents plus `404.html`, with visible page content before JavaScript runs.
- A unique title, description, one H1, canonical, Open Graph/Twitter metadata and JSON-LD per route.
- EducationalOrganization with the business-supplied Kadapa address and confirmed primary phone; Course data for the three named programs; BreadcrumbList and Article data where visible content supports them.
- Branded 1200×630 PNG social previews per page/article, using the actual official crest and approved faculty portrait. The text layout is generated from route content.
- Emblem-derived SVG (embedded approved raster, no emblem redesign), PNG 32/64/180/192/512, ICO and a web manifest.
- `sitemap.xml`, `robots.txt`, Netlify `_headers`, explicit valid-route `_redirects`, and a route manifest.

No reviews, scores, awards, tuition amounts, offers, dates, credentials, geo coordinates or opening hours are invented. The secondary supplied call number is visible as a supplied contact option; it is not promoted as a confirmed schema contact. CBSE/State Board coverage is not marketed in metadata/schema because board choices on an enquiry form do not establish offered subjects. Obtain business confirmation before adding board-specific offerings to metadata or curriculum content.

## Enable production indexing only after domain verification

Use the full HTTPS origin, including its actual extension. Verify ownership and HTTPS/DNS with the business/host, then set build environment variables:

```text
SEO_SITE_URL=https://FULL-VERIFIED-DOMAIN
SEO_DOMAIN_VERIFIED=true
SEO_ENV=production
SEO_ALLOW_INDEXING=true
```

Replace the placeholder with the exact origin; it must not contain a path, query, credentials or port. Rebuild. Attempting to enable indexing without the full verified origin fails the build. The ordinary Vite `production` build mode alone never enables indexing. Netlify `deploy-preview`/`branch-deploy` contexts remain non-indexable even if production flags are inherited. Other hosts must explicitly use staging settings for previews, or send an equivalent noindex response header. Do not copy production artifacts unchanged onto an indexable staging host.

Production builds add only approved indexable routes to the sitemap. Empty Results/Gallery and the pending Terms page retain noindex and stay out of the sitemap until their content/configuration supports indexing. Staging keeps a valid sitemap route inventory for inspection, but does not advertise it in robots.txt; robots uses `Disallow: /`, and metadata plus HTTP headers remain noindex. The staging sitemap must not be submitted to search engines. Search engines cannot discover working public social previews from `.invalid`; full origin confirmation and hosting are necessary for that final live check.

## Hosting and 404s

`netlify.toml` is configuration only; nothing has been deployed. Publish `dist` when separately authorized. Generated redirects explicitly serve known routes and return **HTTP 404** for unknown paths, including invalid program/article slugs. Do not add a blanket SPA `/* /index.html 200` fallback. Known trailing-slash/index.html aliases redirect to the canonical path.

For another host, serve each generated `route/index.html` for its exact canonical route, redirect trailing aliases, and return `404.html` with status 404 for all unknown paths. Mirror `_headers`: hashed `/assets/` files are immutable for a year, HTML/robots/sitemap revalidate, and social images have a bounded one-hour cache. Ensure compression is enabled and HTTPS certificates are valid. `npm run preview` uses the included local static server with these semantics, rather than Vite's SPA fallback.

## Performance and accessibility

Server-rendered content removes the blank initial SPA shell. Responsive transparent portrait WebPs, intrinsic image sizes, lazy secondary images, priority hero loading, self-hosted/preloaded WOFF2 fonts and direct stylesheet discovery reduce avoidable layout shifts and resource waterfalls. Existing reduced-motion, semantic landmarks, labels, focus management and enquiry controls are retained. Inter and Plus Jakarta Sans fonts are self-hosted with their original open-font licenses; builds and pages no longer depend on Google Fonts requests. No field Core Web Vitals result or score is claimed: real LCP/INP/CLS must be measured after the authorized production site receives representative traffic.

## Analytics hooks, disabled by default

No analytics provider, network transport, cookies or analytics storage is enabled. To integrate a separately approved consent manager, it may emit:

```js
window.dispatchEvent(new CustomEvent('sri-vidya:analytics-consent', {
  detail: { granted: true }
}))
window.addEventListener('sri-vidya:analytics', event => {
  // Optional approved collector receives only allowlisted, non-personal fields.
  // No collector is installed in this project.
})
```

Revocation uses `granted: false`. Consent is memory-only and resets on a fresh page load. Do Not Track and Global Privacy Control disable hooks even after a consent signal. Events: `admission_enquiry_reviewed`, `contact_enquiry_reviewed`, `program_interest`, `whatsapp_opened`, `call_clicked`. Fields are limited to event name, a known route path and an approved program slug. No names, phone numbers, board/class choices, message text, draft data, query strings or referrers are emitted. Review and WhatsApp events never imply enquiry delivery.

## Verification report

- Build-time test: `npm test` (or `npm run test:seo`) validates all generated documents, one H1 and unique metadata, canonical/social URLs, 1200×630 image files, local schema invariants, breadcrumb positions, article/course coverage, internal links, sitemap, robots, icon dimensions and environment gates. Production-policy tests use an isolated `.example` fixture, not a claimed institute domain.
- Browser/HTTP test: start `npm run preview`, then run `npm run test:browser`. It checks all routes at 390/768/1440px, JavaScript-disabled readability, initial HTTP metadata, genuine unknown-route 404s, hydration, query-filter hydration, client metadata transitions, draft reload, WhatsApp values, mobile drawer, consent gating, payload privacy and Global Privacy Control.
- Local schema validation is not a guarantee of a search rich result. After the real origin is configured and publication is separately authorized, check actual response headers/canonical redirects, Google's Rich Results Test/Search Console and social platform fetch tools. External crawler eligibility, social caches and field Core Web Vitals cannot be verified from an unpublished `.invalid` build.

No deployment or push was performed.



