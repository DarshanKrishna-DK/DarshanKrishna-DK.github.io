import { WORLD_Z, EXIT_Z } from '../lib/routeLayout';
import { arcadeLeftScreen, labCabinets } from './roomLayout';
﻿import { expect,it } from 'vitest';
import { sampleCameraJourney, sampleJourney } from '../lib/journey';
import { ROUTE_FLOOR } from './JourneyRoute';
import { presenterPose } from './presenter';
import { createRoadGeometry } from './Nature';
it('does not reveal the next chapter while its focal environment is still distant',()=>{
  for(let from=0;from<6;from++){
    expect(sampleJourney((from+.55)/6).index).toBe(from);
    expect(sampleJourney((from+.90)/6).index).toBe(from+1);
  }
});
it('keeps desktop and portrait cameras inside the arched exits',()=>{
  for(const [chapter,z] of [[1,-7.1],[2,-8.9],[3,-12.3],[5,-7.1]])for(const portrait of [false,true]){
    const p=(chapter+(8-z)/36)/6;
    const {camera}=sampleCameraJourney(p,false,portrait);
    expect(camera[0]).toBeGreaterThan(-5.1);expect(camera[0]).toBeLessThan(-1.35);
    expect(camera[1]).toBeLessThan(3.8);
  }
});
it('keeps reduced-motion camera and narrative on the same chapter',()=>{
  for(let i=0;i<=600;i++){const p=i/600;const camera=sampleCameraJourney(p,true);expect(camera.index).toBe(sampleJourney(p).index);expect(camera.camera[2]).toBe(8+WORLD_Z[camera.index]);}
});
it('supports the whole route without covering the natural ground or extending the road into the next room',()=>{
  for(let i=0;i<=600;i++){const {camera}=sampleCameraJourney(i/600);expect(camera[2]).toBeLessThan(ROUTE_FLOOR.front);expect(camera[2]).toBeGreaterThan(ROUTE_FLOOR.back);expect(Math.abs(camera[0])).toBeLessThan(ROUTE_FLOOR.width/2);}
  expect(ROUTE_FLOOR.y).toBeLessThan(-1.786);
  const road=createRoadGeometry();road.computeBoundingBox();expect(road.boundingBox!.min.z).toBeGreaterThanOrEqual(EXIT_Z[4]);expect(road.boundingBox!.max.z).toBeLessThanOrEqual(12);road.dispose();
});
it('lets the presenter walk both ways and pause to explain within the stage',()=>{
  expect(presenterPose(2).x).toBeLessThan(presenterPose(4).x);
  expect(presenterPose(11).x).toBeGreaterThan(presenterPose(13).x);
  expect(presenterPose(7).walking).toBe(false);expect(presenterPose(16).walking).toBe(false);
  for(let t=0;t<36;t+=.1){expect(presenterPose(t).x).toBeGreaterThanOrEqual(2.3);expect(presenterPose(t).x).toBeLessThanOrEqual(5.1);}
});

it('keeps the camera and near plane clear of furniture beside the route',()=>{
  const a=arcadeLeftScreen;const obstacles=[{chapter:5,min:[a.x-a.width/2-.075,a.y-a.height/2-.075,a.z-.08],max:[a.x+a.width/2+.075,a.y+a.height/2+.075,a.z+.09]},...labCabinets.map(x=>({chapter:1,min:[x-1.125,-1.7,-4.6],max:[x+1.125,2.1,-3.4]}))];
  for(const o of obstacles)for(const portrait of [false,true])for(let t=0;t<.9;t+=.002){const c=sampleCameraJourney((o.chapter+t)/6,false,portrait).camera;const p=[c[0],c[1],c[2]-WORLD_Z[o.chapter]];const collides=p.every((v,i)=>v>o.min[i]-.10&&v<o.max[i]+.10);expect(collides).toBe(false);}
});
