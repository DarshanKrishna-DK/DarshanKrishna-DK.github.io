import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
// Both canvases pause when hidden and use a bounded rendering cadence.
export function FrameClock({ reduced=false, fps=40 }: {reduced?:boolean;fps?:number}) {
  const invalidate=useThree(s=>s.invalidate);
  useEffect(()=>{
    if(reduced){invalidate();return;}
    let frame=0;let previous=0;
    const tick=(now:number)=>{if(!document.hidden&&now-previous>=1000/fps-1){invalidate();previous=now;}frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[invalidate,reduced,fps]);
  return null;
}
