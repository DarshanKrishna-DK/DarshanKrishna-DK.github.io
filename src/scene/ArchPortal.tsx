import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, FrontSide, ShaderMaterial, Shape, ShapeGeometry } from 'three';
import { ARCH } from '../lib/routeLayout';
import { useMotionTime } from './Motion';

export function createArchVeilGeometry(){
  const a=ARCH,s=new Shape();s.moveTo(a.left,a.base);s.lineTo(a.right,a.base);s.lineTo(a.right,a.spring);s.absarc(a.center,a.spring,a.radius,0,Math.PI,false);s.closePath();return new ShapeGeometry(s,48);
}
// Opaque and front-facing: the passage is hidden until the camera crosses it.
// No back surface, crossbar, or decorative geometry sits in the walking path.
export function ArchPortal({z,color='#9589d0'}:{z:number;color?:string}){
  const a=ARCH,material=useRef<ShaderMaterial>(null),time=useMotionTime();
  const geometry=useMemo(createArchVeilGeometry,[]),uniforms=useMemo(()=>({time:{value:0},tint:{value:new Color(color)}}),[color]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);useFrame(({clock})=>{if(material.current)material.current.uniforms.time.value=time(clock);});
  return <group position={[0,0,z]}>
    <mesh geometry={geometry}><shaderMaterial ref={material} side={FrontSide} depthWrite uniforms={uniforms} vertexShader={'varying vec2 p;void main(){p=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={`varying vec2 p;uniform float time;uniform vec3 tint;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
      void main(){vec2 q=vec2((p.x+3.225)/2.075,(p.y+1.73)/5.655);float n=noise(vec2(q.x*3.+sin(q.y*5.-time*.3),q.y*6.-time*.24));float w=noise(q*9.+vec2(n,time*-.17));float rim=pow(abs(q.x),6.)*.3;float silk=pow(.5+.5*sin(q.x*9.+n*6.+time*.24),9.)*.10;vec3 c=vec3(.007,.006,.018)+tint*(.035+n*.10+w*.045+silk+rim);gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`}/></mesh>
    <mesh position={[a.center,a.spring,0]}><torusGeometry args={[a.radius+.15,.14,12,64,Math.PI]}/><meshStandardMaterial color="#28313d" metalness={.65} roughness={.32}/></mesh>
    <mesh position={[a.center,a.spring,.1]}><torusGeometry args={[a.radius+.015,.012,6,64,Math.PI]}/><meshBasicMaterial color={color}/></mesh>
    {[-1,1].map(side=><group key={side} position={[a.center+side*(a.radius+.15),(a.spring+a.base)/2,0]}><mesh><cylinderGeometry args={[.14,.14,a.spring-a.base,12]}/><meshStandardMaterial color="#28313d" metalness={.65} roughness={.32}/></mesh><mesh position={[-side*.135,0,.1]}><cylinderGeometry args={[.012,.012,a.spring-a.base,6]}/><meshBasicMaterial color={color}/></mesh></group>)}
  </group>;
}
