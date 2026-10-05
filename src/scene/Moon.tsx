import { useEffect, useMemo } from 'react';
import { AdditiveBlending, CanvasTexture, SRGBColorSpace } from 'three';

// Baked surface detail keeps the moon inexpensive: one texture, no extra lights.
export function Moon({rays=true}:{rays?:boolean}){
  const surface=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#aaaead';ctx.fillRect(0,0,1024,512);
    const random=(seed:number)=>{const v=Math.sin(seed*127.1+41.7)*43758.5453;return v-Math.floor(v);};
    for(let i=0;i<26;i++){
      const x=random(i)*1024,y=70+random(i+52)*370,r=25+random(i+18)*90;
      const mare=ctx.createRadialGradient(x,y,0,x,y,r);mare.addColorStop(0,'#58626770');mare.addColorStop(.65,'#67717450');mare.addColorStop(1,'#67717400');ctx.fillStyle=mare;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    for(let i=0;i<1800;i++){
      const x=random(i+100)*1024,y=random(i+2300)*512,r=1+Math.pow(random(i+7200),4)*15;
      const crater=ctx.createRadialGradient(x-r*.22,y+r*.2,r*.1,x,y,r);crater.addColorStop(0,'#535d6178');crater.addColorStop(.57,'#79808148');crater.addColorStop(.77,'#e2e3d59c');crater.addColorStop(1,'#a3aaa800');ctx.fillStyle=crater;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return map;
  },[]);
  useEffect(()=>()=>surface.dispose(),[surface]);
  const uniforms=useMemo(()=>({surface:{value:surface}}),[surface]);
  return <>
    <mesh><sphereGeometry args={[1.15,40,28]}/><shaderMaterial uniforms={uniforms} vertexShader={'varying vec2 vUv;varying vec3 n;void main(){vUv=uv;n=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'uniform sampler2D surface;varying vec2 vUv;varying vec3 n;void main(){float light=.30+.70*max(0.,dot(normalize(n),normalize(vec3(-.45,.35,1.))));vec3 albedo=texture2D(surface,vUv).rgb;gl_FragColor=vec4(albedo*vec3(.94,.99,1.04)*light,1.);\n#include <colorspace_fragment>\n}'}/></mesh>
    {rays&&<mesh position={[0,0,-.1]}><planeGeometry args={[8,8]}/><shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 v;void main(){vec2 p=(v-.5)*2.;float r=length(p),a=atan(p.y,p.x);float halo=exp(-max(0.,r-.28)*12.)*.10;float rays=pow(.5+.5*cos(a*12.+sin(a*3.)*.6),28.)*exp(-r*5.)*.075;float alpha=(halo+rays)*smoothstep(.26,.32,r)*(1.-smoothstep(.65,1.,r));gl_FragColor=vec4(.67,.76,.9,alpha);}'}/></mesh>}
  </>;
}
