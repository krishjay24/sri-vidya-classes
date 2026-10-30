# Visual enhancement verification — 30 October 2026

## Implemented

- **11 licensed Pexels photos / 44 responsive local WebP files**, supporting homepage programs, personal attention and methodology; About; Faculty supporting content; program listing/details; Admissions/guidance; six distinct Learning Hub covers; chemistry context. Every photo has a visible stock disclaimer, alt text, dimensions, responsive sources and appropriate loading behaviour. [Sources and licences](PHOTOGRAPHY_CREDITS.md). All variants together total 2.14 MB; largest individual file is 146 KB.
- Consolidated conflicting floating-control CSS into fixed slots: WhatsApp remains bottom-right above Back to Top. Top appears after 400px without shifting WhatsApp. Mobile Call remains available. Exactly 1px scroll progress uses navy → blue → gold and resets on route changes.
- Fixed route focus scrolling beneath the sticky header using `preventScroll`, keeping breadcrumbs visible and progress at zero.
- Added restrained edge washes, editorial photo layouts, teal/violet accents, contextual glassware photography and a finite sequential element reveal. Retained the chemistry studio's readable dark surface, balanced reaction, molecule/bond assembly, particle states and controls. Offscreen pausing and reduced motion work.
- Preserved the original crest, Balu sir portrait, footer copyright/developer credit, forms, routes, SEO/social images and native cursor. No new dependencies or invented institute/student claims. **Gallery source and collection are byte-for-byte unchanged**, verified with SHA-256.
- New unversioned media gets one-hour revalidated caching. Hashed assets retain immutable caching.

## Files

- Added `PromotionalPhoto.tsx`, `promotionalPhotos.ts`, `enhancements.css`, `public/media/education/*`, `scripts/prepare-promotional-photos.mjs`, `verify-promotional-photos.mjs`, credits and this report.
- Updated homepage, academic, learning and enquiry page components; `ChemistryShowcase.tsx`, `ContactControls.tsx`, `Layout.tsx`, `main.tsx`, `index.css`, prerender/preview caching scripts and QA report.
- Updated a browser assertion in `verify-final-interactions.mjs` to wait for the actual progress animation-frame update instead of assuming a 40ms deadline.

## Passed

- `npm run lint`, `npm run build`, `npm test` (20 unit tests and generated SEO validation).
- `verify-final-layout.mjs`: all 22 routes plus 404 at **360, 390, 768, 1024, 1440, 1920px**; no overflow, failed images, runtime errors, unnamed controls or obscured keyboard targets.
- `verify-promotional-photos.mjs`: 44 correctly sized/metadata-stripped WebP files, 16 photography routes, visible stock labels, no nested attribution links, six distinct article covers, unchanged Gallery hashes, stable WhatsApp coordinates, accurate/resetting 1px progress at all six widths.
- `verify-enquiries.mjs`, `verify-learning.mjs`, `verify-homepage.mjs`, `verify-chemistry.mjs`, `verify-final-interactions.mjs`, `npm run test:browser`: validation, consent/drafts, correct WhatsApp values, article filters/search/exercises, keyboard/drawer, reduced motion, finite chemistry playback/offscreen pause, prerender/hydration and privacy hooks.
- SEO: 22 prerendered public routes plus 404, 23 branded previews, 19 sitemap entries, metadata/schema/icons and staging indexing gates. Approved branding/portrait social images remain intact.
- Screenshot review: desktop homepage, Admissions and chemistry; mobile program/article layouts. Evidence: `artifacts/visual-enhancement/results.json`, `artifacts/final-qa/` and photography review screenshots.
- Local unthrottled Chromium: CLS 0 at 390/1440px. These are local lab observations, not Lighthouse scores or field Core Web Vitals.

## Pending client data / live verification

- Original reference mockups were absent; review used the established design system.
- Approved real institute/classroom photographs, results and publication permissions remain pending. Gallery and the actual-institute environment placeholder are preserved. Stock photos illustrate education generally without location or affiliation claims.
- Full verified HTTPS domain including extension remains pending; **indexing stays disabled**. Final secondary phone/business details, credentials, detailed curriculum, visiting hours and counselling availability still need confirmation.
- Actual WhatsApp receipt/calls, hosting/SEO caches, physical devices, assistive technology and Lighthouse/field performance require live verification. Website submission/email backend remains disabled; no delivery is claimed.
- Nothing deployed or pushed.
