import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Read-only DOM diagnostics for local performance checks; never exposed as portfolio copy.
export function RenderTelemetry() {
  const { gl } = useThree();
  const sample = useRef({ start: performance.now(), frames: 0, calls: 0, triangles: 0 });
  useEffect(() => { const previous=gl.info.autoReset; gl.info.autoReset=false; return()=>{gl.info.autoReset=previous;}; }, [gl]);
  useFrame(()=>gl.info.reset(), -100);
  useFrame(()=>{
    const s=sample.current,now=performance.now(); s.frames++; s.calls+=gl.info.render.calls; s.triangles+=gl.info.render.triangles;
    if(now-s.start>=2000){ const d=gl.domElement.dataset; d.renderFps=(s.frames*1000/(now-s.start)).toFixed(1); d.drawCalls=Math.round(s.calls/s.frames).toString(); d.triangles=Math.round(s.triangles/s.frames).toString(); d.pixelRatio=gl.getPixelRatio().toFixed(2); sample.current={start:now,frames:0,calls:0,triangles:0}; }
  },2);
  return null;
}
