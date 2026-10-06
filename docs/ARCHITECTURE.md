# Architecture

DARSHAN.WORLD is a static React application. There is no application server, account system or database. Product walkthroughs are explanatory simulations; they do not execute payments or contact vendors.

## One journey, two presentation layers

`src/lib/journey.ts` maps normalized progress to the camera and active chapter. `routeLayout.ts` owns world positions, travel lengths and exit thresholds. Keep these together when changing room spacing: the Road intentionally spans twice the distance of indoor chapters.

React renders readable content, navigation and dialogs above a React Three Fiber world canvas. A separate canvas renders Gundu. Scene rendering stays independent of the text layout, so useful information remains available in lightweight mode or when graphics fail.

`entryWorld()` recognizes chapter hashes before the first render. Known destinations skip the entry screen and initialize both camera progress and its target at the destination; audio remains muted until a user gesture. Root and unknown destinations show the entry screen. The entry uses a separate lazy Three.js scene with a 4K Earth surface, cloud and night-light layers, a Kepler-timed satellite orbit, point stars and short meteor trails. It has a bounded loading timeout and a textured fallback. The full journey canvas mounts after entry; entry-only textures are disposed and evicted after the fade.

`LightweightScene.tsx` composes original vector environments from `components/scenery/`: a purple portal, workstation, product gallery, auditorium, three Road landscapes, gaming room and lakeside campfire. Shared materials and perspective forms keep the illustration style consistent. Animation uses CSS transforms and opacity; React does not redraw the scenery on each frame. Gundu retains his separate 3D canvas. Reduced motion freezes decorative animation.

`src/scene/WorldCanvas.tsx` coordinates the camera, nearby environments and lights. `Environments.tsx` composes rooms; `Portal.tsx` owns Spawn's circular portal. Later exits use opaque arched portals and continuous connecting passages. Their front faces conceal the passage until the camera crosses.

## Lighting and materials

Use local lights to emphasize meaningful objects. src/lib/sceneLighting.ts preserves the approved room baselines separately from the passage multiplier. Do not lower room baselines to solve a tunnel-lighting issue. `passageDarkness()` dims general illumination and the sky/fog while travelling through an arch. Main spotlights stay at the active room instead of sliding through the corridor. Passage surfaces use a dark unlit material with restrained guide lights. Do not restore bright perimeter strips to DevLab, Projects or Arcade. The world has a fixed light budget to avoid shader recompilation as chapters change.

`ProjectUplight.tsx` aims paired fixtures at each logo. Logo displays use a light-responsive material with a modest emissive baseline. Soft transparent beams communicate the source direction. The moon uses a generated crater texture and inexpensive surface/halo shaders in `Moon.tsx`.

RoadScenery.tsx owns the three Road landscapes. Terrain height and lake shore functions are shared by the ground and vegetation placement; water stays below the banks. LeafCanopies.tsx renders crossed, alpha-tested leaf sprays in one instanced draw. roadGeometry.ts keeps the road aligned with the exit and is re-exported by Nature.tsx for existing callers. Campfire retains its own scenery.

## Content and interactions

- `src/data/`: profile, products, chapters, boot messages and Gundu dialogue.
- `src/components/`: accessible controls, world content, project explanations and dialogs.
- `src/lib/companion.ts`: companion state decisions; scene components render those states.
- `src/styles/`: viewport composition, glass treatments and responsive layout.

Use the world map for direct navigation and settings. Resume opens the configured Google Drive viewer. The contact action uses `mailto:`; no contact form backend is required.

## Audio lifecycle

Audio starts inside the entry gesture and respects mute, volume and page visibility. The first four chapters share a score. `audienceCue.ts` schedules applause after three seconds in the auditorium, once per visit, and cancels it on departure. `natureAudio.ts` mixes field recordings for the Road and Campfire with crossfaded loops and no musical layer. Arcade/anime have separate synthesized motifs.

External media should not become a boot dependency. Official YouTube trailers warm up during the Road, stay muted, and replace local posters only when playback is confirmed. Leaving their range destroys the players.

## Performance and accessibility

Nearby-world culling, instanced populations, bounded rendering cadence, capped pixel ratio and shared reflection maps limit work. Reduced motion uses stable chapter viewpoints. Lightweight mode retains the 3D companion where WebGL works; failed graphics retain readable content. Measure on real devices before making frame-rate claims.

## Build and repository contract

`npm ci` installs the lockfile. Both development and production build hooks run `scripts/prepare-assets.mjs`, which creates optimized delivery images from repository-local originals. No sibling checkout, absolute user path, API key or remote asset download is required to build.

Keep original build inputs, runtime media, source, tests, documentation and the lockfile in Git. Generated WebP derivatives, `dist/`, dependencies, QA captures and caches are ignored. See the README for commands and `ASSETS.md` for media provenance.

The CI workflow runs tests, builds and uploads the static output. It does not deploy. Vite's default root base suits the intended Vercel custom domain; a subpath hosting target would require an explicit base configuration.
