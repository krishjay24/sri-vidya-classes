# Google indexing preparation — 31 October 2026

Prepared locally for review. No push, deployment, Google verification file or Search Console submission was performed.

## Root causes

- The correct Netlify origin was already set, but production builds explicitly selected staging and disabled indexing/domain flags. This generated noindex metadata, a global X-Robots-Tag header and Disallow: /.
- netlify.toml was missing despite documentation referring to it. Added explicit build/publish settings and Node 22, following Evergreen Solar Energies.
- Domain approval alone did not establish business approval. Added an independent business gate. The owner approved current published business details and claims in this session on 31 October 2026; recorded in production configuration.
- Prerendering already provided 22 actual route HTML documents plus a genuine 404 and explicit route rewrites. There was no blanket SPA fallback to remove.
- Browser tests assumed every route must have noindex headers. Updated tests for production policy and strengthened sitemap, origin, XML, crawling and static HTTP checks.

## Final configuration

Both .env.production and netlify.toml specify:

```text
SEO_SITE_URL=https://sri-vidya-classes.netlify.app
SEO_ENV=production
SEO_DOMAIN_VERIFIED=true
SEO_ALLOW_INDEXING=true
SEO_BUSINESS_APPROVED=true
```

SEO_DOMAIN_VERIFIED is the application's origin-approval flag, not Google Search Console verification. No custom domain is needed.

Canonicals, Open Graph URLs/images, Twitter images, organization/course/article/breadcrumb structured data and sitemap entries share this origin. Production SEO output has no .invalid origin. Development retains its safe fallback.

Production robots.txt:

```text
User-agent: *
Allow: /
Sitemap: https://sri-vidya-classes.netlify.app/sitemap.xml
```

Eligible pages use index,follow,max-image-preview:large and have no global noindex HTTP header. Empty Results/Gallery, pending Terms and 404 remain noindex. Branch/deploy previews stay blocked even if they inherit production flags. Blocked builds now generate valid empty sitemaps.

## Sitemap and static files

19 URLs: Home, About, Faculty, Programs, Admissions, Contact, FAQs, Learning Hub, Counselling and Privacy (10), three actual program detail routes and six actual learning articles. No filters, aliases, missing routes, 404, empty Results/Gallery or pending Terms.

Prerendering writes dist/robots.txt and dist/sitemap.xml. Neither has a forced rewrite. The unforced final /* /404.html 404 rule preserves static files; known routes have explicit HTML rewrites. Local HTTP tests confirm status 200, text/XML content types and exact file contents for both endpoints. Netlify behavior needs a live check after authorized deployment.

## Changed files

- .env.production and .env.example: production activation and approval gate.
- netlify.toml: build, publish directory, Node and production settings.
- scripts/seo-environment.mjs: require business approval and empty blocked sitemap.
- src/config/seo.ts and src/seo-env.d.ts: approval field types.
- scripts/verify-seo.mjs: origin, XML namespace, sitemap uniqueness/eligibility, robots, headers, preview gates and static HTTP tests.
- verify-seo-browser.mjs: policy-aware headers and static endpoint verification.
- SEO.md, HOSTING_READINESS.md and this report: updated status.

Generated dist/ and dist-ssr/ remain ignored build artifacts. Admissions, WhatsApp, forms, animations, images and Gallery source data were not edited.

## Validation

- ESLint passed.
- TypeScript, Vite client/SSR build and prerendering passed.
- All 20 unit tests passed.
- SEO tests validate 22 public routes plus 404, 23 social images, 822 internal links, unique metadata, schema, canonical/social origins, sitemap, robots, headers and environment gates.
- XML parsed with JSDOM XML mode and independently with PowerShell/.NET XML parser: 19 unique production URLs, zero in blocked mode.
- Chromium browser checks cover 390/768/1440px, hydration, readable HTML without JavaScript, route navigation, mobile drawer, drafts, admission/contact review, WhatsApp values, consent/privacy behavior and real 404s.

## Remaining issues and review steps

Live HTTPS requests failed from this environment using web fetch tooling and curl. Current production headers, redirects, certificates and deployed files remain unverified; this does not establish that the website is down.

After review and separately authorized deployment, check home, robots.txt, sitemap.xml, a program, excluded routes and a missing route. Inspect Netlify dashboard environment overrides and UI redirects/headers for stale settings: environment overrides take precedence over checked-in defaults. Do not add a blanket SPA fallback.

Detailed curricula, qualifications, hours, counselling/demo availability, verified results, consented institute photos and full Terms remain pending/unpublished. No new claims were added. Results/Gallery publication gates remain intact. Approval of current claims does not fill missing details.

Google Search Console verification and sitemap submission remain separate steps after deployment. Google supplies the verification token/file. Indexing eligibility does not guarantee indexing.
