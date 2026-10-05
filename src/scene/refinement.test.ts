import { expect, it } from 'vitest';
import { sampleJourney } from '../lib/journey';
import { campfireLayout, fireFacingYaw } from './People';
import { companionState } from '../lib/companion';
it('moves the camera through the circular aperture before leaving Spawn',()=>{
  const crossing=(8+4)/36/6;
  const camera=sampleJourney(crossing).camera;
  expect(camera[2]).toBeCloseTo(-4);
  expect(Math.hypot(camera[0]-3,camera[1]-1.15)).toBeLessThan(1.2);
  const a=sampleJourney((.65-.0001)/6).camera,b=sampleJourney((.65+.0001)/6).camera;
  expect(Math.hypot(...a.map((v,i)=>v-b[i]))).toBeLessThan(.02);
});
it('faces both chairs toward the fire, with travel taking priority over warming',()=>{
  for(const chair of campfireLayout.chairs){const yaw=fireFacingYaw(chair.x,chair.z),dx=campfireLayout.fire[0]-chair.x,dz=campfireLayout.fire[1]-chair.z,len=Math.hypot(dx,dz);expect(Math.sin(yaw)*dx/len+Math.cos(yaw)*dz/len).toBeCloseTo(1);}
  expect(companionState({world:6,idle:7,speed:0,clicks:0})).toBe('warming');
  expect(companionState({world:6,idle:7,speed:.2,clicks:0})).toBe('walking');
});
