import { describe, expect, it } from 'vitest';
import { satelliteOrbit } from './orbit';
import { arcadeScreenVisible, passageDarkness, WORLD_Z, EXIT_Z, chapterLength, portalPhase } from './routeLayout';

describe('orbital motion',()=>{
  it('returns continuously to its starting point without teleporting at the loop',()=>{
    const start=satelliteOrbit(0),end=satelliteOrbit(66);
    start.forEach((n,i)=>expect(end[i]).toBeCloseTo(n,8));
    const before=satelliteOrbit(65.99),after=satelliteOrbit(66.01);
    expect(Math.hypot(...before.map((n,i)=>n-after[i]))).toBeLessThan(.025);
  });
  it('stays above the Earth surface around its entire orbit',()=>{
    for(let t=0;t<66;t+=.25)expect(Math.hypot(...satelliteOrbit(t))).toBeGreaterThan(6.285);
  });
});
describe('passage lighting and arcade entrance',()=>{
  it('dims all six passages without dimming settled chapter views',()=>{
    WORLD_Z.forEach((_,i)=>expect(passageDarkness(i/6)).toBe(0));
    EXIT_Z.forEach((exit,i)=>{
      const start=WORLD_Z[i]+exit,end=WORLD_Z[i+1]+10,z=(start+end)/2;
      const t=i+(8+WORLD_Z[i]-z)/chapterLength(i);
      expect(passageDarkness(t/6)).toBeGreaterThan(.9);
      expect(passageDarkness((i+portalPhase(i))/6)).toBeGreaterThan(0);
    });
  });
  it('reveals video at the far end of the Road arch, without requiring monitor proximity',()=>{
    const entrance=WORLD_Z[5]+10;
    expect(arcadeScreenVisible(entrance+.01)).toBe(false);
    expect(arcadeScreenVisible(entrance)).toBe(true);
    expect(arcadeScreenVisible(WORLD_Z[5]+8)).toBe(true);
    expect(arcadeScreenVisible(WORLD_Z[5]+EXIT_Z[5])).toBe(false);
  });
});
