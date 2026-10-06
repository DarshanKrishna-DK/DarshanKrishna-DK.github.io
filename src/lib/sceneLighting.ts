/** Room baselines are independent of passage dimming. Keep the approved room look. */
const rooms = [
  { ambient: .06, directional: 0, environment: 0 },
  { ambient: .25, directional: .18, environment: .22 },
  { ambient: .10, directional: .05, environment: .06 },
  { ambient: .52, directional: .5, environment: .22 },
  { ambient: .66, directional: .88, environment: 0 },
  { ambient: .16, directional: .10, environment: .10 },
  { ambient: .32, directional: .8, environment: 0 },
] as const;

export function sceneLighting(chapter: number, beat: number, passage = 0) {
  const base = chapter === 4 && beat === 1
    ? { ambient: .20, directional: .24, environment: 0 }
    : rooms[chapter];
  const gain = 1 - Math.max(0, Math.min(1, passage)) * .92;
  return { ambient: base.ambient * gain, directional: base.directional * gain, environment: base.environment * gain };
}
