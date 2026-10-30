# Sri Vidya Classes — Final QA

**Latest visual enhancement review:** [VISUAL_ENHANCEMENT_REPORT.md](VISUAL_ENHANCEMENT_REPORT.md) covers licensed photos, stable controls, route-focus correction and responsive/motion/SEO regression checks. Gallery source and collection remain unchanged. [Photography credits](PHOTOGRAPHY_CREDITS.md).

**Date:** 30 October 2026 (Asia/Kolkata). Local QA passed after four targeted fixes. No redesign, deployment or GitHub push.

## Passed

- **Routes/layout:** all 22 published routes plus an unknown-route case at **360, 390, 768, 1024, 1440 and 1920px** (138 page/viewport checks). No horizontal overflow, image-load failures or runtime errors. Header, approved crest/portrait, program cards and footer reviewed against the established design system. Original three reference mockups remain unavailable for direct comparison.
- **Interactions:** internal links, breadcrumbs, real 404 responses, mobile drawer keyboard/focus behaviour, sticky header, enquiry forms, draft navigation/reload/expiry/clearing, consent, phone links, Maps URL and WhatsApp message encoding. WhatsApp still requires the visitor to press Send; no delivery claim is made.
- **Results/gallery:** public empty states and permission gates preserved. Filters, external-achievement labels, lightbox arrows/Escape/focus/swipe and single-photo states passed at all six widths using isolated synthetic fixtures; no test records are published.
- **Accessibility/motion:** one H1 per page, labelled inputs, named controls, skip link, keyboard accordions, reduced motion, real-resource/nonblocking loader, 1px progress and stable quick controls. Native cursors retained; no optional custom cursor is installed. Automated checks do not establish full WCAG conformance.
- **SEO:** crawler-readable HTML, unique metadata/canonicals, local schema checks, 23 branded 1200×630 social images, icons, self-hosted fonts, 19 sitemap entries and 822 internal links. Staging noindex/robots/header gates remain active. JavaScript-disabled reading and hydrated navigation passed.
- **Data safety:** 20 unit tests cover validation, draft handling and publication permissions. Browser checks cover analytics consent/GPC and exclusion of personal fields. No submission backend/email provider is enabled; POST requests are rejected. No personal form contents are logged and no test messages/calls were sent. No invented rankings, reviews, qualifications or student achievements were introduced.
- **Commands:** `npm run lint`, `npm run build`, `npm test`, `npm run test:browser`; Playwright `verify-final-layout.mjs`, `verify-final-interactions.mjs`, `verify-enquiries.mjs`, `verify-showcase.mjs`, `verify-learning.mjs`; image optimizer checks. Evidence: `artifacts/final-qa/`, including layout and interaction JSON results.

## Fixed

1. Keyboard targets could be hidden behind the fixed mobile contact bar. Added scroll clearance for focused controls without changing the layout.
2. Mixed-case URLs could return HTTP 404 but hydrate a valid page. Made route/navigation matching case-sensitive and verified consistent 404 content without hydration errors.
3. Direct `/404.html` requests returned HTTP 200. Corrected the local server and generated Netlify rule to return 404.
4. The open mobile drawer allowed background scrolling. Added explicit scroll locking and restoration, verified with backdrop wheel, Escape and responsive-close checks.

## Pending Client Data

- Full verified HTTPS domain, including its extension; `srividyaclasses` alone is incomplete. Indexing remains disabled; activation instructions are in `SEO.md`.
- Original reference mockups; approved classroom/gallery photos, verified student records and publication permissions; qualifications and detailed curriculum information.
- Final secondary-phone/business details, confirmed board/subject coverage, counselling/demo availability, visiting hours, complete Terms/data-retention policy. No unconfirmed values have been substituted.

## Requires Live Verification

- DNS/HTTPS, actual hosting redirects/cache/404 headers, Search Console/rich-result eligibility, external article-reference availability and WhatsApp/Facebook/LinkedIn fetch/cache behaviour after authorized publication with the real domain.
- Actual call routing, WhatsApp receipt, Maps location and appointment availability with the institute; physical iOS/Android and assistive-technology checks.
- **Lighthouse/field CWV:** Lighthouse and axe are not installed. Unthrottled local Chromium LCP/CLS observations are saved in `interaction-results.json`; these are not production Lighthouse scores or field Core Web Vitals. Live network/device testing and representative INP/LCP/CLS traffic remain necessary.
- If online submission is later enabled: separately verify the real server-side validation, spam/rate controls, provider delivery, failure handling and retention policy. None is claimed for the current WhatsApp-only workflow.


