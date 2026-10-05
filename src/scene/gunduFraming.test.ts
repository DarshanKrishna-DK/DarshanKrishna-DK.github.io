import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { gunduCamera, gunduLookAt } from './gunduFraming';

describe('Gundu framing',()=>{
  it('keeps the jump and accessory envelope inside every responsive canvas',()=>{
    for(const [width,height] of [[190,228],[160,195],[150,166],[115,135],[96,110],[135,160],[120,148],[100,120],[104,132],[88,106]]){
      const camera=new PerspectiveCamera(gunduCamera.fov,width/height,.1,100);
      camera.position.set(...gunduCamera.position);camera.lookAt(...gunduLookAt);camera.updateMatrixWorld();
      // Conservative envelope: tuft at peak jump, outstretched wings, shoes and bill.
      for(const x of [-1,1])for(const y of [-.98,2])for(const z of [-.75,.7]){
        const screen=new Vector3(x,y,z).project(camera);
        expect(Math.abs(screen.x)).toBeLessThan(.96);
        expect(Math.abs(screen.y)).toBeLessThan(.96);
      }
    }
  });
});
