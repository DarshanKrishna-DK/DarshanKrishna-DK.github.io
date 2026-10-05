import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial } from 'three';
import { useMotionTime } from './Motion';

export function Embers(){
  const time=useMotionTime(),material=useRef<ShaderMaterial>(null);
  const geometry=useMemo(()=>{const g=new BufferGeometry(),p:number[]=[],seeds:number[]=[];for(let i=0;i<64;i++){p.push(0,0,0);seeds.push(i*.61803398875%1);}g.setAttribute('position',new Float32BufferAttribute(p,3));g.setAttribute('seed',new Float32BufferAttribute(seeds,1));return g;},[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);useFrame(({clock})=>{if(material.current)material.current.uniforms.time.value=time(clock);});
  return <points geometry={geometry} position={[2.2,-.95,0]} frustumCulled={false}><shaderMaterial ref={material} transparent depthWrite={false} blending={AdditiveBlending} uniforms={{time:{value:0}}} vertexShader={`
    attribute float seed;uniform float time;varying float fade;
    void main(){float age=fract(seed+time*(.12+seed*.09));float a=seed*67.;
    vec3 p=vec3(sin(a+age*5.)*(.13+age*.5)+age*.33,age*2.9,cos(a+age*4.)*(.12+age*.35));
    fade=sin(age*3.14159)*(1.-age);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.6+seed)*28./-mv.z,1.,6.);}
  `} fragmentShader={`varying float fade;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(1.,.57,.18,pow(1.-r,1.5)*fade*.95);}`}/></points>;
}
