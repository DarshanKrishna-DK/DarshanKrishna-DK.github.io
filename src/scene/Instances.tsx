import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMotionTime } from './Motion';
import { BufferGeometry, Float32BufferAttribute, DoubleSide, FrontSide, BoxGeometry, CapsuleGeometry, Color, ConeGeometry, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Object3D, SphereGeometry, type Vector3Tuple } from 'three';
function grassGeometry(){const positions:number[]=[],indices:number[]=[];for(let blade=0;blade<5;blade++){const angle=blade*2.4,start=positions.length/3;for(let j=0;j<=5;j++){const t=j/5,bend=t*t*.32,width=.045*(1-t)+.002;for(const side of [-1,1]){const x=bend+side*width,z=blade*.018;positions.push(Math.cos(angle)*x-Math.sin(angle)*z,t*(.7+blade*.07),Math.sin(angle)*x+Math.cos(angle)*z);}}for(let j=0;j<5;j++){const n=start+j*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;}
function foliageGeometry(){const g=new SphereGeometry(1,16,12),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const r=1+Math.sin(x*11+y*4)*Math.cos(z*13-x*3)*.13+Math.sin(y*19+z*7)*.055;p.setXYZ(i,x*r,y*r,z*r);}g.computeVertexNormals();return g;}
export type Instance={position:Vector3Tuple;scale:Vector3Tuple;rotation?:Vector3Tuple;color?:string};
export function Instances({items,shape='box',color='#243536',roughness=.9,emissive=false,motion,gesture}:{items:Instance[];shape?:'box'|'sphere'|'trunk'|'cone'|'rock'|'person'|'foliage'|'head'|'grass';color?:string;roughness?:number;emissive?:boolean;gesture?:{value:number};motion?:'body'|'head'|'arm'}){
  const time=useMotionTime(),clockUniform=useMemo(()=>({value:0}),[]);useFrame(({clock})=>{if(motion)clockUniform.value=time(clock);});
  const ref=useRef<InstancedMesh>(null);const geometry=useMemo(()=>shape==='grass'?grassGeometry():shape==='head'?new SphereGeometry(1,24,16):shape==='sphere'?new SphereGeometry(1,8,6):shape==='trunk'?new CylinderGeometry(.7,1,1,7):shape==='cone'?new ConeGeometry(1,1,8):shape==='foliage'?foliageGeometry():shape==='rock'?new IcosahedronGeometry(1,1):shape==='person'?new CapsuleGeometry(.5,1,1,5):new BoxGeometry(1,1,1),[shape]);
  useEffect(()=>{if(!ref.current)return;const o=new Object3D(),c=new Color();items.forEach((v,i)=>{o.position.set(...v.position);o.scale.set(...v.scale);o.rotation.set(...(v.rotation??[0,0,0]));o.updateMatrix();ref.current!.setMatrixAt(i,o.matrix);ref.current!.setColorAt(i,c.set(v.color??color));});ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;ref.current.computeBoundingSphere();},[items,color]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <instancedMesh ref={ref} args={[geometry,undefined,items.length]}>{emissive?<meshBasicMaterial toneMapped={false} color="white"/>:<meshStandardMaterial side={shape==='grass'?DoubleSide:FrontSide} color="white" roughness={roughness} metalness={.05} customProgramCacheKey={()=>motion??'static'} onBeforeCompile={shader=>{if(!motion)return;shader.uniforms.crowdTime=clockUniform;shader.uniforms.crowdGesture=gesture??{value:1};shader.vertexShader='uniform float crowdTime;uniform float crowdGesture;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    float phase=instanceMatrix[3].x*11.7+instanceMatrix[3].z*7.3;
    float pace=1.1+fract(sin(phase)*437.5)*2.5;
    float action=sin(crowdTime*(pace+crowdGesture*8.)+phase);
    action *= ${motion==='arm'?'(.045+.955*crowdGesture)':'1.'};
    transformed.x += action*${motion==='arm'?'0.62':motion==='head'?'0.15':'0.09'};
    transformed.y += sin(crowdTime*pace*.7+phase)*${motion==='arm'?'0.34*(.045+.955*crowdGesture)':'0.04'};
    `);}}/>}</instancedMesh>;
}
