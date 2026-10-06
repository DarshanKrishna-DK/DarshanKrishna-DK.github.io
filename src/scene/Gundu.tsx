import { memo, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ACESFilmicToneMapping, Group, LatheGeometry, MathUtils, SplineCurve, Vector2 } from 'three';
import type { GunduState } from '../lib/companion';
import { FrameClock } from './FrameClock';
import { Rounded, StudioEnvironment } from './Materials';
import { gunduCamera, gunduLookAt } from './gunduFraming';

function Clay({position,scale,color='#f9e8bf',rotation=[0,0,0],metal=0}:{position:[number,number,number];scale:[number,number,number];color?:string;rotation?:[number,number,number];metal?:number}){
  return <mesh position={position} scale={scale} rotation={rotation}><sphereGeometry args={[1,24,16]}/><meshPhysicalMaterial color={color} roughness={.38} metalness={metal} clearcoat={.25} clearcoatRoughness={.3}/></mesh>;
}
function Laptop(){return <group position={[0,-.13,.9]} rotation={[.05,0,0]}>
  <Rounded size={[.85,.055,.49]} radius={.025} color="#697783" metal={.8}/>
  <Rounded position={[0,.032,.115]} size={[.24,.008,.12]} radius={.015} color="#93a2aa"/>
  {Array.from({length:24},(_,i)=><Rounded key={i} position={[-.30+(i%8)*.085,.034,-.13+Math.floor(i/8)*.065]} size={[.064,.012,.045]} radius={.006} color="#1d2e38"/>)}
  <group position={[0,.04,-.23]} rotation={[-.19,0,0]}><Rounded position={[0,.26,0]} size={[.85,.53,.044]} radius={.025} color="#566d7b" metal={.8}/>
    <Rounded position={[0,.26,.026]} size={[.75,.43,.008]} radius={.018} color="#071e28" metal={.1}/>
    {[0,1,2,3,4].map(i=><Rounded key={i} position={[-.11+(i%2)*.03,.40-i*.068,.034]} size={[.42-(i%3)*.09,.014,.003]} radius={.001} color={i===4?'#f8c56f':'#76dcce'} glow={.8}/>)}
    <Clay position={[0,.507,.027]} scale={[.012,.012,.003]} color="#080e14"/>
  </group>
</group>;}
export function Duck({state='idle',pointer,reduced=false,accessory}:{state?:GunduState;pointer?:RefObject<[number,number]>;reduced?:boolean;accessory?:GunduState}){
  const body=useRef<Group>(null),head=useRef<Group>(null),left=useRef<Group>(null),right=useRef<Group>(null),eyes=useRef<Group>(null),feet=useRef<Group>(null),laptop=useRef<Group>(null);
  const jaw=useRef<Group>(null);const started=useRef(0);const previous=useRef(state);
  const geometry=useMemo(()=>new LatheGeometry(new SplineCurve([new Vector2(0,-.67),new Vector2(.26,-.65),new Vector2(.49,-.51),new Vector2(.60,-.26),new Vector2(.61,.02),new Vector2(.55,.27),new Vector2(.43,.49),new Vector2(.29,.62),new Vector2(.24,.78),new Vector2(0,.82)]).getPoints(40),48),[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const sitting=['sitting','typing','sleeping','campfire','gaming'].includes(state);
  const hasLaptop=(state==='typing'||state==='gaming')&&accessory!=='helmet'&&accessory!=='microphone';
  const helmet=state==='helmet'||accessory==='helmet';const microphone=state==='microphone'||accessory==='microphone';
  useFrame(({clock},delta)=>{
    if(!body.current||!head.current||!left.current||!right.current||!feet.current||!eyes.current||!laptop.current)return;
    const t=clock.elapsedTime;if(previous.current!==state){previous.current=state;started.current=t;}const age=t-started.current;
    const dance=state==='dancing',warming=state==='warming',quacking=state==='quacking';const cursor=pointer?.current??[0,0];const move=state==='walking'||state==='running';const f=state==='running'?15:9;const breathe=reduced?0:Math.sin(t*2)*.018;
    const damp=(from:number,to:number)=>reduced?to:MathUtils.damp(from,to,9,Math.min(delta,.05));
    body.current.position.y=damp(body.current.position.y,(sitting?-.13:0)+breathe+(move&&!reduced?Math.abs(Math.sin(t*f))*.045:0));
    body.current.rotation.z=damp(body.current.rotation.z,state==='annoyed'?-.12:dance&&!reduced?Math.sin(t*6)*.13:move&&!reduced?Math.sin(t*f)*.04:0);
    body.current.rotation.y=damp(body.current.rotation.y,warming?-1.35:dance&&!reduced?Math.sin(t*3)*.45:state==='peeking'?.48:state==='stretching'?-.4:-.24);
    head.current.rotation.y=damp(head.current.rotation.y,warming?-.15:state==='sleeping'?-.45:cursor[0]*.8);
    head.current.rotation.x=damp(head.current.rotation.x,warming?.15:state==='sleeping'?.32:state==='typing'?.23:state==='surprised'?-.2:-cursor[1]*.32+(quacking&&!reduced?Math.sin(age*18)*.07:state==='talking'&&!reduced?Math.sin(t*7)*.04:0));
    if(jaw.current)jaw.current.rotation.x=damp(jaw.current.rotation.x,quacking?(reduced?.26:.15+Math.abs(Math.sin(age*14))*.5):0);
    const blink=!reduced&&t%5.8>5.64;const shut=state==='sleeping'||blink;
    eyes.current.scale.y=damp(eyes.current.scale.y,shut?.08:state==='annoyed'?.57:state==='surprised'?1.25:1);
    const wave=(state==='waving'||dance)&&!reduced?-1.9+Math.sin(age*9)*.25:state==='stretching'?-1.35:state==='pointing'?-.9:hasLaptop?-.6:move&&!reduced?Math.sin(t*f)*.3:0;
    left.current.rotation.z=damp(left.current.rotation.z,warming?-.72:wave);
    right.current.rotation.z=damp(right.current.rotation.z,warming?.72:dance&&!reduced?1.4+Math.sin(t*7)*.3:state==='stretching'?1.35:hasLaptop?.6:microphone?.75:move&&!reduced?-Math.sin(t*f)*.3:0);
    left.current.rotation.x=damp(left.current.rotation.x,warming?-.9+(reduced?0:Math.sin(t*3)*.05):0);right.current.rotation.x=damp(right.current.rotation.x,warming?-.9:0);
    feet.current.children.forEach((foot,i)=>{foot.rotation.x=damp(foot.rotation.x,(move||dance)&&!reduced?Math.sin(t*(dance?6:f)+i*Math.PI)*.65:0);});
    laptop.current.scale.setScalar(damp(laptop.current.scale.x,hasLaptop?1:.001));
  });
  return <group ref={body} rotation={[0,-.24,0]}>
    <mesh geometry={geometry} scale={[1,1,.84]}><meshPhysicalMaterial color="#f7e4b9" roughness={.4} clearcoat={.26}/></mesh>
    <Clay position={[0,-.28,-.43]} scale={[.24,.19,.31]} rotation={[-.5,0,0]}/>
    <group ref={head} position={[0,.87,.07]}>
      <Clay position={[0,0,0]} scale={[.47,.45,.43]} color="#fff0cc"/>
      <Clay position={[0,-.135,.445]} scale={[.27,.092,.255]} color="#edac4f"/>
      <group ref={jaw} position={[0,-.18,.27]}><Clay position={[0,-.025,.175]} scale={[.24,.028,.23]} color="#a45e30"/><Clay position={[0,-.048,.16]} scale={[.245,.033,.205]} color="#dc953e"/></group>
      {[-1,1].map(s=><Clay key={s} position={[s*.105,-.107,.645]} scale={[.018,.012,.006]} color="#a06430"/>)}
      <group ref={eyes} position={[0,.075,.385]}>{[-1,1].map(s=><group key={s} position={[s*.195,0,0]}>
        <Clay position={[0,0,0]} scale={[.065,.09,.042]} color="#182329" metal={.1}/>
        <Clay position={[.016,.03,.033]} scale={[.017,.021,.01]} color="#ffffff"/>
      </group>)}</group>
      {[-1,1].map(s=><Clay key={s} position={[s*.325,-.11,.302]} scale={[.072,.04,.02]} color="#efc097"/>)}
      <Clay position={[.025,.4,-.045]} scale={[.065,.16,.08]} rotation={[.2,0,-.3]} color="#fff0cc"/>
      <Clay position={[-.045,.394,-.07]} scale={[.045,.12,.065]} rotation={[.2,0,.25]} color="#fff0cc"/>
      {helmet&&<group><mesh position={[0,.09,-.025]}><sphereGeometry args={[.49,48,32,0,Math.PI*2,0,Math.PI/2]}/><meshPhysicalMaterial color="#253c45" metalness={.6} roughness={.22} clearcoat={1}/></mesh><Rounded position={[0,.155,.415]} size={[.66,.085,.11]} radius={.04} color="#a7e0d9" metal={.7}/><Clay position={[.48,.08,0]} scale={[.045,.075,.075]} color="#f3b663" metal={.7}/></group>}
    </group>
    <group ref={left} position={[-.5,.29,0]}><Clay position={[-.035,-.14,.025]} scale={[.15,.36,.245]} rotation={[.15,0,-.19]} color="#e2cda2"/></group>
    <group ref={right} position={[.5,.29,0]}><Clay position={[.035,-.14,.025]} scale={[.15,.36,.245]} rotation={[.15,0,.19]} color="#ecd7af"/></group>
    <group ref={feet}>{[-1,1].map(s=><group key={s} position={[s*.235,-.65,.055]}>
      <Clay position={[0,-.08,0]} scale={[.064,.14,.06]} color="#c58b3a"/>
      <Clay position={[0,-.19,.16]} scale={[.21,.065,.24]} color="#e4a347"/>
      {[-1,0,1].map(n=><Clay key={n} position={[n*.11,-.18,.31-Math.abs(n)*.03]} scale={[.077,.049,.09]} color="#e4a347"/>)}
    </group>)}</group>
    <group ref={laptop} scale={hasLaptop?1:.001}>{hasLaptop&&<Laptop/>}</group>
    {microphone&&<group position={[.62,.24,.37]} rotation={[0,0,-.25]}><Rounded size={[.055,.38,.055]} radius={.022} color="#677480" metal={.8}/><Clay position={[0,.24,0]} scale={[.095,.115,.095]} color="#283945" metal={.6}/><Rounded position={[0,.04,.032]} size={[.03,.025,.007]} color="#6cd9c9" glow={1}/></group>}
  </group>;
}
export const Gundu=memo(function Gundu({state,reduced,onClick,accessory,onReady}:{state:GunduState;reduced:boolean;onClick:()=>void;accessory?:GunduState;onReady?:()=>void}){
  const redraw=useRef<(()=>void)|null>(null);const hit=useRef<HTMLButtonElement>(null),pointer=useRef<[number,number]>([0,0]);
  useEffect(()=>{let previous=0;const track=(event:PointerEvent)=>{const now=performance.now();if(now-previous<32||!hit.current)return;previous=now;const r=hit.current.getBoundingClientRect();pointer.current=[MathUtils.clamp((event.clientX-r.left-r.width/2)/Math.max(220,innerWidth*.5),-1,1),MathUtils.clamp((r.top+r.height*.36-event.clientY)/Math.max(180,innerHeight*.5),-1,1)];if(reduced)redraw.current?.();};window.addEventListener('pointermove',track,{passive:true});return()=>window.removeEventListener('pointermove',track);},[reduced]);
  return <button ref={hit} className="gundu-hit" data-action={state} onClick={onClick} aria-label="Talk to Gundu, your duck companion" title="Talk to Gundu">
    <Canvas camera={gunduCamera} dpr={[1,1.25]} onCreated={({camera,invalidate})=>{redraw.current=invalidate;camera.lookAt(...gunduLookAt);onReady?.();}} gl={{alpha:true,antialias:true,toneMapping:ACESFilmicToneMapping}} frameloop="demand">
      <FrameClock reduced={reduced} fps={30}/><StudioEnvironment/>
      <ambientLight intensity={.7}/><directionalLight position={[3,5,4]} intensity={3.2} color="#fff1d1"/><directionalLight position={[-3,2,-2]} intensity={2.5} color="#a0dcd5"/><Duck state={state} pointer={pointer} reduced={reduced} accessory={accessory}/>
    </Canvas>
    {state==='sleeping'&&<span className="sleep-symbols" aria-hidden="true"><i>Z</i><i>Z</i><i>Z</i></span>}
    {state==='quacking'&&<span className="quack-caption" aria-hidden="true">QUACK!</span>}
  </button>;
});
