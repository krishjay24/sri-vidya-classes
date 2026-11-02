# GA4 integration and release checklist

Measurement ID: G-BJ8EPS3NBT. Production origin: https://sri-vidya-classes.netlify.app.

Set VITE_ANALYTICS_ENABLED=true in the production Netlify build environment, then rebuild. The default is disabled. No secret is needed. Development, test mode, WebDriver browsers and all other origins (including previews/localhost) are blocked even with the flag. Existing SEO environment settings are independent and must be retained.

## Required GA4 property settings before enabling

Account access was unavailable: the live property's Enhanced Measurement settings and receipt of events have NOT been verified or changed.

In Admin > Data streams > this web stream > Enhanced measurement, turn Enhanced Measurement OFF for this integration. In particular, automatic browser-history page views duplicate our React Router events; automatic form interactions measure review/validation rather than confirmed delivery; outbound link events can collect WhatsApp URLs containing personal messages. Site search can collect query strings. Keep these automatic collectors disabled. Do not enable user-provided data collection, enhanced conversions, Google signals, advertising features or separate Google/GTM tags for this website. Audit any GA4 create/modify event rules so form_submit, review and WhatsApp events are not converted into generate_lead.

The code sets send_page_view:false and sends one manual page_view on opt-in/current page and each pathname change. Query/hash-only changes are not page views. Returning to a previously visited page counts again. Route names/titles come from the static public route allowlist; unknown paths become /404. Referrer is blank, query strings and fragments are excluded. Page defaults are sanitized before configuration and updated on navigation.

Google documentation:
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://support.google.com/analytics/answer/9216061?hl=en

## Events

- page_view: current page on consent and pathname navigation, without retrospective tracking.
- whatsapp_click: delegated wa.me link activation, including form handoff, without URL/message/recipient.
- phone_click: delegated tel link activation, without phone number.
- admission_click: admissions navigation, Start an enquiry and existing home/academic admission CTAs.
- program_enquiry_click: contact/admission enquiry links from a known program detail page, with allowlisted program_id.
- admission_enquiry_reviewed / contact_enquiry_reviewed: existing valid form review actions, retained. They do not indicate submission.
- generate_lead: deliberately unsupported. No server/email submission endpoint or successful delivery acknowledgement exists. The user must press Send in WhatsApp and this site cannot observe delivery.

Only approved event names, canonical page data and optional known program identifiers are forwarded. No form values, arbitrary labels, link destinations, search parameters or incoming referrers are sent by the integration. Disable automatic collectors as described above to preserve this boundary.

## Consent

No Google script/request is created before opt-in (basic consent mode). Allow/Reject have explicit controls. Footer Analytics preferences is always available to withdraw or re-enable. Choices expire after 180 days. Storage failures leave consent in memory only. DNT/GPC override consent; other-tab storage changes synchronize the choice. Advertising consent remains denied. Withdrawal sets the GA disable flag, denies storage, discards queued commands and removes accessible first-party GA cookies. A previously downloaded script remains in memory; future integration events are blocked. Already transmitted data cannot be recalled.

## Manual verification before release

After reviewing property settings, use a normal browser on production with the flag enabled. Verify no gtag/collect request or GA cookie before consent or after rejection. Allow, navigate through routes/back/forward, and check one page_view per pathname in Network and GA4 Realtime. Query/hash changes must not add views. Inspect all collect payloads for sanitized page URLs, blank referrers and absence of form/WhatsApp personal data. Exercise all four CTA events and form review; ensure no generate_lead/form_submit appears. Withdraw, check cookie removal and no further collect requests; refresh to verify the saved rejection. Test DNT/GPC. This live check was not performed because this task explicitly excludes deployment.
