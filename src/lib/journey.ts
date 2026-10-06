import { worlds, type WorldId } from '../data/worlds';
import { routeZ } from './routeLayout';
export function sampleJourney(progress: number): { index: number; local: number; camera: [number,number,number]; target: [number,number,number] } {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const t = p * 6;
  // The destination is readable only after the camera has crossed its entrance.
  // Switching halfway through the passage used to put new copy over an empty view.
  const index = Math.min(6, Math.floor(t + .18));
  const sway = t < 1 ? Math.sin(t * Math.PI) * 1.7 : -3.25 * Math.pow(Math.sin((t % 1) * Math.PI), 1.3);
  const entranceArc=t<.65?Math.pow(Math.sin(t/.65*Math.PI),2)*1.5:0;
  return { index, local: Math.max(0,Math.min(1,t-index+0.5)), camera: [sway+entranceArc, 1.8+Math.sin(t*Math.PI)*0.3, 8+routeZ(t)], target: [sway*(t<1?.25:.8),0.7,routeZ(t)] };
}
export function worldProgress(id: WorldId): number { return Math.max(0,worlds.findIndex(w => w.id === id)) / 6; }
/** A recognized chapter URL is a direct entry, including on a fresh visit. */
export function entryWorld(hash: string): WorldId | null { return worlds.find(w => `#${w.id}` === hash)?.id ?? null; }
export function hashWorld(hash: string): WorldId { return worlds.find(w => w.id === hash.replace('#',''))?.id ?? 'spawn'; }
export function sampleCameraJourney(progress:number,reduced=false,portrait=false){
  const sample=sampleJourney(reduced?sampleJourney(progress).index/6:progress);
  if(portrait){
    const t=reduced?sample.index:progress*6;
    const framing=t<.65?1-Math.pow(Math.sin(t/.65*Math.PI),2):1-Math.pow(Math.sin((t%1)*Math.PI),2);
    const offset=[2.5,2.1,2.8,2,0,2,2][sample.index]*framing;
    sample.camera[0]+=offset;sample.target[0]+=offset;
  }
  return sample;
}
