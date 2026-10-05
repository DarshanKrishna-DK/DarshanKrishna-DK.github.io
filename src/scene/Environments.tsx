import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { Instances } from './Instances';
import { Display } from './Displays';
import { LightPool } from './Materials';
import { ProjectUplight } from './ProjectUplight';
import { BackWall } from './JourneyRoute';
import { useMotionTime } from './Motion';
import { projects } from '../data/projects';
export { SpawnEnvironment } from './Portal';
export { LabEnvironment, CityEnvironment, ArcadeEnvironment } from './Interiors';
export { RoadEnvironment, CampfireEnvironment } from './Nature';
const accents=['#e7c08a','#ac9ce7','#7bcad1'];

function ProductStage({i}:{i:number}){const p=projects[i],color=accents[i];return <group>
  <mesh position={[0,-1.53,0]}><cylinderGeometry args={[1.95,2.06,.34,64]}/><meshStandardMaterial color="#273742" roughness={.2} metalness={.7}/></mesh>
  <mesh position={[0,-1.345,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.87,.018,8,80]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
  <mesh position={[0,-.61,-.32]}><cylinderGeometry args={[.14,.31,1.7,24]}/><meshStandardMaterial color="#667b82" roughness={.22} metalness={.8}/></mesh>
  <group position={[0,1,-.1]}>
    <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1.60,1.60,.32,80]}/><meshStandardMaterial color="#455364" roughness={.19} metalness={.8}/></mesh>
    {[1.49,1.59].map(r=><mesh key={r} position={[0,0,.18]}><torusGeometry args={[r,r===1.49?.022:.011,8,80]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>)}
    <Instances shape="sphere" emissive items={Array.from({length:40},(_,n)=>({position:[Math.cos(n*Math.PI/20)*1.548,Math.sin(n*Math.PI/20)*1.548,.183],scale:[.013,.013,.012],color}))}/>
    <group position={[0,0,.185]}><Display kind="logo" logo={p.logo} name={p.name} width={2.88} round/></group>
  </group>
  {[-1,1].map(side=><ProjectUplight key={side} side={side} color={side===-1?'#d6e8f8':color}/>)}
  <LightPool position={[0,-1.335,0]} size={4} color={color} opacity={.22}/>
</group>;}

export function ProjectEnvironment({onProject,selected}:{onProject:(i:number)=>void;selected:number}){
 const ref=useRef<Group>(null),time=useMotionTime(),invalidate=useThree(s=>s.invalidate);useEffect(()=>invalidate(),[selected,invalidate]);
 useFrame(({clock},dt)=>{let side=0;ref.current?.children.forEach((g,i)=>{const a=i===selected,x=a?3.2:side++===0?-.9:7.8;const damp=(f:number,t:number)=>time(clock)===0?t:MathUtils.damp(f,t,7,Math.min(dt,.06));g.position.x=damp(g.position.x,x);g.position.z=damp(g.position.z,a?0:-3.9);g.scale.setScalar(damp(g.scale.x,a?1:.76));g.rotation.y=damp(g.rotation.y,a?-.08:x<0?.24:-.24);});});
 return <group>
   <BackWall z={-8.9} color="#111923" portalColor="#796193"/>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.705,-3]}><planeGeometry args={[32,29]}/><meshStandardMaterial color="#101b25" roughness={.24} metalness={.48}/></mesh>
   <mesh position={[3,-1.69,-1.5]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[9.5,9.5,15,80,1,true,Math.PI/2,Math.PI]}/><meshStandardMaterial side={2} color="#101922" roughness={.72} metalness={.25}/></mesh>
   {[-8.6,-5.2,-1.8,1.6,5].map(z=><group key={z} position={[3,-1.69,z]}><mesh><torusGeometry args={[9.4,.10,12,80,Math.PI]}/><meshStandardMaterial color="#283741" roughness={.42} metalness={.65}/></mesh><mesh position={[0,0,-.15]}><torusGeometry args={[9.4,.03,6,80,Math.PI]}/><meshStandardMaterial color="#121b24" roughness={.5}/></mesh></group>)}
   <Instances shape="trunk" items={Array.from({length:19},(_,i)=>({position:[-.7+i*.82,2,-8.76],scale:[.027,7,.027],color:'#2b303c'}))}/>
   <group ref={ref}>{projects.map((p,i)=><group key={p.id} position={[i*4-.9,0,i===selected?0:-3.9]} onClick={()=>onProject(i)}><ProductStage i={i}/></group>)}</group>
 </group>;
}
export function TransitionObjects({from}:{from:number}){return from===4?<Instances shape="sphere" items={Array.from({length:30},(_,i)=>({position:[Math.sin(i*4)*4,Math.cos(i*3)*2+2,-13-i*.25],scale:[.025,.025,.025],color:'#b9c895'}))} emissive/>:null;}
