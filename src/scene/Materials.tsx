import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, Object3D, PMREMGenerator, type Vector3Tuple } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function Rounded({position=[0,0,0],size=[1,1,1],color='#19282e',radius=.09,metal=.45,roughness=.3,glow=0,rotation=[0,0,0]}:{position?:Vector3Tuple;size?:Vector3Tuple;color?:string;radius?:number;metal?:number;roughness?:number;glow?:number;rotation?:Vector3Tuple}){
  const geometry=useMemo(()=>new RoundedBoxGeometry(...size,3,Math.min(radius,...size.map(n=>n/2))),[size[0],size[1],size[2],radius]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh position={position} geometry={geometry} rotation={rotation}><meshStandardMaterial color={color} metalness={metal*.45} roughness={Math.max(.4,roughness)} emissive={color} emissiveIntensity={glow}/></mesh>;
}
export function StudioEnvironment({intensity=.6}:{intensity?:number}){const {gl,scene}=useThree();useEffect(()=>{const room=new RoomEnvironment();const pmrem=new PMREMGenerator(gl);const map=pmrem.fromScene(room,.04,.1,100,{size:64});const previous=scene.environment;scene.environment=map.texture;room.dispose();pmrem.dispose();return()=>{scene.environment=previous;map.dispose();};},[gl,scene]);useEffect(()=>{scene.environmentIntensity=intensity;},[scene,intensity]);return null;}
export function Spotlight({position,target,color='#edc89b',intensity=70,angle=.5}:{position:Vector3Tuple;target:Vector3Tuple;color?:string;intensity?:number;angle?:number}){
  const object=useMemo(()=>{const o=new Object3D();o.position.set(...target);return o;},[target[0],target[1],target[2]]);
  return <><primitive object={object}/><spotLight position={position} target={object} color={color} intensity={intensity} angle={angle} penumbra={.85} distance={35} decay={2}/></>;
}
export function LightPool({position=[0,-1.48,0],color='#7ee0d2',size=5,opacity=.22}:{position?:Vector3Tuple;color?:string;size?:number;opacity?:number}){
  const uniforms=useMemo(()=>({tint:{value:new Color(color)},alpha:{value:opacity}}),[color,opacity]);
  return <mesh position={position} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[size,size]}/><shaderMaterial transparent depthWrite={false} uniforms={uniforms} vertexShader={'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'} fragmentShader={'varying vec2 vUv;uniform vec3 tint;uniform float alpha;void main(){float d=length(vUv-.5)*2.;gl_FragColor=vec4(tint,pow(max(0.,1.-d),2.)*alpha);}'}/></mesh>;
}
