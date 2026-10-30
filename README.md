# Sri Vidya Classes — Phase 1

React + TypeScript + Vite foundation. Run `npm run dev`, `npm run lint`, and `npm run build`.

## Structure

- `src/config/institute.ts`: approved identity, contact channels, programs, social links and asset paths. Empty fields are deliberately withheld.
- `src/components/ui.tsx`: buttons, cards, section headings, responsive images and reduced-motion-aware motion wrapper.
- `src/components/Layout.tsx`: responsive navigation, footer and conditional WhatsApp link.
- `src/pages/Home.tsx`: initial responsive homepage direction.
- `src/pages/ContentPage.tsx`: secondary route scaffolds, metadata, detail and 404 handling.
- `src/index.css`: Tailwind v4 tokens, typography, responsive layout and component styles.

## Approval / asset needs

The three referenced design images and institute branding assets were not present in this checkout. No stock or generated institute photos are used. The abstract book illustration is decorative, not an official emblem.

Supply the three references, original logo/symbol, approved T. Balu Mahendra portrait and institute photographs, verified address/phone/email/WhatsApp, program content, social links, production domain, approved social preview image, and verified K J Tech Solutions portfolio URL. Create favicon/app icon variants only from the approved symbol. The footer credit is plain text pending the verified URL.

Secondary pages intentionally show honest content placeholders and use `noindex,follow` until approved content exists. No results, testimonials, ranks or experience claims have been invented. Full privacy and terms copy require approval before launch.

WhatsApp appears automatically when an international digits-only number is set. Enquiry submission is deferred until a verified destination/backend and privacy copy are supplied; this phase does not collect personal data or simulate successful enquiries. No dependencies were added.

## Before production

Add canonical origin and approved social imagery, replace content scaffolds, review per-route indexing and metadata, implement verified form delivery and privacy disclosures, and configure hosting to serve `index.html` for SPA routes. Server-rendered or prerendered route metadata is recommended for dependable per-page social previews. This phase has not been deployed.


## Phase 2

Header and hero are in `src/components/Header.tsx` and `src/components/Hero.tsx`. Supplied phone 9959010394 is configured; WhatsApp remains unconfigured because a phone number alone does not confirm WhatsApp availability. Approved mockups, original logo and portrait remain unavailable. Add asset paths to `institute.logo` and `institute.facultyPhoto`; portrait uses contain sizing to preserve natural proportions. Existing lower homepage sections were retained.

Browser verification: `node verify-phase2.mjs` (uses installed Chrome). Screenshots in `artifacts/phase2-{390,768,1440}.png`. All three widths passed overflow/hero overlap checks; desktop hero is 660px. Mobile drawer focus trapping, Escape, focus restoration, active links, route dismissal and reduced motion passed; no runtime errors. No deployment.

## Remaining homepage implementation

`src/pages/Home.tsx` now contains the nine requested sections after the existing hero. Testimonials are omitted while the approved list is empty. `src/config/homepage.ts` centralizes signature program copy, FAQs and approved-only photo/result/review inputs. The three signature program routes use the existing program-details scaffold. `src/hooks/useHomepageReveals.ts` provides scoped GSAP intersection reveals, with cleanup and reduced-motion support; no dependencies were added.

No institute photography was supplied. Faculty/classroom and gallery slots explicitly show their pending status, and no unrelated stock imagery is presented as institute photography. Supply approved WebP assets with descriptive alt text and dimensions; gallery entries support responsive srcSet. Image elements are lazy-loaded with responsive crops. No image optimization could be performed without source photographs.

Run `node verify-homepage.mjs` against the local Vite server for 390/768/1440px checks, FAQ keyboard operation, internal route destinations, animation completion and reduced-motion cleanup. Screenshots are written to `artifacts/homepage-{width}.png`. Existing header/hero regression checks remain in `verify-phase2.mjs`. No deployment.

## Phase 4 — Academic information pages

- `src/config/academics.ts`: typed programs (overview, subjects, curriculum, methodology, eligibility), faculty array, categorized FAQs and distinct page image slots. Homepage signature cards reuse this source.
- `src/pages/AcademicPages.tsx`: About, Faculty, Programs, reusable `/programs/:slug` detail pages and categorized FAQs. `/programs/` remains the catalogue; unknown program slugs render 404.
- Breadcrumbs, program jump links, enquiry/contact links, phone links, native keyboard-accessible accordions and existing mobile navigation are retained throughout.
- Program-detail titles and descriptions are now derived from program data. Secondary-page noindex remains pending content approval as established in Phase 1.

No approved portrait, classroom images, credentials, detailed subject lists or curricula were supplied. Dedicated photo slots accept different approved assets; faculty uses natural contain sizing. Empty approved qualifications, curriculum and subject lists show honest pending guidance. No fees, timetables, guarantees or credentials were invented. Additional faculty can be added to the typed faculty array.

Focused checks: start Vite, then run `node verify-academic.mjs`. This verifies seven routes at 390/768/1440px, breadcrumbs, titles, overflow, program sections and anchor clearance, ten FAQ accordions, mobile navigation, internal CTA destinations and unknown-program handling. Screenshots are saved under `artifacts/academic-*`. No deployment.

## Phase 5 — Results & Achievements and Gallery

`src/config/showcase.ts` contains typed achievement and gallery records and shared publication gates. Lists intentionally start empty. Results require verified/approved records, approved photos, confirmed publication consent, non-empty student/exam/result/context fields and an exam year. External achievements require the associated institution and are explicitly labelled separately from Sri Vidya coaching results. Only categories with publishable results appear. Gallery requires approved institute photography with consent, dimensions, alt text and captions. Homepage previews use these same approved sources; its result preview includes only Sri Vidya coaching results.

`src/pages/ShowcasePages.tsx` implements both pages, responsive cards/masonry, category counts and empty states, links and a modal gallery viewer. Viewer supports previous/next wrapping within the selected category, keyboard arrows/Escape, focus trapping/restoration, body scroll lock, single-image disabled controls, horizontal swipes and pinch zoom. Reduced motion uses existing shared rules.

No approved student records or real photographs were supplied, so no public records or photos have been invented. Photo conversion is ready via `node scripts/optimize-photo.mjs <approved-source-path> <unique-slug>`. This generates 480/800/1200/1600px WebP variants (limited to original width), strips metadata, preserves originals, refuses existing output folders and prints a responsive image configuration. Fill alt text and confirm approval/consent explicitly. Source images are needed before actual institute asset conversion is possible.

Run `node verify-showcase.mjs` against Vite for empty public pages and populated interaction checks at 390/768/1440px. Populated checks inject clearly synthetic records/images into browser responses only; these fixtures never enter public source or build output. Checks cover publication gates, filters, external-result labelling, lightbox keyboard/buttons/swipe, focus, scroll restoration, single-photo state, reduced motion and overflow. Public screenshots are `artifacts/phase5-{results,gallery}-{width}.png`. No deployment.

## Approved branding and portrait integrated

The user supplied the official crest and T. Balu Mahendra portrait. Original PNGs are preserved in `src/assets/branding/sri-vidya-crest-original.png` and `src/assets/faculty/t-balu-mahendra-original.png`. Optimized transparent WebP assets are imported through institute configuration; the portrait provides 480/800/1086px responsive variants. The actual crest appears alongside readable text branding in the header/footer. Portraits use contain sizing in the hero, homepage faculty spotlight and Faculty page. Crest-derived PNG icons are linked in the document head; the 192/512 variants are available for future app configuration. No AI likeness, emblem redesign or invented credentials were introduced. Classroom/gallery photos and verified student records are still pending.

## Phase 6 — Admissions, guidance and contact

- `src/pages/EnquiryPages.tsx`: Admissions process/form, Contact options/form, Counselling & guidance information and privacy information reflecting the actual workflow.
- `src/components/EnquiryForm.tsx` and `src/lib/enquiry.ts`: shared typed validation, class/board/program selection, guardian/adult consent, first-error focus, separate tab-scoped drafts with 24-hour expiry, clear draft, message review/copy and URL-encoded WhatsApp handoff. Changes invalidate the previous review; nothing claims submission or delivery.
- WhatsApp **9959010394** was explicitly confirmed by the user. Configuration uses international digits `919959010394`. Both supplied call numbers and the supplied APHB Colony address are shown; the website asks visitors to call before travelling. Maps directions use an address query, not an invented business-place identifier. Opening hours remain unset.
- Counselling/demo booking controls remain hidden until their offering flags are explicitly confirmed. `/counselling` supports a guidance enquiry through the confirmed phone/admissions flow; it does not promise a service or book an appointment.
- `src/components/ContactControls.tsx`: stable fixed WhatsApp and Back to Top controls, plus Call on mobile/tablet; safe-area padding, footer clearance and reduced-motion scrolling. Replaces the earlier floating WhatsApp link.

This is a WhatsApp-only workflow. No online submission, Netlify Function or email provider is enabled, and no enquiry payload is sent to a website server. If online delivery is added later, it requires server validation, spam protection, configured provider credentials and confirmed delivery responses. No browser secrets are present. Drafts are stored only in session storage; no form contents are logged. Clear drafts on shared devices. For minors, a parent or guardian should enquire.

`node verify-enquiries.mjs` checks required fields, mobile number validation, consent, draft navigation/reload/expiry/clearing/separation, blocked-storage fallback, exact WhatsApp recipient and message encoding, changed-value review invalidation, honest delivery text, contact links/maps, no POST requests/no personal logs, four routes at 390/768/1440px and stable non-overlapping quick controls. External WhatsApp navigation is intercepted during tests, so QA sends no messages. Test values are synthetic. No deployment.

## Phase 7 — Learning Hub and visual polish

- `src/config/articles.ts`: six typed, original educational notes covering concept understanding, IIT-JEE preparation, NEET preparation, school foundations, study techniques and organic chemistry. Each includes a takeaway, practical sections, a worked exercise and related articles. Relevant research, official exam portals and chemistry references are linked; no faculty authorship, institute results or outcome guarantees are invented. Exam specifics are delegated to the applicable official syllabus/bulletin, not hardcoded predictions.
- `src/pages/LearningPages.tsx`: article listing, URL-backed categories/search, empty/reset states, related reading, breadcrumbs, keyboard-operable answer reveals and readable article typography. Code-native vector covers provide distinct, small artwork without unrelated stock photography. Article titles/descriptions/social text are route-aware; hub/article routes are indexable, while previous approval-dependent page indexing remains unchanged.
- `src/components/SiteMotion.tsx`: nonblocking opening-book → academic symbols → branding loader that waits only for actual font/eager-image readiness. There is no minimum-duration timer or input-blocking overlay. Reduced motion hides the decorative loader. Scroll progress is exactly 1 CSS pixel, uses passive scroll events/requestAnimationFrame and responds to document resizes and routes.
- Hero headline/portrait introductions, subtle card hover and existing scoped GSAP reveals respect reduced motion. Native cursors are retained for familiar interactive controls. Existing approved imagery, page content, enquiry behaviour and fixed contact controls are preserved. Header/footer now expose the Learning Hub.

Checks: lint/build; `node verify-learning.mjs` tests all six article routes plus listing at 390/768/1200/1440px, filters/search/reload/reset, exercise keyboards, article metadata/related links, unknown-article 404, progress height/end position, drawer focus, real-resource loader dismissal and reduced motion. Existing `verify-enquiries.mjs`, `verify-academic.mjs` and `verify-showcase.mjs` regression checks also pass. No runtime errors or horizontal overflow observed. Screenshots: `artifacts/phase7-{hub,article}-{width}.png`. No added dependencies and no deployment.

## Production SEO

See `SEO.md` for build-time prerendering, schema, social previews, staging-safe indexing, hosting/404 rules, analytics privacy and activation after final domain verification. `npm run build` now generates and verifies the complete static route output; `npm run preview` serves genuine static 404 responses. This supersedes earlier notes recommending a blanket SPA fallback or future prerendering. No deployment or push.

## Unused-code cleanup

Removed unused Vite starter assets/styles, obsolete Phase 1 selectors, superseded placeholder page metadata, unused institute settings and unreferenced form/testing-library packages. The current forms use the shared typed validation module; UI tests use Playwright and unit tests use Vitest. Implemented approval-gated sections, original approved images, font licenses, SEO/build tools and regression tests are retained.

## Premium chemistry visual enhancement

The original hero, approved portrait, routes and enquiry workflows are retained. `src/components/science/` adds a six-stage SVG chemistry studio (diagram assembly, bonds/species, hydronium–hydroxide neutralization, a separate solid/liquid/gas particle model and a concept takeaway), plus an accessible H/C/N/O explorer and decorative hero structures. Chemistry references are linked in the section. Models illustrate connectivity and particle arrangements, not exact simulations or trajectories.

Playback is finite and user-controlled, pauses out of view/background, and becomes static under reduced motion. The existing reveal hook coordinates cards, faculty masks and learning steps, including new filtered article groups. The resource-driven loader now includes bond formation with no minimum loading delay. Footer ownership is `© 2026 Sri Vidya Classes. All Rights Reserved.` with a separate subtle developer credit, following the latest supplied enhancement brief. No new packages, faculty-image alterations, fabricated achievements or testimonials.

`node verify-chemistry.mjs` checks the studio at 360/390/768/1024/1440px, keyboard element selection, conserved atom counts, reaction endpoints, three matter states, reduced motion, finite playback and off-screen pause/resume. The original reference mockups were not supplied in this checkout; visual refinement uses the established design system and approved assets. No deployment or push.
