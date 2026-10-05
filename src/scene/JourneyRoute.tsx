import { useEffect, useMemo } from 'react';
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Shape, ShapeGeometry } from 'three';
import { type Instance } from './Instances';
import { ARCH, EXIT_Z, WORLD_Z, chapterLength } from '../lib/routeLayout';
import { ArchPortal } from './ArchPortal';

export const ROUTE_FLOOR = { y: -1.82, front: 17, back: -285, width: 100 };
const passageStart=EXIT_Z.map(z=>z-.04);
export function createPassageGeometry(from:number) {
  const start=passageStart[from],length=-chapterLength(from)+10-start;
  const p:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let j=0;j<=18;j++)for(let i=0;i<=32;i++){
    const t=j/18,a=i/32*Math.PI;
    const x=from===0?3*(1-t):-2.2;
    const radius=from===0?3.05+t*3:5.8;
    p.push(x+Math.cos(a)*radius,-1.71+Math.sin(a)*(from===0?6:7.4),start+t*length);
    uv.push(i/32,t);
    if(j<18&&i<32){const n=j*33+i;indices.push(n,n+1,n+33,n+1,n+34,n+33);}
  }
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
const tones=['#8569c3','#73bdb6','#d4b27e','#beaa8b','#927dd1','#bfa788'];
function Passage({from}:{from:number}){
  const start=passageStart[from],length=-chapterLength(from)+10-start;
  const geometry=useMemo(()=>createPassageGeometry(from),[from]);useEffect(()=>()=>geometry.dispose(),[geometry]);
  const ribs=useMemo<Instance[]>(()=>Array.from({length:9},(_,j)=>Array.from({length:31},(_,i):Instance=>{
    const t=j/8,a=(i+.5)/31*Math.PI,r=from===0?3.05+t*3:5.8,h=from===0?6:7.4;
    return {position:[(from===0?3*(1-t):-2.2)+Math.cos(a)*r,-1.71+Math.sin(a)*h,start+t*length],scale:[.035,.035,.09],color:tones[from]};
  })).flat(),[from]);
  const leds=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(ribs.flatMap(r=>r.position),3));return g;},[ribs]);
  const ledUniforms=useMemo(()=>({tint:{value:new Color(tones[from])}}),[from]);useEffect(()=>()=>leds.dispose(),[leds]);
  return <group position={[0,0,WORLD_Z[from]]}>
    <mesh geometry={geometry}><meshStandardMaterial side={DoubleSide} color={from===3||from===5?'#303635':'#202d3c'} roughness={.52} metalness={.22} emissive={tones[from]} emissiveIntensity={.065}/></mesh>
    <points geometry={leds}><shaderMaterial transparent depthWrite={false} uniforms={ledUniforms} vertexShader={'varying float depth;void main(){vec4 p=modelViewMatrix*vec4(position,1.);depth=-p.z;gl_Position=projectionMatrix*p;gl_PointSize=clamp(25./depth,1.,5.);}'} fragmentShader={'uniform vec3 tint;varying float depth;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(tint,(1.-d*d)*.85*(1.-smoothstep(18.,65.,depth)));\n#include <colorspace_fragment>\n}'}/></points>
    {[-1,1].map(s=><mesh key={s} position={[(from===0?1.5:-2.2)+s*3.9,-1.695,start+length/2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.028,Math.abs(length)]}/><meshBasicMaterial color={tones[from]} toneMapped={false}/></mesh>)}
    {[0,1,2,3,4].map(i=><mesh key={i} position={[(from===0?3*(1-i/4):-2.2),-1.69,start+length*(i+.5)/5]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[8,.022]}/><meshBasicMaterial color={tones[from]} transparent opacity={.26}/></mesh>)}
  </group>;
}
export function JourneyRoute({progress}:{progress:number}){return <group>
  <mesh position={[0,ROUTE_FLOOR.y,(ROUTE_FLOOR.front+ROUTE_FLOOR.back)/2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[ROUTE_FLOOR.width,ROUTE_FLOOR.front-ROUTE_FLOOR.back]}/><meshStandardMaterial color="#15212a" roughness={.38} metalness={.28} emissive="#1b2931" emissiveIntensity={.14}/></mesh>
  <mesh position={[0,ROUTE_FLOOR.y+.002,-3]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[100,40]}/><meshBasicMaterial color="#030208" fog={false}/></mesh>
  {[0,1,2,3,4,5].filter(from=>from>=Math.floor(progress*6)-1&&from<=Math.ceil(progress*6)).map(from=><Passage key={from} from={from}/>)}
</group>;}

// Solid architecture around a real arched exit. Adjacent scenery cannot show
// through the stage, and the camera has an open route through each room.
export function createBackWallGeometry(width=26,height=10){
  // An open-bottom notch is part of the outer contour, never a hole touching
  // the edge. A touching hole triangulates into the old diagonal obstruction.
  const a=ARCH,s=new Shape();s.moveTo(-10,a.base);s.lineTo(-10,height+a.base);s.lineTo(width-10,height+a.base);s.lineTo(width-10,a.base);
  s.lineTo(a.right,a.base);s.lineTo(a.right,a.spring);s.absarc(a.center,a.spring,a.radius,0,Math.PI,false);s.lineTo(a.left,a.base);s.closePath();return new ShapeGeometry(s,36);
}
export function BackWall({z=-7.1,color='#263740',width=26,height=10,portalColor='#9589d0'}:{z?:number;color?:string;width?:number;height?:number;portalColor?:string}){
  const geometry=useMemo(()=>createBackWallGeometry(width,height),[width,height]);useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group><mesh position={[0,0,z]} geometry={geometry}><meshStandardMaterial color={color} side={DoubleSide} roughness={.85}/></mesh><ArchPortal z={z+.018} color={portalColor}/></group>;
}
