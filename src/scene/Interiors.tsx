import { useMemo } from 'react';
import { DoubleSide } from 'three';
import { BackWall } from './JourneyRoute';
import { AnimatedAudience } from './Audience';
import { Rounded, LightPool } from './Materials';
import { Instances, type Instance } from './Instances';
import { Display } from './Displays';
import { Speaker } from './People';
import { MediaScreen, gameClips } from './MediaScreen';
import { arcadeLeftScreen, labCabinets } from './roomLayout';

function Room({gaming=false}:{gaming?:boolean}){return <group>
  <BackWall color={gaming?'#0c0d19':'#101b21'}/>
  {[-1,1].map(s=><mesh key={s} position={[3+s*12.5,2.4,.5]} rotation={[0,s*Math.PI/2,0]}><planeGeometry args={[17,8.2]}/><meshStandardMaterial side={DoubleSide} color={gaming?'#172033':'#25323a'} roughness={.85}/></mesh>)}
  <mesh position={[3,6.5,.5]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[25,17]}/><meshStandardMaterial color="#1c2a34" roughness={.8}/></mesh>
  <WorkstationLighting gaming={gaming}/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.7,-3]}><planeGeometry args={[32,30]}/><meshStandardMaterial color={gaming?'#121c2d':'#17272c'} roughness={.7}/></mesh>
  <Rounded position={[3.2,1.8,-6.9]} size={[8.3,5,.15]} radius={.6} color={gaming?'#25223b':'#2f4145'} roughness={1}/>
  <Instances items={Array.from({length:21},(_,i)=>({position:[-1+i*.4,1.8,-6.78],scale:[.04,4.5,.04],color:gaming?'#473653':'#455656'}))}/>
  <LightPool position={[3,-1.68,0]} size={9} color={gaming?'#746396':'#d8b883'} opacity={.10}/>
 </group>;}
function WorkstationLighting({gaming}:{gaming:boolean}){return <group>
  <Instances emissive items={[{position:[3,-.48,1.415],scale:[7.15,.015,.015],color:gaming?'#7861b5':'#6d9d96'}]}/>
  <pointLight position={[2.7,.6,.3]} color={gaming?'#8883d1':'#80b8ad'} intensity={gaming?4:3} distance={4}/>
  <pointLight position={[5.9,.4,.7]} color={gaming?'#bf75aa':'#a7bda6'} intensity={gaming?3:2} distance={3}/>
 </group>;}
function Monitor({x,y=.8,z=-.52,width=3.4,height=1.9,game,active=false,preload=false}:{x:number;y?:number;z?:number;width?:number;height?:number;game?:number;active?:boolean;preload?:boolean}){return <group position={[x,y,z]}>
  <Rounded size={[width+.15,height+.15,.16]} radius={.09} color="#080f18" roughness={.48}/>
  <group position={[0,0,.085]}><Display kind={game===undefined?'code':'game'} logo={game===undefined?undefined:gameClips[game].poster} name={game===undefined?'DARSHAN / VALIDATION WORKBENCH':gameClips[game].name} width={width} height={height}/>{game!==undefined&&<group position={[0,0,.002]}><MediaScreen index={game} width={width} height={height} active={active} preload={preload}/></group>}</group>
  <Rounded position={[0,(-.36+y-height/2)/2-y,-.05]} size={[.11,Math.max(.18,y-height/2+.36),.12]} radius={.05} color="#506068"/><Rounded position={[0,-.36-y,.14]} size={[.72,.045,.48]} radius={.025} color="#344751"/>
 </group>;}
function AudioSpeaker({x,y=0,z=-.15,large=false}:{x:number;y?:number;z?:number;large?:boolean}){return <group position={[x,y,z]} scale={large?2.1:1}>
  <Rounded size={[.48,.8,.43]} radius={.10} color="#26363d" roughness={.85}/>
  {[[-.14,.15],[.22,.065]].map(([y,r])=><group key={y} position={[0,y,.223]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[r,r,.035,28]}/><meshStandardMaterial color="#0b121b" roughness={.7}/></mesh><mesh position={[0,0,.021]}><torusGeometry args={[r,.008,6,28]}/><meshStandardMaterial color="#647b7d"/></mesh></group>)}
 </group>;}
function Computer({gaming=false}:{gaming?:boolean}){return <group position={[5.9,.37,-.1]}>
  <Rounded size={[.9,1.65,1.25]} radius={.16} color="#17262e" roughness={.5}/>
  <Rounded position={[0,0,.64]} size={[.71,1.4,.025]} radius={.14} color="#091522"/>
  {[-.43,0,.43].map(y=><group key={y} position={[0,y,.665]}><mesh><torusGeometry args={[.21,.018,7,28]}/><meshBasicMaterial color={gaming?'#9889bd':'#83b1a2'}/></mesh><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.17,.17,.03,20]}/><meshStandardMaterial color="#243944"/></mesh></group>)}
  <mesh position={[.46,0,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[1,1.3]}/><meshStandardMaterial color="#8dbaa8" transparent opacity={.16} metalness={.5} roughness={.2}/></mesh>
 </group>;}
function Desk({gaming=false,active=false,preload=false}:{gaming?:boolean;active?:boolean;preload?:boolean}){const keys=useMemo<Instance[]>(()=>Array.from({length:56},(_,i)=>({position:[1.55+(i%14)*.115,-.337,.5+Math.floor(i/14)*.11],scale:[.09,.025,.075],color:gaming?['#62b9ce','#9173df','#d586b6','#83c8b4'][Math.floor(i/14)]:i%13===0?'#9ab8ab':'#495c64'})),[gaming]);return <group>
  <Rounded position={[3,-.49,.15]} size={[7.6,.2,2.5]} radius={.15} color={gaming?'#2c303d':'#4b4940'} roughness={.7}/><Rounded position={[2.65,-.381,.43]} size={[3.5,.015,1.35]} radius={.3} color="#13242c" roughness={1}/>
  <Instances items={[-.3,6.3].map(x=>({position:[x,-1.1,.15],scale:[.15,1.2,1.8],color:'#2d3e46'}))}/>
  {gaming?<><Monitor x={2.7} y={.97} width={3.45} height={1.94} game={1} active={active} preload={preload}/><Monitor x={5.9} y={2.1} z={-.9} width={2.6} height={1.46} game={0} active={active} preload={preload}/><Monitor {...arcadeLeftScreen} game={2} active={active} preload={preload}/></>:<Monitor x={2.6}/>}
  <Computer gaming={gaming}/><AudioSpeaker x={.1}/><AudioSpeaker x={4.72}/><Instances items={keys} emissive={gaming}/><Rounded position={[2.3,-.365,.65]} size={[1.83,.023,.63]} color={gaming?'#6b5fb9':'#3f7b79'} glow={.7} radius={.1}/>
  <Rounded position={[3.55,-.32,.63]} size={[.25,.12,.37]} radius={.1} color="#788882" roughness={.7}/>
  <group position={[4.15,-.3,.68]} rotation={[-Math.PI/2,0,.3]}><mesh><torusGeometry args={[.26,.037,8,28,Math.PI]}/><meshStandardMaterial color="#909d98" roughness={.55}/></mesh>{[-1,1].map(s=><Rounded key={s} position={[s*.25,-.045,0]} size={[.14,.24,.15]} radius={.065} color="#21323d"/>)}</group>
 </group>;}
function Cupboard({x}:{x:number}){return <group position={[x,.2,-4]}><Rounded size={[2.25,3.8,1.2]} radius={.25} color="#37464a" roughness={.9}/>{[-1,1].map(s=><group key={s}><Rounded position={[s*.54,0,.62]} size={[1.04,3.55,.07]} radius={.1} color="#405357" roughness={.8}/><Rounded position={[s*.13,.1,.71]} size={[.035,.52,.04]} radius={.017} color="#9b9d8b"/></group>)}</group>;}
function Pendant(){return <group position={[3,3.3,2.2]}><mesh position={[0,1.925,0]}><cylinderGeometry args={[.013,.013,3.85,7]}/><meshStandardMaterial color="#79807c"/></mesh><mesh><sphereGeometry args={[.52,32,16,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#293c43" metalness={.3} roughness={.5}/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[0,.005,0]}><circleGeometry args={[.46,32]}/><meshBasicMaterial color="#eac38a"/></mesh></group>;}
export function LabEnvironment(){return <group><Room/>{labCabinets.map(x=><Cupboard key={x} x={x}/>)}<Desk/><Pendant/></group>;}

export function CityEnvironment({active=false}:{active?:boolean}){const terraces=useMemo<Instance[]>(()=>Array.from({length:28},(_,row)=>({position:[3,-1.78+Math.floor(row/10)*.8+row%10*.035,-6+row*.42],scale:[16,.18,.43],color:row%10===0?'#666056':'#282e36'})),[]);return <group>
  <BackWall z={-12.3} color="#19202c" height={12}/>
  {[-10,16].map(x=><mesh key={x} position={[x,3,-1]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[24,12]}/><meshStandardMaterial side={2} color="#202839" roughness={.9}/></mesh>)}
  <mesh position={[3,8.9,-1]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[26,24]}/><meshStandardMaterial color="#151e2c"/></mesh>
  <Instances items={Array.from({length:25},(_,i)=>({position:[-1+i*.65,2.4,-12.1],scale:[.18,7.8,.19],color:i%2?'#302c36':'#3b3038'}))}/>
  <Instances items={terraces}/><AnimatedAudience active={active}/>
  <Rounded position={[3,-1.3,-10]} size={[12,.7,4]} radius={.3} color="#39464a" roughness={.7}/><Rounded position={[3,-.94,-10]} size={[11.8,.035,3.8]} radius={.1} color="#5b5146" roughness={.9}/>
  <group position={[3,1.9,-11.88]}><Rounded size={[9.5,4.1,.2]} radius={.22} color="#526169"/><group position={[0,0,.11]}><Display kind="stage" width={9.1} height={3.8}/></group></group>
  <Speaker/>
  <AudioSpeaker x={-3.1} y={-.1} z={-9.5} large/><AudioSpeaker x={9.1} y={-.1} z={-9.5} large/>
  {[-1,1].map(side=><group key={side} position={[3+side*9,0,-1]}>{[1.2,3.3].map(y=><group key={y}><Rounded position={[0,y,0]} size={[2.3,.3,17]} radius={.14} color="#524a45"/><Rounded position={[-side*1,y+.45,0]} size={[.1,.85,17]} radius={.05} color="#384b52"/><Instances items={Array.from({length:24},(_,i)=>({position:[-side*1,y+.82,-8+i*.7],scale:[.11,.035,.44],color:'#b19468'}))} emissive/></group>)}</group>)}
  <Instances items={[-3,0,3,6,9].map(x=>({position:[x,5.5,-8],scale:[.08,.05,5.8],color:'#d6c39b'}))} emissive/>
  <LightPool position={[3,-.915,-9.4]} size={10} color="#ddc18e" opacity={.23}/>
 </group>;}
export function ArcadeEnvironment({active=false,preload=false}:{active?:boolean;preload?:boolean}){return <group><Room gaming/><Desk gaming active={active} preload={preload}/>
  <group position={[7,1.4,-6.75]}><Display kind="anime" width={4.2} height={2.36}/></group>

  <group position={[3,-.7,2.2]} rotation={[0,Math.PI,0]}><Rounded position={[0,.6,-.4]} size={[1,1.6,.22]} radius={.26} color="#28303e"/><Rounded size={[1,.17,.95]} radius={.15} color="#384050"/><mesh position={[0,-.55,0]}><cylinderGeometry args={[.05,.07,1,12]}/><meshStandardMaterial color="#6b7381"/></mesh></group>
 </group>;}
