import { useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { SceneMotion } from './Motion';

const code=['$ python quality_workflow.py','→ connect: Databricks / sample data','→ load validation rules','→ SQL + PySpark transformations','→ check schema and null values','→ collect traceable results','→ human.review(report)','✓ workflow ready for review'];
export function Display({kind='code',logo,name='DARSHAN / DEVLAB',width=3.2,height=1.8,round=false}:{kind?:'code'|'logo'|'stage'|'anime'|'game';logo?:string;name?:string;width?:number;height?:number;round?:boolean}){
  const reduced=useContext(SceneMotion),invalidate=useThree(s=>s.invalidate);const tick=useRef(-1),image=useRef<HTMLImageElement|null>(null);
  const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=round?1024:576;const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;},[round]);
  const draw=(step=0)=>{const c=texture.image as HTMLCanvasElement,ctx=c.getContext('2d')!,w=c.width,h=c.height;ctx.fillStyle=kind==='stage'?'#192834':kind==='logo'?'#172830':'#071822';ctx.fillRect(0,0,w,h);
    if(kind==='logo'){
      const gradient=ctx.createRadialGradient(w*.5,h*.4,30,w*.5,h*.5,w*.6);gradient.addColorStop(0,'#39575c');gradient.addColorStop(1,'#0f1c28');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
      if(image.current){const im=image.current,scale=Math.min(w*.66/im.width,h*.57/im.height),iw=im.width*scale,ih=im.height*scale;ctx.drawImage(im,(w-iw)/2,(h-ih)/2-35,iw,ih);}
      ctx.textAlign='center';ctx.fillStyle='#eee3c9';ctx.font='64px "Pixelify Sans", monospace';ctx.fillText(name,w/2,h*.84);ctx.textAlign='left';
    }else if(kind==='stage'){
      const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#254a52');g.addColorStop(1,'#151d30');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.textAlign='center';ctx.fillStyle='#d4b478';ctx.font='27px "VT323", monospace';ctx.fillText('BENGALURU / DEVELOPER COMMUNITY',w/2,123);ctx.font='100px "Pixelify Sans", monospace';ctx.fillStyle='#f0eee1';ctx.fillText('KrowdKraft',w/2,274);ctx.font='32px "VT323", monospace';ctx.fillStyle='#99c6c0';ctx.fillText('LEARN TOGETHER. BUILD TOGETHER.',w/2,352);ctx.strokeStyle='#74908a';ctx.beginPath();ctx.moveTo(250,411);ctx.lineTo(774,411);ctx.stroke();ctx.textAlign='left';
    }else if(kind==='anime'){
      ctx.fillStyle='#d4bc85';ctx.beginPath();ctx.arc(710,195,115,0,Math.PI*2);ctx.fill();ctx.fillStyle='#183d3d';ctx.beginPath();ctx.moveTo(0,520);ctx.lineTo(240,220);ctx.lineTo(450,420);ctx.lineTo(625,280);ctx.lineTo(1024,480);ctx.lineTo(1024,576);ctx.fill();ctx.fillStyle='#f1dec5';ctx.font='52px "Pixelify Sans", monospace';ctx.fillText('OTHER WORLDS',55,145);ctx.font='29px "VT323", monospace';['ONE PIECE','AKAME GA KILL!','HUNTER × HUNTER'].forEach((line,i)=>ctx.fillText(line,60,240+i*56));
     }else if(kind==='game'&&image.current){
      const im=image.current,scale=Math.max(w/im.width,h/im.height);ctx.drawImage(im,(w-im.width*scale)/2,(h-im.height*scale)/2,im.width*scale,im.height*scale);const g=ctx.createLinearGradient(0,h*.55,0,h);g.addColorStop(0,'#06101a00');g.addColorStop(1,'#06101abb');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle='#e8e5de';ctx.font='43px "Pixelify Sans", monospace';ctx.fillText(name,35,h-32);
    }else if(kind==='game'){
      ctx.fillStyle='#263841';ctx.fillRect(20,20,w-40,h-40);ctx.strokeStyle='#84978f';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(w/2,200);ctx.lineTo(i*180,h);ctx.stroke();}ctx.fillStyle='#dfcba4';ctx.font='66px "Pixelify Sans", monospace';ctx.fillText(name,48,126);ctx.font='27px "VT323", monospace';ctx.fillText('BOTLIFEMATTERS / NOW PLAYING',50,190);ctx.fillStyle='#ad8fae';ctx.fillRect(50,h-100,250+(step%5)*60,5);
    }else{
      ctx.fillStyle='#16323d';ctx.fillRect(0,0,w,60);ctx.fillStyle='#a7d6cb';ctx.font='27px "VT323", monospace';ctx.fillText(name,32,41);ctx.font='31px "VT323", monospace';const count=3+step%6;code.slice(0,count).forEach((line,i)=>{ctx.fillStyle=i===count-1?'#e3c384':'#83b6ac';ctx.fillText(line,37,111+i*48);});ctx.fillStyle='#ceb87c';ctx.fillRect(37,130+Math.min(count,8)*48,15,4);ctx.fillStyle='#416572';ctx.fillRect(w-220,100,170,12);[.5,.8,.65,.94].forEach((v,i)=>{ctx.fillStyle=i===step%4?'#a1bda5':'#3b7276';ctx.fillRect(w-220,160+i*65,v*170,15);});
    }texture.needsUpdate=true;invalidate();
  };
  useEffect(()=>{let live=true;draw();void document.fonts.ready.then(()=>{if(live)draw();});if(logo){const im=new Image();im.onload=()=>{if(live){image.current=im;draw();}};im.src=logo;}return()=>{live=false;image.current=null;};},[logo,name,texture]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useFrame(({clock})=>{if(reduced||document.hidden||!['code','game'].includes(kind))return;const next=Math.floor(clock.elapsedTime/1.4);if(next!==tick.current){tick.current=next;draw(next);}});
  return <mesh>{round?<circleGeometry args={[width/2,64]}/>:<planeGeometry args={[width,height]}/>}{kind==='logo'?<meshStandardMaterial map={texture} roughness={.48} metalness={.08} emissiveMap={texture} emissive="white" emissiveIntensity={.22}/>:<meshBasicMaterial map={texture} toneMapped={false}/>}</mesh>;
}
