import { expect, it } from 'vitest';
import { Euler, FrontSide, Mesh, MeshBasicMaterial, Quaternion, Raycaster, Vector3 } from 'three';
import { createBackWallGeometry } from './JourneyRoute';
import { createArchVeilGeometry } from './ArchPortal';
import { ARCH, EXIT_Z, WORLD_Z, chapterLength, portalPhase, roadBikeOpacity } from '../lib/routeLayout';
import { sampleCameraJourney } from '../lib/journey';
import { micUprightRotation } from './People';
import { AudienceCue, applauseEnvelope } from '../lib/audienceCue';
import { hasMusic, soundscapeIndex } from '../data/soundscapes';
import { natureMix } from '../lib/natureAudio';

it('has no wall triangles or threshold across the entire arched doorway',()=>{
  const geometry=createBackWallGeometry(),material=new MeshBasicMaterial(),wall=new Mesh(geometry,material);
  for(let y=ARCH.base+.01;y<3.7;y+=.1)for(let x=ARCH.left+.05;x<ARCH.right-.05;x+=.1){
    if(y>ARCH.spring&&Math.hypot(x-ARCH.center,y-ARCH.spring)>ARCH.radius-.05)continue;
    const ray=new Raycaster(new Vector3(x,y,1),new Vector3(0,0,-1));expect(ray.intersectObject(wall)).toHaveLength(0);
  }geometry.dispose();material.dispose();
});
it('hides the tunnel with an opaque front face and reveals it after crossing',()=>{
  const geometry=createArchVeilGeometry(),material=new MeshBasicMaterial({side:FrontSide}),portal=new Mesh(geometry,material);
  expect(material.transparent).toBe(false);expect(material.depthWrite).toBe(true);
  expect(new Raycaster(new Vector3(ARCH.center,1,1),new Vector3(0,0,-1)).intersectObject(portal).length).toBeGreaterThan(0);
  expect(new Raycaster(new Vector3(ARCH.center,1,-1),new Vector3(0,0,1)).intersectObject(portal)).toHaveLength(0);
  geometry.dispose();material.dispose();
});
it('fits every camera through its arch including the extended Road and portrait framing',()=>{
  for(let chapter=1;chapter<6;chapter++)for(const portrait of [false,true]){
    const camera=sampleCameraJourney((chapter+portalPhase(chapter))/6,false,portrait).camera;
    expect(camera[2]-WORLD_Z[chapter]).toBeCloseTo(EXIT_Z[chapter]);
    expect(camera[0]).toBeGreaterThan(ARCH.left+.15);expect(camera[0]).toBeLessThan(ARCH.right-.15);
  }
  expect(chapterLength(4)).toBe(72);
  expect(roadBikeOpacity(4/6)).toBe(1);
  for(let phase=portalPhase(4);phase<1;phase+=.01)expect(roadBikeOpacity((4+phase)/6)).toBe(0);
});
it('keeps the microphone upright in the hand after applying arm rotations',()=>{
  const arm=new Quaternion().setFromEuler(new Euler(0,0,.24)).multiply(new Quaternion().setFromEuler(new Euler(-2.35,0,-.18)));
  const up=new Vector3(0,1,0).applyQuaternion(arm.multiply(micUprightRotation));expect(up.y).toBeGreaterThan(.94);
});
it('applauds once after three seconds and cancels short auditorium visits',()=>{
  const cue=new AudienceCue();cue.enter(true,20);expect(cue.poll(22.99,true)).toBe(false);expect(cue.poll(23,true)).toBe(true);
  expect(cue.poll(30,true)).toBe(false);expect(cue.poll(90,true)).toBe(false);
  cue.enter(false,91);cue.enter(true,100);cue.enter(false,102);expect(cue.poll(110,true)).toBe(false);
  cue.enter(true,120);expect(cue.poll(123,true)).toBe(true);
  expect(applauseEnvelope(2)).toBe(0);expect(applauseEnvelope(5)).toBe(1);expect(applauseEnvelope(12)).toBe(0);
});
it('does not replay a missed entrance cue when sound is unmuted later',()=>{
  const cue=new AudienceCue();cue.enter(true,0);expect(cue.poll(3,false)).toBe(false);expect(cue.poll(5,true)).toBe(false);
});
it('routes Road and Campfire to field recordings without any musical layer',()=>{
  for(const [world,beat] of [[4,0],[4,1],[4,2],[6,0]]){
    const theme=soundscapeIndex(world,beat);expect(hasMusic(theme)).toBe(false);expect(natureMix(theme).some(level=>level>0)).toBe(true);
  }
  for(let world=0;world<4;world++){expect(soundscapeIndex(world,0)).toBe(0);expect(hasMusic(soundscapeIndex(world,0))).toBe(true);}
  expect(natureMix(6)[2]).toBeGreaterThan(natureMix(6)[0]);expect(natureMix(4)[0]).toBeGreaterThan(0);
});
