import { useCallback, useEffect, useRef, useState } from 'react';
import { hashWorld, worldProgress } from './journey';
import type { WorldId } from '../data/worlds';

export function useJourney(entered:boolean, reduced:boolean, blocked:boolean) {
  const [progress,setProgress]=useState(()=>worldProgress(hashWorld(location.hash))); const [speed,setSpeed]=useState(0);
  const current=useRef(progress),target=useRef(progress),lastTravel=useRef(Date.now()),lastInput=useRef(0);
  const blockedRef=useRef(blocked),initialized=useRef(false),publishedProgress=useRef(progress);
  blockedRef.current=blocked;
  const navigate=useCallback((id:WorldId,history=true)=>{
    target.current=worldProgress(id);lastTravel.current=Date.now();lastInput.current=performance.now();
    if(history&&location.hash!==`#${id}`)window.history.pushState(null,'',`#${id}`);
    if(reduced){current.current=target.current;setProgress(current.current);}
    // Run after dialog cleanup so closing the map cannot restore focus over navigation.
    requestAnimationFrame(()=>document.getElementById('world-content')?.focus({preventScroll:true}));
  },[reduced]);
  useEffect(()=>{
    if(!entered)return; let frame=0,previous=performance.now(),published=0,touchY:number|null=null;
    if(!initialized.current){initialized.current=true;navigate(hashWorld(location.hash),false);}
    const move=(delta:number)=>{target.current=Math.max(0,Math.min(1,target.current+delta/(Math.max(500,innerHeight)*5)));lastTravel.current=Date.now();lastInput.current=performance.now();};
    const wheel=(e:WheelEvent)=>{if(blockedRef.current||e.ctrlKey)return;e.preventDefault();move(e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1));};
    const start=(e:TouchEvent)=>{if(!blockedRef.current&&!((e.target as HTMLElement).closest('button,a,input,dialog')))touchY=e.touches[0].clientY;};
    const touch=(e:TouchEvent)=>{if(touchY===null||blockedRef.current)return;e.preventDefault();const y=e.touches[0].clientY;move((touchY-y)*2);touchY=y;};
    const end=()=>{touchY=null;};
    const history=()=>navigate(hashWorld(location.hash),false);
    const tick=(now:number)=>{const dt=Math.min(.2,(now-previous)/1000);previous=now;
      if(!document.hidden){const before=current.current;current.current=reduced?target.current:before+(target.current-before)*(1-Math.exp(-dt*10));
        if(Math.abs(target.current-current.current)<.00008)current.current=target.current;
        if(now-published>30){if(current.current!==publishedProgress.current){publishedProgress.current=current.current;setProgress(current.current);}setSpeed(Math.abs(current.current-before)/Math.max(dt,.001)*20+(now-lastInput.current<180?.1:0));published=now;}}
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',start,{passive:true});window.addEventListener('touchmove',touch,{passive:false});window.addEventListener('touchend',end);window.addEventListener('popstate',history);window.addEventListener('hashchange',history);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',start);window.removeEventListener('touchmove',touch);window.removeEventListener('touchend',end);window.removeEventListener('popstate',history);window.removeEventListener('hashchange',history);};
  },[entered,reduced,navigate]);
  const seek=useCallback((chapter:number)=>{const p=Math.max(0,Math.min(6,chapter))/6;current.current=target.current=publishedProgress.current=p;setProgress(p);setSpeed(0);},[]);
  return {progress,speed,navigate,lastTravel,seek};
}
