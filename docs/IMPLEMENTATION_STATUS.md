# Implementation and verification

Updated October 6, 2026. This file describes the current local implementation, not a deployment claim.

## Current experience

Seven connected chapters present Darshan's profile, technical work, products, community, travels, gaming/anime interests and contact details. Cinematic WebGL is the default; lightweight and reduced-motion controls remain available. Gundu is a separate 3D companion when graphics are supported.

Spawn uses a dark background and circular purple portal. Later exits have opaque arched portals and connected passages. Road spans 72 scene units; indoor chapters span 36. The bike fades before its exit. Auditorium applause occurs once per visit after three seconds. Road and Campfire use natural ambience without the shared score.

## Latest refinement

- Entry now uses a lazy Three.js orbital scene: locally served 4K NASA Earth surface, independent clouds, relief, night lights and atmosphere, an original satellite with a continuous elliptical orbit, small point stars and brief meteor trails. It has bounded pixel ratio/frame cadence, a texture-loading timeout, and a textured fallback. The journey canvas mounts after entry; entry texture resources are released on departure.
- Entry copy introduces the developer, connector and explorer. Gundu and his periodically appearing introduction sit at bottom-right. Jumping and vertical dance bouncing were removed. The primary action is Begin the journey; no sound-on-entry line appears.
- Valid chapter URLs initialize directly at that chapter with sound muted. Root and invalid initial URLs show the entry gate. The camera starts at the destination without sweeping through earlier chapters.
- Lightweight mode uses original vector scenes for the portal, workstation, product gallery, auditorium, Road landscapes, gaming room and campfire. The companion remains 3D where graphics are available.
- Tunnel dimming is separate from the room baselines in sceneLighting.ts. DevLab, auditorium, Projects and Arcade retain their earlier ambient, directional and reflected light levels. Passage surfaces and guide lighting stay dim. Road daylight and moonlight receive a small lift; Campfire keeps its existing lighting.
- Arcade warms muted publisher players before Road. Their projected screens become visible when the actual camera crosses the end of the Road-to-Arcade arch, without requiring proximity to the monitors. Posters remain until playback is confirmed.
- The Spawn portrait fades out before crossing its portal, independently of chapter copy. Road uses sloped terrain, layered hills, textured leaf sprays, grounded vegetation, continuous asphalt, a hillside cascade and a stone cave entrance. The lake has a shaped shoreline, subtle animated reflection shading and a lakeside seat; grass stays on the dry banks. Midnight headlight illumination lands on the near road.
- Project dialogs use a wider overview/workspace layout with selectable flow stages and system tabs. Standard desktop and phone layouts fit without scrolling; extremely short or zoomed layouts retain an accessibility scrolling fallback. Briefing/anime and other scrollable dialogs have styled scrollbars.

## Verification performed

- `npm test`: 80 tests passed across 20 files, including room-light baselines, portrait portal timing, dry lake banks, orbital continuity, chapter URL entry, passage dimming and the Arcade entrance boundary.
- `npm run build`: TypeScript and production build passed.
- Chrome using Windows D3D11: inspected entry at desktop, laptop, 390 x 667 phone and 667 x 375 landscape sizes. No page overflow or runtime page errors were observed in those checks.
- Fresh and reloaded valid chapter URLs opened their destination directly. A fresh invalid chapter URL was cleared and showed the entry. A deliberately stalled Earth texture fell back after the bounded timeout with the entry action enabled.
- Inspected all lightweight chapter illustrations and the three Road scenes. This was visual QA, not an exhaustive mobile-device benchmark.
- Project flow stages and system tabs were checked on laptop and phone. Short landscape spacing was refined. Briefing's scrollbar styling and scrolling were checked in-browser.
- Actual YouTube player messages reported all three desktop trailers playing while hidden during Road, and all three were visible and still playing as the camera crossed into Arcade. No runtime page errors occurred during this check.
- Code review identified no important remaining defects in the refinement; its entry texture-cache cleanup finding was addressed.

- Follow-up lighting correction: inspected restored DevLab, auditorium and Arcade in desktop Chrome; checked all three revised Road views, lake on a 390 x 667 viewport, and portrait visibility before/inside the Spawn passage. No page errors or phone horizontal overflow were observed.

## Google Analytics integration

The dedicated GA4 account, property and web stream were created in the owner's signed-in Chrome session after approval of Google's mandatory size category and terms. Measurement ID: `G-M201033Q4E`. Production-only settings were added to the existing Vercel project. Local code measures chapter visits, project/briefing/anime opens, journey entry, Road stories, resume, email and social actions. Analytics requires visitor opt-in, respects Do Not Track and Global Privacy Control, disables advertising features and avoids personal information in custom event parameters. Browser-history and other automatic Enhanced Measurement events were disabled to avoid duplicate views and autoplay noise. See [ANALYTICS.md](ANALYTICS.md).

Analytics verification: 87 tests passed across 21 files; TypeScript and production build passed. Privacy disclosure and inactive localhost tracking were checked in Chrome. Commit `ac67788` was pushed to the existing Git-connected Vercel project and its production deployment reached READY. On the custom domain, Chrome confirmed pre-consent tag suppression, opt-in loading of the correct ID, and suppression after opt-out/reload. The new property's Realtime report displayed actual page views, journey entry and briefing events from verification traffic. No runtime errors were observed. Contact/resume key events have no monetary value and count once per session; chapter and project custom dimensions were registered.

## Boundaries

Analytics follow-up: `e1d3f98` moved product, briefing and anime-open tracking into the common dialog-opening action. All 88 tests and the production build passed; the deployment reached READY. Chrome also checked the privacy dialog at 390 × 667 without horizontal overflow. Live Realtime verification covered chapter views, journey entry, briefing opens and project opens. Other custom event types were not individually verified in that report.

No commit, push or deployment was performed for this refinement. Browser-wide frame-rate guarantees and a complete mobile performance benchmark are not claimed. Third-party trailers depend on browser/network/provider availability, so a cold or blocked provider can still delay playback. Source credits are in [ASSETS.md](ASSETS.md), with trailer details in [ARCADE_MEDIA.md](ARCADE_MEDIA.md).
