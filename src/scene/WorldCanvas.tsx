import { Component, memo, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, BufferGeometry, Float32BufferAttribute, Group, Vector3 } from 'three';
import { WORLD_Z } from '../lib/routeLayout';
import { sampleCameraJourney, sampleJourney } from '../lib/journey';
import { SpawnEnvironment, LabEnvironment, ProjectEnvironment, CityEnvironment, RoadEnvironment, ArcadeEnvironment, CampfireEnvironment, TransitionObjects } from './Environments';
import { FrameClock } from './FrameClock';
import { Atmosphere, DirectRender } from './Atmosphere';
import { Spotlight, StudioEnvironment } from './Materials';
import { JourneyRoute } from './JourneyRoute';
import { SceneMotion } from './Motion';
import { RenderTelemetry } from './RenderTelemetry';

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CameraRig({ progress, reduced }: { progress:number; reduced:boolean }) {
  const { camera, gl, size, invalidate } = useThree();
  useEffect(()=>{invalidate();},[progress,reduced,size.width,size.height,invalidate]);
  const desired=useRef(new Vector3()); const look=useRef(new Vector3(0,.7,0));const target=useRef(new Vector3());
  useEffect(()=>{ const lost=(e:Event)=>{ e.preventDefault(); window.dispatchEvent(new Event('world-context-lost')); }; gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl]);
  useFrame((_,delta)=>{
    const sample=sampleCameraJourney(progress,reduced,size.width/size.height<.9);
    desired.current.set(...sample.camera); target.current.set(...sample.target);
    if(reduced){camera.position.copy(desired.current);look.current.copy(target.current);}else{camera.position.lerp(desired.current,Math.min(delta*7,1));look.current.lerp(target.current,Math.min(delta*7,1));}
    camera.lookAt(look.current);camera.updateMatrixWorld();
  },-10);
  return null;
}
function Stars() {
  const group=useRef<Group>(null);useFrame(({camera})=>group.current?.position.copy(camera.position));
  const geometry=useMemo(()=>{const positions=[];for(let i=0;i<1100;i++){positions.push(Math.sin(i*91.37)*65,4+((i*37)%290)/7,-15-((i*17)%70));}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));return g;},[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group ref={group}><points geometry={geometry}><pointsMaterial color="#d4c9ae" size={0.10} transparent opacity={0.78} sizeAttenuation fog={false}/></points></group>;
}
// A fixed light budget avoids new shader permutations each time a world enters view.
function JourneyLighting({progress,active,beat,reduced}:{progress:number;active:number;beat:number;reduced:boolean}){
  const group=useRef<Group>(null);useFrame((_,delta)=>{if(group.current){const z=WORLD_Z[reduced?active:Math.min(6,Math.floor(progress*6+.35))];group.current.position.z=reduced?z:group.current.position.z+(z-group.current.position.z)*Math.min(1,delta*4);}});
  const night=active===4&&beat===1;const nature=active===4;const warm=active===6;
  return <group ref={group}>
    <Spotlight position={active===1?[3,3.6,2.8]:active===3?[6,6,-5]:[5,8,4]} target={active===1?[2.6,.15,.35]:active===3?[3.7,0,-9]:[2,0,-1]} color={active===0?'#c79afa':active===1?'#edc997':warm?'#ffd1a3':active===5?'#c9bbef':'#c1e9e2'} intensity={night?4:active===3?220:active===1?100:active===5?34:active===2?8:65} angle={.75}/>
    <Spotlight position={active===3?[-2,5,-6]:[-5,5,-3]} target={active===3?[3,1,-10]:[2,1,0]} color={active===0?'#9d6add':'#8ecdd6'} intensity={night?2:nature?12:active===3?150:active===5?3:active===2?2:active===1?6:20} angle={.8}/>
    <Spotlight position={[1.4,-.65,4]} target={[1.4,-1.4,-10]} color="#dceacb" intensity={night?80:0} angle={.30}/>
    <pointLight position={[2,0,0]} color={active===6?'#ffb766':active===0?'#a66ceb':'#89ced4'} intensity={active===6?12:active===0?18:0} distance={14} decay={2}/>
  </group>;
}
function Scene({progress,reduced,roadBeat,project,onProject,onReady,paused}:{progress:number;reduced:boolean;roadBeat:number;project:number;onProject:(index:number)=>void;onReady:()=>void;paused:boolean}) {
  const active=sampleJourney(progress).index;
  const visibleWorlds=[0,1,2,3,4,5,6].filter(i=>i<progress*6+.90&&i>progress*6-.92);
  // Preserve shader light counts as rooms enter/leave. Zero-range padding lights
  // avoid recompiling every standard material at each architectural boundary.
  const spots=3+(visibleWorlds.includes(2)?6:0)+(visibleWorlds.includes(3)?1:0);
  const points=1+(visibleWorlds.includes(1)?2:0)+(visibleWorlds.includes(5)?2:0);
  const signalled=useRef(false);
  useFrame(()=>{if(!signalled.current){signalled.current=true;onReady();}},3);
  return <SceneMotion.Provider value={reduced}>
    <Atmosphere active={active} beat={roadBeat} reduced={reduced}/><DirectRender/><RenderTelemetry/>
    <StudioEnvironment intensity={active===0||active===4||active===6?0:active===5?.10:active===2?.06:.22}/><JourneyRoute progress={progress}/>
    <ambientLight intensity={active===4&&roadBeat===1?.16:active===6?.32:active===4?.6:active===0?.06:active===5?.16:active===1?.25:active===2?.10:.52} /><directionalLight position={[3,7,4]} intensity={active===4&&roadBeat===1?.18:active===4||active===6?.8:active===0?0:active===5?.10:active===2?.05:active===1?.18:.5} color="#d6e4e0" />
    {Array.from({length:10-spots},(_,i)=><spotLight key={'pad-s'+i} position={[0,1000,0]} intensity={0} distance={.01}/>)}
    {Array.from({length:4-points},(_,i)=><pointLight key={'pad-p'+i} position={[0,1000,0]} intensity={0} distance={.01}/>)}
    <JourneyLighting progress={progress} active={active} beat={roadBeat} reduced={reduced}/>
    <FrameClock reduced={reduced||paused}/><CameraRig progress={progress} reduced={reduced} />{(active===0||active===6||(active===4&&roadBeat===1))&&<Stars/>}
    {visibleWorlds.map(i=><group key={i} position={[0,0,WORLD_Z[i]]}>
      {i===0?<SpawnEnvironment />:i===1?<LabEnvironment />:i===2?<ProjectEnvironment onProject={onProject} selected={project}/>:i===3?<CityEnvironment active={active===3}/>:i===4?<RoadEnvironment beat={roadBeat}/>:i===5?<ArcadeEnvironment active={active===5&&!paused} preload={!paused&&progress*6>=4.12&&progress*6<5.85}/>:<CampfireEnvironment />}
      {i<6&&<group visible={progress*6>i+.16&&progress*6<i+.94}><TransitionObjects from={i}/></group>}
    </group>)}
  </SceneMotion.Provider>;
}
function WorldCanvas(props:{progress:number;reduced:boolean;roadBeat:number;project:number;onProject:(index:number)=>void;onReady:()=>void;onFailure:()=>void;paused:boolean}) {
  return <SceneBoundary onFailure={props.onFailure}><Canvas className="world-canvas" frameloop="demand" camera={{position:[0,2,8],fov:52,near:0.1,far:330}} dpr={[.8,1]} gl={{antialias:true,powerPreference:'high-performance',toneMapping:ACESFilmicToneMapping}} fallback={<span /> } onCreated={({gl})=>{gl.setClearColor('#0b1722');gl.toneMappingExposure=1;}}>
    <Scene {...props}/>
  </Canvas></SceneBoundary>;
}
export default memo(WorldCanvas);
