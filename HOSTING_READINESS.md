# Hosting readiness — 30 October 2026

**Verdict: ready for a non-indexed hosting preview. Final public launch needs the verified full domain and business-content sign-off. Nothing deployed or pushed.**

## Verified locally

- Lint, TypeScript/client/SSR production build, all 20 unit tests and generated SEO checks pass.
- Browser checks cover all 22 public routes plus 404, responsive layouts at 360/390/768/1024/1440/1920px, navigation/drawer/keyboard, image loading, reduced motion and correct 404 status.
- WhatsApp remains fixed above Back to Top; the accurate 1px progress bar resets on navigation. Chemistry playback is finite and pauses offscreen.
- Admissions/Contact validate inputs, preserve drafts, require consent and prepare real values for WhatsApp. The visitor presses Send. There is no website-to-email submission backend, and the website claims no message delivery.
- Prerendered HTML, metadata/schema, 23 social previews, icons, sitemap/robots, privacy-safe analytics hooks and cache/404 configuration pass local checks. Gallery source and collection remain unchanged.
- Published `dist` contains no `.env` files, test scripts, downloaded source JPEGs or `node_modules`. Linux native-build entries for Sharp and Rolldown exist in the lockfile; an actual Linux/Netlify build has not been run.
- Netlify build command is `npm run build`; publish directory is `dist`. Added `NODE_VERSION = "22"` to select a Node major compatible with the installed Vite/Sharp engines. Local checks ran on Node 22.17.0. Netlify's supported version-selection mechanism is documented in [Manage build dependencies](https://docs.netlify.com/build/configure-builds/manage-dependencies/). Keep build devDependencies installed; Vite/TypeScript/Sharp are needed during the build.

## Required for final launch

1. Supply and verify the full HTTPS domain, including its extension. `srividyaclasses` alone is incomplete. Current canonical/social/sitemap URLs use `https://sri-vidya-classes.invalid`; indexing is intentionally blocked. After verification configure the four variables below and rebuild:

   ```text
   SEO_SITE_URL=https://FULL-VERIFIED-DOMAIN
   SEO_DOMAIN_VERIFIED=true
   SEO_ENV=production
   SEO_ALLOW_INDEXING=true
   ```

2. Approve final business information: secondary phone, exact offered board/subject coverage, qualifications/curriculum, visiting hours/counselling availability, Terms and retention information. Unconfirmed details remain marked pending; they are not invented. The Terms route currently explicitly says its full terms await approval.
3. Decide whether to launch with the current honest empty Results/Gallery states. Actual institute photos, student results and permissions remain pending; stock images elsewhere are labelled illustrative. Original reference mockups remain unavailable for direct comparison.

## Check after authorized hosting

- Actual Netlify build, route rewrites/404 status, compression and caching, HTTPS/DNS, canonical origin and robots/indexing gates.
- Actual WhatsApp receipt/call routing/Maps location with the institute. Local browser tests do not send messages or make calls.
- Search Console/social-platform fetches and live rich-result checks with the real origin. Preview/branch deploys must stay noindex.
- Physical devices, assistive technology, Lighthouse and field Core Web Vitals. Local Chromium CLS/LCP observations are not field performance certification.

Evidence and details: `QA_REPORT.md`, `VISUAL_ENHANCEMENT_REPORT.md`, `SEO.md`, `artifacts/final-qa/`, `artifacts/visual-enhancement/results.json`.
