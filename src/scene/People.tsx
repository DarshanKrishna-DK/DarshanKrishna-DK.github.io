import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Euler, Group, Quaternion } from 'three';
import { Rounded, Spotlight } from './Materials';
import { presenterPose } from './presenter';
import { Instances } from './Instances';
import { useMotionTime } from './Motion';
export const campfireLayout={fire:[2.2,0] as [number,number],chairs:[{x:.1,z:2.15},{x:4.35,z:2.15}],seatY:-.83};
export function fireFacingYaw(x:number,z:number){return Math.atan2(campfireLayout.fire[0]-x,campfireLayout.fire[1]-z);}
export function CampChair({x,z,occupied=false}:{x:number;z:number;occupied?:boolean}){const angle=fireFacingYaw(x,z);return <group position={[x,campfireLayout.seatY,z]} rotation={[0,angle,0]}>
  <Rounded size={[.9,.065,.84]} radius={.055} color="#384c4d" roughness={.95}/><Rounded position={[0,.39,-.38]} size={[.9,.82,.06]} rotation={[.12,0,0]} radius={.055} color="#405754" roughness={.95}/>
  <Instances shape="trunk" items={[-1,1].flatMap(s=>[-1,1].map(n=>({position:[s*.39,-.4,0],scale:[.018,.97,.018],rotation:[n*.5,0,0] as [number,number,number],color:'#687671'})))}/>
  {occupied&&<SeatedPerson/>}
 </group>;}
function SeatedPerson(){return <group position={[0,.045,0]}>
  <Rounded position={[0,.14,-.03]} size={[.51,.22,.39]} radius={.10} color="#26333c" roughness={.9}/>
  <Rounded position={[0,.52,-.13]} size={[.64,.64,.32]} radius={.18} color="#35494e" roughness={.95} rotation={[.08,0,0]}/>
  <Instances shape="person" items={[-1,1].flatMap(s=>[
    {position:[s*.18,.16,.30],scale:[.20,.27,.20],rotation:[Math.PI/2,0,0] as [number,number,number],color:'#26333c'},
    {position:[s*.18,-.36,.59],scale:[.18,.43,.18],color:'#26333c'},
    {position:[s*.35,.42,.06],scale:[.13,.23,.13],rotation:[-.30,0,s*.15] as [number,number,number],color:'#35494e'},
    {position:[s*.30,.25,.29],scale:[.13,.22,.13],rotation:[Math.PI/2,0,s*-.15] as [number,number,number],color:'#35494e'},
  ])}/>
  <Instances shape="head" items={[{position:[0,1.06,-.09],scale:[.21,.265,.215],color:'#947257'},{position:[0,1.17,-.12],scale:[.225,.18,.215],color:'#232522'},...[-1,1].map(s=>({position:[s*.265,.24,.5] as [number,number,number],scale:[.077,.065,.13] as [number,number,number],color:'#947257'}))]}/>
  <Instances items={[-1,1].map(s=>({position:[s*.18,-.84,.65],scale:[.24,.15,.41],color:'#1d292e'}))}/>
 </group>;}
export const micUprightRotation=new Quaternion().setFromEuler(new Euler(0,0,.24)).multiply(new Quaternion().setFromEuler(new Euler(-2.35,0,-.18))).invert().multiply(new Quaternion().setFromEuler(new Euler(-.12,0,.28)));
export function Speaker(){
 const body=useRef<Group>(null),arm=useRef<Group>(null),left=useRef<Group>(null),right=useRef<Group>(null),light=useRef<Group>(null),time=useMotionTime();
 useFrame(({clock})=>{const p=presenterPose(time(clock));if(body.current){body.current.position.x=p.x;body.current.rotation.y=p.yaw;}if(arm.current)arm.current.rotation.z=-p.gesture;if(left.current)left.current.rotation.x=p.step;if(right.current)right.current.rotation.x=-p.step;if(light.current)light.current.position.x=p.x;});
 return <><group ref={light} position={[2.3,0,-8.9]}><Spotlight position={[0,6,3]} target={[0,.1,0]} color="#ffe4ba" intensity={170} angle={.28}/></group><group ref={body} position={[2.3,-.94,-8.9]}>
   {[-1,1].map(s=><group key={s} ref={s===-1?left:right} position={[s*.15,.88,0]}><Rounded position={[0,-.39,0]} size={[.22,.8,.24]} color="#283342" radius={.1}/><Rounded position={[0,-.82,.09]} size={[.25,.13,.43]} color="#17222c" radius={.06}/></group>)}
   <Rounded position={[0,1.14,0]} size={[.68,.76,.34]} radius={.18} color="#798575" roughness={.85}/>
   <Instances shape="head" items={[{position:[0,1.77,.01],scale:[.225,.27,.23],color:'#9b7659'},{position:[0,1.89,-.035],scale:[.23,.17,.23],color:'#222728'},{position:[0,1.75,.24],scale:[.045,.055,.07],color:'#9b7659'},...[-1,1].map(s=>({position:[s*.08,1.81,.226] as [number,number,number],scale:[.018,.023,.014] as [number,number,number],color:'#1e292a'}))]}/>
   <group ref={arm} position={[-.35,1.40,0]}><Rounded position={[0,-.2,.02]} size={[.17,.47,.18]} radius={.08} color="#798575"/><group position={[0,-.4,.02]} rotation={[-.9,0,0]}><Rounded position={[0,-.14,0]} size={[.15,.34,.16]} radius={.07} color="#798575"/><Instances shape="head" items={[{position:[0,-.33,0],scale:[.075,.10,.075],color:'#9b7659'}]}/></group></group>
   <group position={[.36,1.40,.03]} rotation={[0,0,.24]}><Rounded position={[0,-.16,0]} size={[.18,.36,.18]} radius={.085} color="#798575"/><group position={[0,-.31,0]} rotation={[-2.35,0,-.18]}><Rounded position={[0,-.19,0]} size={[.16,.42,.17]} radius={.075} color="#798575"/><group position={[0,-.42,0]}><Instances shape="head" items={[{position:[0,0,0],scale:[.079,.10,.078],color:'#9b7659'}]}/><group quaternion={micUprightRotation}><Rounded position={[0,.08,0]} size={[.053,.28,.053]} color="#66777e" radius={.02}/><Instances shape="head" items={[{position:[0,.255,0],scale:[.075,.09,.075],color:'#18232b'}]}/></group></group></group></group>
 </group></>;
}
