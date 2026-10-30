# Educational photography

Reviewed 30 October 2026. Eleven Pexels photographs are used as illustrative promotional photography, with a visible caption distinguishing every image from Sri Vidya people and facilities. None is used in Gallery, Results, testimonials, branding or social previews. The approved crest and real T. Balu Mahendra portrait remain unchanged.

The [Pexels License](https://www.pexels.com/license/) permits website and promotional use, resizing and modification. It prohibits implying endorsement by the pictured people. Captions make no endorsement, student identity or institute-facility claims. Attribution is optional under the licence; source credits are provided in the caption where suitable and in the complete machine-readable manifest: [credits.json](public/media/education/credits.json). Article/program-card captions are plain text to avoid nested links.

Discovery: Google Images was attempted but unavailable through the browser tool; candidates were then found through web search and verified against each original Pexels photo page and its licence. No Google image hotlinks are used. The selection illustrates education generally; no claim is made that the subjects are Indian or associated with Sri Vidya.

| Image | Photographer | Primary uses |
| --- | --- | --- |
| classroom · 6936022 | RDNE Stock project | About hero |
| mentoring · 8197536 | Yan Krukau | Personal attention; concept-learning article |
| school · 5621937 | Gustavo Fring | Foundation program; foundations article |
| molecular-model · 3825527 | RF._.studio _ | Organic Chemistry program; faculty supporting image |
| senior-study · 8199659 | Yan Krukau | Board/JEE/NEET program |
| study-discussion · 16420458 | Ludovic Delot | Admissions and guidance |
| problem-solving · 7594201 | Mikhail Nilov | JEE problem-solving article |
| revision · 7516381 | SHVETS production | Revision article |
| glassware · 9628840 | Ivan S | Chemistry studio context; chemistry article |
| science-learning · 8471975 | MART PRODUCTION | Biology/science context for NEET revision article |
| study-method · 7128752 | cottonbro studio | Teaching approach |

Each source has local 480, 800, 1200 and 1600px WebP variants in `public/media/education/`, using a consistent 3:2 centre crop. Responsive `srcset`/`sizes`, explicit dimensions, descriptive alt text and below-fold lazy loading are supplied by `PromotionalPhoto.tsx`. Large article covers and the About/Admissions hero image load eagerly; the original homepage portrait retains its existing priority. These are stock contexts, not depictions of the worked examples themselves.

Downloaded 1600px source JPEGs are retained in `artifacts/licensed-photo-sources/` for reproducibility. `node scripts/prepare-promotional-photos.mjs` rebuilds the WebP variants, typed metadata, credits and review sheet from those local sources. No network requests or new dependencies are needed for the normal site build. One rejected, overly blurred download (3735703) is not used or published.

Gallery and About's institute-environment placeholder remain reserved for approved real institute photography. Fees, detailed curriculum, faculty credentials, student results and reviews still require client approval. Original homepage reference mockups were not included with this request.
