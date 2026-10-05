# Arcade media

The three desk screens play muted official publisher trailers through YouTube privacy-enhanced embeds. These are trailers, not a claim of live gameplay or Darshan's recorded play sessions. No video footage is downloaded or rehosted.

- PUBG: [official Free-to-Play Gameplay Trailer](https://www.youtube.com/watch?v=aUZWZYshCgM).
- CS:GO: [Valve cinematic trailer](https://www.youtube.com/watch?v=edYCtaNueQY); [Valve's launch post](https://blog.counter-strike.net/2012/08/4472/).
- Mobile Legends: [Beyond Legends / Project NEXT](https://www.youtube.com/watch?v=1WolDM3mnSY), featured by the [official game website](https://game.mobilelegends.com/).

Change the publisher video IDs in src/scene/MediaScreen.tsx (gameClips). Each iframe is projected onto its 3D monitor using the current camera matrix. The source remains with its publisher and can become unavailable or blocked by browser/network policy.

Desktop begins warming three muted players shortly after entering the Road, before reaching its exit portal. They remain hidden until Arcade becomes active. Narrow screens mount only the center player. Reduced motion, opening a dialog, leaving the Road/Arcade preload range, or switching to lightweight mode removes the players. Hidden tabs send pause commands. Embedded audio is always muted; the portfolio's consent-controlled score remains the only audio source.

Original procedural game display graphics remain behind the video planes and serve as the reduced-motion and lightweight alternative. Do not label these illustrations as game footage.

October 5: locally optimized official YouTube trailer thumbnails in public/assets/arcade keep the monitors populated during player loading or provider failure. Sources are https://i.ytimg.com/vi/aUZWZYshCgM/hqdefault.jpg (PUBG), https://i.ytimg.com/vi/edYCtaNueQY/hqdefault.jpg (CS:GO), and https://i.ytimg.com/vi/1WolDM3mnSY/hqdefault.jpg (Mobile Legends). Copyright remains with their respective publishers. The iframe fades in only after reporting actual playback. Footage stays on YouTube.

Player commands wait for readiness. Official poster artwork stays visible until the player reports actual playback. Cold provider/network startup can still take several seconds; immediate playback is not guaranteed. All three publisher videos were verified playing muted in Chrome in the latest pass.
