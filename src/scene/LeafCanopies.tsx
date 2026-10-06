import { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, CanvasTexture, Color, DoubleSide, Float32BufferAttribute, InstancedMesh, Object3D, SRGBColorSpace } from 'three';
import type { Instance } from './Instances';

/** Crossed leaf sprays give open, irregular crowns without hundreds of solid spheres. */
export function LeafCanopies({items}:{items:Instance[]}){
  const mesh=useRef<InstancedMesh>(null);
  const map=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;
    for(let i=0;i<240;i++){const a=i*2.399,r=Math.sqrt((i%67)/67)*112,x=128+Math.cos(a)*r,y=128+Math.sin(a)*r*.89;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=['#d1d9be','#a5b688','#f1ebca','#b6c498'][i%4];ctx.beginPath();ctx.ellipse(0,0,6+i%5,2.5+i%3,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;t.anisotropy=4;return t;
  },[]);
  const geometry=useMemo(()=>{const positions:number[]=[],uvs:number[]=[];
    for(let j=0;j<4;j++){const a=j*Math.PI/4;for(const [x,y,u,v] of [[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,-1,0,0],[1,1,1,1],[-1,1,0,1]]){positions.push(Math.cos(a)*x,y,Math.sin(a)*x);uvs.push(u,v);}}
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uvs,2));g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>{if(!mesh.current)return;const o=new Object3D(),color=new Color();items.forEach((item,i)=>{o.position.set(...item.position);o.scale.set(item.scale[0]*1.35,item.scale[1]*1.9,item.scale[2]*1.35);o.rotation.set(...item.rotation!);o.updateMatrix();mesh.current!.setMatrixAt(i,o.matrix);mesh.current!.setColorAt(i,color.set(item.color!));});mesh.current.instanceMatrix.needsUpdate=true;if(mesh.current.instanceColor)mesh.current.instanceColor.needsUpdate=true;mesh.current.computeBoundingSphere();},[items]);
  useEffect(()=>()=>{geometry.dispose();map.dispose();},[geometry,map]);
  return <instancedMesh ref={mesh} args={[geometry,undefined,items.length]}><meshStandardMaterial map={map} alphaTest={.42} side={DoubleSide} roughness={1} color="#d9decb"/></instancedMesh>;
}
