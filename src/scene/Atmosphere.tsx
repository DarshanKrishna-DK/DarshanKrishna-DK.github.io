import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color, Fog, Group, Mesh, ShaderMaterial } from 'three';
import { Moon } from './Moon';
const palettes=[['#030208','#030208'],['#06131c','#152c34'],['#0a111f','#1e293a'],['#081521','#24363d'],['#344957','#6d827c'],['#0b1020','#272239'],['#040b18','#182836'],['#030a11','#111f25'],['#4f6671','#a5aaa0']];
export function Atmosphere({active,beat,reduced,passage=0}:{active:number;beat:number;reduced:boolean;passage?:number}){
 const ref=useRef<ShaderMaterial>(null),sky=useRef<Mesh>(null),moon=useRef<Group>(null),{scene}=useThree();const id=active===4?(beat===1?7:beat===2?8:4):active;
 const uniforms=useMemo(()=>({top:{value:new Color(palettes[0][0])},horizon:{value:new Color(palettes[0][1])}}),[]);const target=useMemo(()=>{const dark=new Color('#02050b');return {top:new Color(palettes[id][0]).lerp(dark,passage),horizon:new Color(palettes[id][1]).lerp(dark,passage)};},[id,passage]);

 useEffect(()=>{scene.fog=new Fog('#030208',22,70);return()=>{scene.fog=null;};},[scene]);
 useFrame(({camera},delta)=>{const u=ref.current?.uniforms;if(!u)return;const a=reduced?1:Math.min(1,delta*3);u.top.value.lerp(target.top,a);u.horizon.value.lerp(target.horizon,a);sky.current?.position.copy(camera.position);moon.current?.position.set(camera.position.x+1,camera.position.y+3,camera.position.z-34);moon.current?.quaternion.copy(camera.quaternion);if(scene.fog instanceof Fog){scene.fog.color.lerp(target.horizon,a);scene.fog.near=active===4?18:22;scene.fog.far=active===4?62:70;}});
 return <><mesh ref={sky} renderOrder={-100}><sphereGeometry args={[100,16,12]}/><shaderMaterial ref={ref} side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader={'varying vec3 v;void main(){vec4 w=modelMatrix*vec4(position,1.);v=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}'} fragmentShader={'varying vec3 v;uniform vec3 top;uniform vec3 horizon;void main(){vec3 d=normalize(v-cameraPosition);vec3 c=mix(horizon,top,smoothstep(-.12,.7,d.y));gl_FragColor=vec4(c,1.);\n#include <colorspace_fragment>\n}'}/></mesh><group ref={moon} visible={active===6||(active===4&&beat===1)}><Moon rays={active===6}/></group></>;
}
export function DirectRender(){useFrame(({gl,scene,camera})=>gl.render(scene,camera),1);return null;}
