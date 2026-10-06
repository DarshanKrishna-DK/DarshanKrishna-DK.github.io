import { expect, it } from 'vitest';
import { sceneLighting } from './sceneLighting';
import { passageDarkness, portalPhase, spawnPortraitOpacity } from './routeLayout';
import { roadGroundHeight, lakeShore } from '../scene/RoadScenery';

it('preserves the approved room lighting outside passages',()=>{
  expect(sceneLighting(1,0)).toEqual({ambient:.25,directional:.18,environment:.22});
  expect(sceneLighting(3,0)).toEqual({ambient:.52,directional:.5,environment:.22});
  expect(sceneLighting(5,0)).toEqual({ambient:.16,directional:.10,environment:.10});
  for(let chapter=0;chapter<7;chapter++)expect(sceneLighting(chapter,0,passageDarkness(chapter/6))).toEqual(sceneLighting(chapter,0));
  expect(sceneLighting(3,0,1).ambient).toBeLessThan(.05);
});
it('clears the portrait before the portal, including reverse travel',()=>{
  const crossing=portalPhase(0)/6;
  expect(spawnPortraitOpacity(0)).toBe(1);
  expect(spawnPortraitOpacity(crossing)).toBe(0);
  expect(spawnPortraitOpacity(.1)).toBe(0);
  expect(spawnPortraitOpacity(crossing-.02)).toBeGreaterThan(0);
  expect(spawnPortraitOpacity(0)).toBe(1);
});
it('keeps lake vegetation on dry banks and the lake bed below the water',()=>{
  for(let z=-43;z<=8;z+=.5){
    expect(roadGroundHeight(-2,z,true)).toBeLessThan(-1.62);
    for(const side of [-1,1])expect(roadGroundHeight(-2+side*(lakeShore(z)+.38),z,true)).toBeGreaterThan(-1.62);
  }
});
