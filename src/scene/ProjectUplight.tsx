import { useMemo } from 'react';
import { AdditiveBlending, Color, DoubleSide, Quaternion, Vector3 } from 'three';
import { Spotlight } from './Materials';

export function ProjectUplight({side,color}:{side:number;color:string}){
  const source=useMemo(()=>new Vector3(side*1.4,-1.075,1.08),[side]);
  const target=useMemo(()=>new Vector3(side*.32,1.30,.14),[side]);
  const direction=useMemo(()=>target.clone().sub(source),[target,source]);
  const rotation=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,1,0),direction.clone().normalize()),[direction]);
  const uniforms=useMemo(()=>({tint:{value:new Color(color)}}),[color]);
  return <>
    <group position={source} quaternion={rotation}>
      <mesh position={[0,-.14,0]}><cylinderGeometry args={[.135,.18,.28,32]}/><meshStandardMaterial color="#26333e" metalness={.7} roughness={.25}/></mesh>
      <mesh><cylinderGeometry args={[.105,.105,.015,32]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
      <mesh position={[0,direction.length()/2,0]}><cylinderGeometry args={[.65,.065,direction.length(),48,1,true]}/><shaderMaterial uniforms={uniforms} transparent depthWrite={false} side={DoubleSide} blending={AdditiveBlending} vertexShader={'varying vec3 n;varying vec3 view;varying vec2 v;void main(){v=uv;vec4 p=modelViewMatrix*vec4(position,1.);view=-p.xyz;n=normalMatrix*normal;gl_Position=projectionMatrix*p;}'} fragmentShader={'uniform vec3 tint;varying vec3 n;varying vec3 view;varying vec2 v;void main(){float soft=pow(abs(dot(normalize(n),normalize(view))),2.5);float along=smoothstep(0.,.04,v.y)*(1.-smoothstep(.42,1.,v.y));gl_FragColor=vec4(tint,soft*along*.085);}'}/></mesh>
    </group>
    <Spotlight position={source.toArray()} target={target.toArray()} color={color} intensity={120} angle={.46}/>
  </>;
}
