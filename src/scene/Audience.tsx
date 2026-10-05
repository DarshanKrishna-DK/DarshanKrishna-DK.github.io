import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { applauseEnvelope } from '../lib/audienceCue';
import { Instances, type Instance } from './Instances';

export function AnimatedAudience({active}:{active:boolean}){
  const age=useRef(0),gesture=useMemo(()=>({value:0}),[]);
  useEffect(()=>{age.current=0;gesture.value=0;},[active,gesture]);
  useFrame((_,delta)=>{if(active&&!document.hidden)age.current+=delta;gesture.value=active?applauseEnvelope(age.current):0;});
  const data=useMemo(()=>{
    const seats:Instance[]=[],bodies:Instance[]=[],heads:Instance[]=[],arms:Instance[]=[],hands:Instance[]=[];
    for(let row=0;row<28;row++)for(let col=0;col<50;col++){
      const x=3+(col-24.5)*.28+(col<25?-.35:.35),z=-6+row*.42,y=-1.65+Math.floor(row/10)*.8+(row%10)*.035;
      const shirt=['#465960','#665366','#67725c','#807057','#334c60'][(col+row)%5],skin=['#947b62','#b0987e','#735b4c'][(col+row)%3];
      const wave=(row*50+col)%9===0,clap=(row*50+col)%4===0;
      seats.push({position:[x,y+.12,z],scale:[.22,.25,.27],color:'#392d3b'});
      bodies.push({position:[x,y+.38,z-.04],scale:[.105,.15,.09],color:shirt});
      heads.push({position:[x,y+.66,z-.055],scale:[.069,.082,.068],color:skin});
      for(const side of [-1,1]){
        const up=wave&&side===1;
        arms.push({position:[x+side*(clap?.055:.12),y+(up?.66:.43),z-(clap?.14:.055)],scale:[.038,.10,.038],rotation:[clap?-.9:up?.1:-.25,0,side*(up?-.5:clap?.6:.17)],color:shirt});
        hands.push({position:[x+side*(clap?.035:up?.15:.14),y+(up?.80:clap?.46:.34),z-(clap?.22:.07)],scale:[.029,.035,.026],color:skin});
      }
    }
    return {seats,bodies,heads,arms,hands};
  },[]);
  return <><Instances items={data.seats}/><Instances shape="person" items={data.bodies} motion="body"/><Instances shape="sphere" items={data.heads} motion="head"/><Instances shape="person" items={data.arms} motion="arm" gesture={gesture}/><Instances shape="sphere" items={data.hands} motion="arm" gesture={gesture}/></>;
}
