# Portfolio analytics

DARSHAN.WORLD uses optional Google Analytics 4 to measure settled chapter visits and useful actions on this personal professional portfolio.

## Google setup

- Account: **DARSHAN.WORLD**, ID `410910506`.
- Property: **DARSHAN.WORLD — Portfolio**, ID `557635899`.
- Web stream: **DARSHAN.WORLD**, ID `16053676632`.
- Public Measurement ID: `G-M201033Q4E`.
- Website: `https://darshan-krishna-dk.me`, redirecting to `https://www.darshan-krishna-dk.me`.
- Reporting timezone: India, UTC+05:30; currency: INR.
- Objectives: understand traffic and engagement; no sales objective or advertising integration.
- Optional account data-sharing checkboxes were disabled during setup.

[Open this property's dashboard](https://analytics.google.com/analytics/web/#/a410910506p557635899/reports/intelligenthome).

Google's mandatory size form has no personal/hobby option. The smallest category was selected with the owner's approval solely to complete setup; it does not change the portfolio's personal scope or Vercel plan.

## Activation

The existing Vercel `darshan-world` project has these **production-only** variables:

```dotenv
VITE_GA_MEASUREMENT_ID=G-M201033Q4E
VITE_GA_HOSTNAMES=darshan-krishna-dk.me,www.darshan-krishna-dk.me
```

Vite embeds these public values at build time. Redeploy after changes. Copy `.env.example` to `.env.local` for local configuration; do not commit local environment files. A blank ID disables the integration.

Only production builds on the approved HTTPS hostnames send events. Development, localhost and Vercel preview domains are excluded. The tag loads asynchronously during an idle opportunity, outside initial scene loading.

## Visitor preferences

The optional notice offers **No thanks**, **Allow analytics** and **Details**. No Analytics script loads before consent. **Privacy** is available at entry and within the journey to review disclosures and change preferences. Choices are stored as `dw-analytics-choice`. Withdrawal stops collection and attempts to remove first-party GA cookies. Do Not Track and Global Privacy Control override opt-in.

Google signals and advertising personalization are disabled. Custom events use fixed labels instead of emails, entered text or complete contact URLs. Manual page views strip query strings and arbitrary hashes; external referrers are reduced to their origin. Google Analytics still uses cookies and processes visitor data. YouTube embeds and external links have separate privacy policies, described in the in-site disclosure.

## Events

| Event | Meaning | Parameters |
| --- | --- | --- |
| `page_view` | Entry or chapter settles for 900 ms | `chapter`, sanitized location/title/referrer |
| `journey_start` | Begin the journey | `mode`, `sound` |
| `project_open` | Product walkthrough opens | `project` |
| `briefing_open` | 60-second brief opens | none |
| `anime_archive_open` | Anime archive opens | none |
| `resume_open` | Resume viewer link clicked | `destination`: resume |
| `contact_click` | Email link clicked | `method`: email |
| `social_click` | Social profile clicked | `network` |
| `travel_story_view` | Road story selected | `story`: ride, midnight_ghats, lake_reset |

Consecutive identical chapter views are suppressed; returning to a chapter produces a new view. Actions before opt-in are discarded.

Enhanced Measurement browser-history page views are disabled because the application sends its own chapter views. Automatic scroll, outbound click, search, form, video and download measurement are also disabled. Keep these settings to avoid duplicates and autoplay noise.

## Validation and maintenance

Unit checks cover production/domain gating, browser opt-outs, explicit preference values, pre-consent script suppression, withdrawal/re-enabling, deduplicated views, sanitized metadata, labeled link events and transport failure isolation.

For a live check, open the custom domain, allow analytics, enter the journey and open a project. Inspect **Reports → Realtime** for `page_view`, `journey_start` and `project_open`. Standard reports can appear later. Blockers, browser preferences and declined consent can correctly produce no events.

Implementation: [`analytics.ts`](../src/lib/analytics.ts), [`AnalyticsPrivacy.tsx`](../src/components/AnalyticsPrivacy.tsx) and event hooks in [`App.tsx`](../src/App.tsx).

References: [Manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [privacy controls](https://developers.google.com/tag-platform/security/guides/privacy), [Google's use of partner-site data](https://policies.google.com/technologies/partner-sites).
