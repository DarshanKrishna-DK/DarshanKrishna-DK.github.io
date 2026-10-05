# Asset provenance

The portrait and motorcycle originals in `assets/` are user supplied and were not overwritten. The motorcycle is Darshan's actual Yezdi Adventure 350.

## Portrait derivative

`assets/dk-cutout.png` was created using the built-in image-generation/editing tool, in transparent-background edit mode, from `assets/dk.png`. The result was inspected for visual identity and its real alpha channel was verified with Sharp. It is a separate derivative; the original remains the authoritative source. `public/assets/portrait-cutout.webp` is its optimized delivery version. The unedited original delivery copy remains available as `public/assets/portrait.webp`.

Edit prompt:

> Edit target: supplied dk.png portrait. Remove only the background to create a faithful transparent-background cutout for a personal portfolio website. Preserve the exact person's face, hair, expression, body pose, black suit, striped tie, wristwatch, hands, original warm rim lighting, framing and proportions. Do not redesign, beautify, retouch or change any facial features. Keep full original portrait boundaries, clean hair edges and natural warm rim lighting. Output real alpha transparency, no shadow, no checkerboard pixels, no replacement background. Original must not be overwritten.

## Project assets

Copied from the owner's accessible local project repositories:

- Sahay: logo and architecture from `Sahay/docs/`.
- Zuik: logo from `Zuik/projects/Zuik-frontend/public/`.
- SwyftPay: logo and home screenshot from `SwyftPay/assets/`.

README descriptions informed the portfolio's product narratives. No individual repository links are exposed in the product experience.

## Original procedural work

Gundu, the connected 3D environments, transition objects, particles and mini-game are original code-native work. The anime archive uses official promotional artwork from the series websites, credited below. The score is synthesized locally with Web Audio; auditorium applause is a CC0 recording. Embedded official game trailers remain muted.

Fonts are locally bundled Fontsource packages: Pixelify Sans and VT323. Package licensing accompanies the installed packages. Lucide supplies interface icons.

The audio library is authored in `src/data/soundscapes.ts` and `src/lib/audio.ts`. The first four chapters now share one continuous score; DevRel City adds a CC0 applause recording and original synthesized cheers. Six further variations cover the road, midnight, lake, arcade, anime and campfire. Three earlier chapter motifs remain editable library entries but are no longer routed. Road and Campfire now use the field recordings listed below, with no musical pads or melodies. The first four chapters and Arcade retain the original score.

Historical Western Ghats, midnight road and lake illustrations were generated with the built-in image-generation tool. Original PNGs remain preserved locally and ignored by Git. Unused delivery copies have been removed; the current portfolio does not render these illustrations and asset preparation does not rebuild them. Road and Campfire are procedural geometry, including code-generated earth grain and moon textures. The foreground portrait and Yezdi remain the owner's supplied imagery, blended using non-destructive CSS masks.

## Current display treatments

Project marks used by the 3D displays and dialogs now live in `public/assets/project-logos/`. Stable replacement names are sahay.png, zuik.png and swyftpay.png. Build preparation does not overwrite this folder.

`BikeImage.tsx` applies a clipped SVG Gaussian blur to the number plate in the displayed composition. This is a visual treatment, not an irreversible redaction: the original image and source delivery asset remain preserved.

Official game trailers are embedded directly from publisher YouTube players, not downloaded, edited or rehosted. See ARCADE_MEDIA.md.

## Official anime imagery and audience recording (October 5 refinement)

The local WebP copies are optimized promotional artwork. Copyright remains with the respective rights holders; these are not original illustrations or CC0 assets. Each archive panel links to the official source.

| Local asset | Official source image | Series page |
| --- | --- | --- |
| public/assets/anime/one-piece.webp | https://www.toei-animation.com/wp-content/uploads/2019/02/one_piece_product.jpg | https://www.toei-animation.com/catalog/one-piece/ |
| public/assets/anime/akame-ga-kill.webp | http://akame.tv/images/index/top.jpg | http://akame.tv/ |
| public/assets/anime/hunter-x-hunter.webp | https://www.ntv.co.jp/hunterhunter/images/top/main.png | https://www.ntv.co.jp/hunterhunter/ |

Audience: **Applause: 600 People**, Joseph Sardin, CC0/public domain. Source and license: https://bigsoundbank.com/applause-600-people-s0021.html . Download: https://bigsoundbank.com/UPLOAD/mp3/0021.mp3 . Local asset: public/assets/audio/auditorium-applause.mp3. The engine fades short passages in and out, adds original synthesized vocal cheers, and gates the audience bus to DevRel City. The original synthesized claps remain as a network/decode fallback. No sound starts before user interaction.

## Natural ambience refinement (October 5)

Additional recordings by Joseph Sardin, released CC0 on their source pages:

| Delivery file | Source / license | Original MP3 |
| --- | --- | --- |
| forest-birds.mp3 | https://bigsoundbank.com/forest-s0100.html | https://bigsoundbank.com/UPLOAD/mp3/0100.mp3 |
| tree-breeze.mp3 | https://bigsoundbank.com/forest-wind-in-the-trees-s0904.html | https://bigsoundbank.com/UPLOAD/mp3/0904.mp3 |
| wood-fire.mp3 | https://bigsoundbank.com/big-branching-fire-1-s0987.html | https://bigsoundbank.com/UPLOAD/mp3/0987.mp3 |
| forest-insects.mp3 | https://bigsoundbank.com/forests-of-gironde-france-s0699.html | https://bigsoundbank.com/UPLOAD/mp3/0699.mp3 |

These are sound-design recordings, not location recordings of Darshan's travels. Files live in public/assets/audio/. Delivery edits take 34 seconds from offset 2, normalize to -22 LUFS / -3 dBTP, and encode stereo MP3 at 24 kHz / 96 kbps (about 400 KB each). Original downloads remain in artifacts/*-source.mp3. Web Audio crossfades loop boundaries over two seconds in decoded PCM, crossfades world mixes over 1.6 seconds, and stops inactive recording sources. Audio is fetched after entry near DevRel/nature, outside the boot critical path.

Road blends forest birds and tree breeze; midnight blends breeze and insects; the lake uses quieter birds and air; Campfire blends burning wood, light breeze and distant insects. All four nature routes bypass the score scheduler and create no pad oscillators. A quiet procedural air bed remains if recordings fail to load. Auditorium applause now plays once per visit after three seconds; leaving cancels the cue and stops the recorded burst.

The README cover is an original repository-local SVG. The detailed moon surface and subtle radial halo are generated by code in Moon.tsx; no external lunar imagery is used.
