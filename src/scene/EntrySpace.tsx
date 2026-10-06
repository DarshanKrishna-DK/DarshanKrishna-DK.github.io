import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, AdditiveBlending, BackSide, BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Group, Mesh, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, Vector3 } from 'three';
import { satelliteOrbit } from '../lib/orbit';
import { FrameClock } from './FrameClock';
import { StudioEnvironment } from './Materials';

const sun=new Vector3(-.55,.72,.82).normalize();
const earthTextures=['/assets/space/earth-surface.jpg','/assets/space/earth-normal.jpg','/assets/space/earth-ocean.jpg','/assets/space/earth-clouds.png','/assets/space/earth-lights.png'];
const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;

function Earth({reduced}:{reduced:boolean}){
  const body=useRef<Group>(null),clouds=useRef<Mesh>(null);
  const [day,normal,ocean,cloud,night]=useLoader(TextureLoader,earthTextures);
  useEffect(()=>()=>{[day,normal,ocean,cloud,night].forEach(texture=>texture.dispose());useLoader.clear(TextureLoader,earthTextures);},[day,normal,ocean,cloud,night]);
  const gl=useThree(s=>s.gl);
  useMemo(()=>{day.colorSpace=night.colorSpace=SRGBColorSpace;[day,normal,ocean,cloud,night].forEach(t=>{t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());t.needsUpdate=true;});},[day,normal,ocean,cloud,night,gl]);
  const nightUniforms=useMemo(()=>({cityMap:{value:night},sun:{value:sun}}),[night]);
  const airUniforms=useMemo(()=>({sun:{value:sun},tint:{value:new Color('#479bdb')}}),[]);
  useFrame((_,delta)=>{if(!reduced&&body.current){body.current.rotation.y+=Math.min(delta,.05)*.012;if(clouds.current)clouds.current.rotation.y+=Math.min(delta,.05)*.006;}});
  return <>
    <group ref={body} rotation={[.13,3.1,.20]}>
      <mesh><sphereGeometry args={[6.2,112,80]}/><meshPhongMaterial map={day} normalMap={normal} normalScale={new Vector2(.16,.16)} specularMap={ocean} specular="#29414f" shininess={65}/></mesh>
      <mesh><sphereGeometry args={[6.205,96,64]}/><shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={nightUniforms} vertexShader={vertex} fragmentShader={`uniform sampler2D cityMap;uniform vec3 sun;varying vec2 vUv;varying vec3 vNormal;void main(){float dark=1.-smoothstep(-.2,.12,dot(normalize(vNormal),sun));vec3 city=texture2D(cityMap,vUv).rgb;gl_FragColor=vec4(city*vec3(1.1,.75,.4)*dark, dark*.8);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')}/></mesh>
      <mesh ref={clouds}><sphereGeometry args={[6.235,96,64]}/><meshPhongMaterial map={cloud} transparent opacity={.88} depthWrite={false} shininess={2}/></mesh>
    </group>
    <mesh><sphereGeometry args={[6.285,96,64]}/><shaderMaterial transparent side={BackSide} depthWrite={false} blending={AdditiveBlending} uniforms={airUniforms} vertexShader={vertex} fragmentShader={`uniform vec3 sun;uniform vec3 tint;varying vec3 vNormal;varying vec3 vWorld;void main(){vec3 n=normalize(vNormal);vec3 view=normalize(cameraPosition-vWorld);float rim=pow(max(0.,1.+dot(n,view)),7.);float daylight=smoothstep(-.3,.8,dot(n,sun));gl_FragColor=vec4(tint*(.3+daylight*.7),rim*.62);\n#include <colorspace_fragment>}`}/></mesh>
  </>;
}

function Satellite({reduced}:{reduced:boolean}){
  const group=useRef<Group>(null),elapsed=useRef(0),target=useRef(new Vector3());
  useFrame((_,delta)=>{if(!group.current)return;if(!reduced)elapsed.current+=Math.min(delta,.05);group.current.position.set(...satelliteOrbit(elapsed.current));target.current.copy(group.current.position).multiplyScalar(2);group.current.lookAt(target.current);group.current.rotateZ(.24);});
  const dish=useMemo(()=>[new Vector2(0,0),new Vector2(.09,.01),new Vector2(.2,.05),new Vector2(.31,.13),new Vector2(.38,.21)],[]);
  return <group ref={group} scale={.58}>
    <mesh><boxGeometry args={[.65,.78,.65]}/><meshStandardMaterial color="#bda675" metalness={.72} roughness={.35}/></mesh>
    <mesh position={[0,.1,.35]}><boxGeometry args={[.48,.52,.08]}/><meshStandardMaterial color="#d8dbd6" metalness={.7} roughness={.27}/></mesh>
    <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.025,.025,3.8,8]}/><meshStandardMaterial color="#b8c4cd" metalness={.9} roughness={.25}/></mesh>
    {[-1,1].map(side=><group key={side} position={[side*1.28,0,0]} rotation={[0,side*.13,0]}>
      <mesh><boxGeometry args={[1.42,.86,.045]}/><meshStandardMaterial color="#939eaa" metalness={.8} roughness={.3}/></mesh>
      {Array.from({length:24},(_,i)=><mesh key={i} position={[-.585+i%6*.234,-.303+Math.floor(i/6)*.202,.029]}><planeGeometry args={[.218,.185]}/><meshPhysicalMaterial color={i%5===0?'#253c60':'#102946'} metalness={.58} roughness={.3} clearcoat={.7} clearcoatRoughness={.2} side={DoubleSide}/></mesh>)}
    </group>)}
    <mesh position={[0,.43,0]} rotation={[.4,0,.2]}><latheGeometry args={[dish,32]}/><meshStandardMaterial color="#d8dbd8" metalness={.8} roughness={.31} side={DoubleSide}/></mesh>
    <mesh position={[0,.76,.13]} rotation={[.4,0,.2]}><cylinderGeometry args={[.012,.012,.57,8]}/><meshStandardMaterial color="#99a7b2" metalness={.7}/></mesh>
    <mesh position={[.34,-.43,.1]}><cylinderGeometry args={[.012,.012,.67,8]}/><meshStandardMaterial color="#b5c0c5"/></mesh>
    {[-1,1].map(s=><mesh key={s} position={[s*.33,0,.1]}><boxGeometry args={[.018,.74,.045]}/><meshStandardMaterial color="#6b685e" metalness={.8}/></mesh>)}
  </group>;
}

function StarField(){
  const geometry=useMemo(()=>{const positions=[],sizes=[],colors=[];for(let i=0;i<680;i++){positions.push(Math.sin(i*127.1+3)*52,Math.cos(i*91.7)*33,-34-Math.abs(Math.sin(i*47.3))*20);sizes.push(i%41===0?2.3:i%9===0?1.35:.65);const tint=new Color(i%7===0?'#efd2ac':i%5===0?'#9ebfdf':'#d4dce4');colors.push(tint.r,tint.g,tint.b);}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('starSize',new Float32BufferAttribute(sizes,1));g.setAttribute('color',new Float32BufferAttribute(colors,3));return g;},[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <points geometry={geometry}><shaderMaterial transparent depthWrite={false} vertexColors vertexShader={'attribute float starSize;varying vec3 tint;void main(){tint=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*1.4;}'} fragmentShader={'varying vec3 tint;void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*18.)*.72;gl_FragColor=vec4(tint,a);\n#include <colorspace_fragment>\n}'}/></points>;
}

function Meteor({index,reduced}:{index:number;reduced:boolean}){
  const mesh=useRef<Mesh>(null),mat=useRef<ShaderMaterial>(null),elapsed=useRef(0);const uniforms=useMemo(()=>({alpha:{value:0}}),[]);
  useFrame((_,delta)=>{if(!mesh.current||!mat.current)return;elapsed.current+=Math.min(delta,.05);const time=(elapsed.current+index*.46+8)%19,phase=time/.8;mesh.current.visible=!reduced&&phase<1;if(phase>=1||reduced)return;mesh.current.position.set(3+phase*7-index*1.3,5-phase*3.5+index*.6,-8);mat.current.uniforms.alpha.value=Math.sin(phase*Math.PI)*.65;});
  return <mesh ref={mesh} rotation={[0,0,-.46]} visible={false}><planeGeometry args={[1.8,.028]}/><shaderMaterial ref={mat} transparent depthWrite={false} blending={AdditiveBlending} uniforms={uniforms} vertexShader={'varying vec2 uvv;void main(){uvv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 uvv;uniform float alpha;void main(){float tail=pow(uvv.x,3.);float core=pow(1.-abs(uvv.y-.5)*2.,1.8);gl_FragColor=vec4(.71,.83,1.,tail*core*alpha);}'}/></mesh>;
}

function OrbitalScene({reduced,onReady,onFailure}:{reduced:boolean;onReady:()=>void;onFailure:()=>void}){
  const {size,gl}=useThree(),ready=useRef(false);const portrait=size.width/size.height<.9;
  useFrame(()=>{if(!ready.current){ready.current=true;onReady();}});
  useEffect(()=>{const lost=(event:Event)=>{event.preventDefault();onFailure();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onFailure]);
  return <>
    <color attach="background" args={['#02050b']}/><ambientLight intensity={.025}/>
    <directionalLight position={[-9,12,14]} color="#f6f5eb" intensity={1.75}/><StudioEnvironment intensity={.12}/>
    <StarField/><Meteor index={0} reduced={reduced}/><Meteor index={1} reduced={reduced}/>
    <group position={[portrait?2.8:4.5,portrait?-5.7:-5.1,-6]}><Earth reduced={reduced}/><Satellite reduced={reduced}/></group>
    <FrameClock reduced={reduced} fps={40}/>
  </>;
}

export default function EntrySpace({reduced,onReady,onFailure}:{reduced:boolean;onReady:()=>void;onFailure:()=>void}){return <Canvas className="entry-space-canvas" frameloop="demand" camera={{position:[0,0,12],fov:40,near:.1,far:100}} dpr={[1,1.35]} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:ACESFilmicToneMapping}} onCreated={({gl})=>{gl.toneMappingExposure=1.05;}}><Suspense fallback={null}><OrbitalScene reduced={reduced} onReady={onReady} onFailure={onFailure}/></Suspense></Canvas>}
