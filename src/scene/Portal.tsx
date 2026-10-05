import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, ShaderMaterial } from 'three';
import { useMotionTime } from './Motion';
export function SpawnEnvironment(){const material=useRef<ShaderMaterial>(null),dust=useRef<Group>(null),time=useMotionTime();const geometry=useMemo(()=>{const g=new BufferGeometry(),p=[];for(let i=0;i<320;i++){const a=i*2.399,r=2.7+(i%47)/46;p.push(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*3)*.34);}g.setAttribute('position',new Float32BufferAttribute(p,3));return g;},[]);useEffect(()=>()=>geometry.dispose(),[geometry]);useFrame(({clock})=>{const t=time(clock);if(material.current)material.current.uniforms.time.value=t;if(dust.current)dust.current.rotation.z=-t*.055;});return <group>
  <group position={[3,1.65,-4]} scale={.9}>
    <mesh position={[0,0,-.015]}><ringGeometry args={[2.74,40,128]}/><meshBasicMaterial color="#030208" fog={false}/></mesh>
    <mesh><circleGeometry args={[2.74,96]}/><meshBasicMaterial color="#080216" fog={false}/></mesh>
    <mesh position={[0,0,.025]}><planeGeometry args={[9.2,9.2]}/><shaderMaterial ref={material} transparent depthWrite={false} depthTest={false} uniforms={{time:{value:0}}} vertexShader={'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={`varying vec2 uv0;uniform float time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
      void main(){vec2 p=(uv0-.5)*2.;float r=length(p),a=atan(p.y,p.x);float ring=exp(-pow((r-.61)*23.,2.));float smoke=noise(vec2(cos(a*4.+time*.2),sin(a*4.+time*.2))*3.+vec2(r*24.-time*.35,r*16.));float spiral=pow(.5+.5*sin(a*8.+r*45.-time*.7+smoke*3.),3.);float inner=smoothstep(.43,.59,r);float halo=exp(-pow((r-.61)*8.,2.));float wisps=spiral*halo*inner;vec3 c=vec3(.25,.05,.55)*halo*.45+vec3(.65,.35,1.)*(ring*.8+wisps*.5);float alpha=clamp(halo*.65+ring+wisps*.5,0.,1.);gl_FragColor=vec4(c,alpha);}`}/></mesh>
    <group ref={dust}><points geometry={geometry}><pointsMaterial color="#d2a6ff" size={.032} transparent opacity={.7} blending={AdditiveBlending} depthWrite={false}/></points></group>
  </group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[3,-1.69,-2]}><planeGeometry args={[16,18]}/><shaderMaterial transparent depthWrite={false} vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 v;void main(){float a=pow(max(0.,1.-length((v-.5)*2.)),3.)*.15;gl_FragColor=vec4(.40,.12,.72,a);}'}/></mesh>
 </group>;}
