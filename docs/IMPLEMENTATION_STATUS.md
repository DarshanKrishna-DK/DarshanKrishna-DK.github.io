# Implementation and verification

Updated October 5, 2026. This file describes the current local implementation, not a deployment claim.

## Current experience

Seven connected chapters present Darshan's profile, technical work, products, community, travels, gaming/anime interests and contact details. Cinematic WebGL is the default; lightweight and reduced-motion controls remain available. Gundu is a separate 3D companion when graphics are supported.

Spawn uses a dark background and circular purple portal. Later exits have opaque arched portals and connected passages. Road spans 72 scene units; indoor chapters span 36. The bike fades before its exit. Auditorium applause occurs once per visit after three seconds. Road and Campfire use natural ambience without the shared score. Official game trailers preload during Road and replace local posters only after playback is confirmed.

## Latest refinement

- README rebuilt with GitHub-friendly HTML, an original SVG cover, chapter/product guides, setup, controls, maintenance paths and asset credits.
- Asset preparation uses repository-local inputs and runs before both development and production builds.
- Git ignores generated delivery images, builds, dependencies, caches, local QA and obsolete local history. Duplicate logo copies, unused landscape delivery images and old generated QA output were removed. Original artwork and historical design notes were retained locally; unused ones are ignored.
- Campfire moon has a procedural crater/maria texture, directional shading and a restrained radial halo.
- Projects has two aimed uplights per logo, soft visible beams and light-responsive logo materials. Ambient, environment and broad room lighting are reduced.
- Spawn portal is raised and scaled to clear the floor; its soft aura no longer depth-clips against the ground.
- Campfire removes the duplicate displayed email address and places social links directly below its actions. Let's talk remains a mail link.

## Verification performed

- `npm test`: 36 tests passed across nine files.
- `npm run build`: TypeScript and production build passed.
- A separate copy of the Git-publishable file set built successfully, regenerating ignored delivery assets from local originals. This reused installed dependencies through a junction; it was not a new network installation of npm packages.
- README local links and anchors resolved against that publishable file set; its SVG cover loaded in a local HTML preview. The preview approximates GitHub formatting, not GitHub's actual renderer.
- Chrome using Windows D3D11: inspected Spawn, Projects and Campfire at 1139 × 590, plus Spawn and Campfire at 390 × 667. No page errors or page overflow were observed in these checks. The lower Spawn portal rim, paired project beams and tighter contact layout were inspected visually.
- Code review found no important defects in the latest changes.

Prior checks in this session covered connected passages, audio routing, applause timing/cancellation, mute and muted trailer playback. They are not a claim of exhaustive device coverage or guaranteed external-player startup. This refinement did not change those audio/video behaviours.

## Boundaries

No commit, push or deployment was performed. Browser-wide frame-rate guarantees and a complete mobile performance benchmark are not claimed. Third-party trailers depend on browser/network/provider availability. Source credits are in [ASSETS.md](ASSETS.md), with trailer details in [ARCADE_MEDIA.md](ARCADE_MEDIA.md).
