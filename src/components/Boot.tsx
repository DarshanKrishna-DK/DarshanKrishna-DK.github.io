import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Feather } from 'lucide-react';
import { actionDelay, nextBootAction, type GunduState } from '../lib/companion';
import { Gundu } from '../scene/Gundu';
import { GraphicsBoundary } from './GraphicsBoundary';
import { BootBackdrop } from './BootBackdrop';
import { bootLines, companionIntroduction, liveCommands } from '../data/boot';

export function Boot({loaded,total,onEnter,onLightweight,reduced,onReady,onGraphicsFailure,failures,exiting=false}:{loaded:number;total:number;onEnter:(sound:boolean)=>void;onLightweight:()=>void;reduced:boolean;onReady:()=>void;onGraphicsFailure:()=>void;failures:number;exiting?:boolean}) {
  const [spaceReady,setSpaceReady]=useState(false); const ready=loaded>=total&&spaceReady; const orbitalReady=useCallback(()=>setSpaceReady(true),[]); const [guideVisible,setGuideVisible]=useState(true);
  const [action,setAction]=useState<GunduState>('waving');
  const [command,setCommand]=useState(0);
  useEffect(()=>{if(!guideVisible)return;const timer=setTimeout(()=>setGuideVisible(false),10000);return()=>clearTimeout(timer);},[guideVisible]);
  useEffect(()=>{const timer=setInterval(()=>{if(!document.hidden)setGuideVisible(true);},28000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{
    if(reduced||exiting)return;
    let timer:ReturnType<typeof setTimeout>;
    const next=()=>{timer=setTimeout(()=>{if(!document.hidden)setAction(previous=>nextBootAction(previous,Math.random()));next();},actionDelay(Math.random()));};
    next();return()=>clearTimeout(timer);
  },[reduced,exiting]);
  useEffect(()=>{
    if(!ready||exiting||reduced)return;
    const timer=setInterval(()=>{if(!document.hidden)setCommand(n=>(n+1)%liveCommands.length);},4800);
    return()=>clearInterval(timer);
  },[ready,exiting,reduced]);
  return <div className={'entry-screen'+(exiting?' entry-exiting':'')} inert={exiting}>
    <BootBackdrop reduced={reduced||exiting} onReady={orbitalReady}/>
    <header className="entry-header"><span className="entry-wordmark">DARSHAN.WORLD</span><span className="entry-location"><i/>From Bengaluru, with curiosity.</span></header>
    <div className="entry-layout">
      <main className="entry-copy">
        <p className="entry-name">Darshan Krishna N</p>
        <h1>A DEVELOPER.<br/>A CONNECTOR.<br/>AN EXPLORER.</h1>
        <p className="entry-description">I build products, bring developers together, and take the long way home.</p>
        <p className="entry-invitation">Step into my work, my communities and the things<br className="entry-desktop-break"/> that keep me curious.</p>
        <div className="entry-launch">
          <button className="button entry-primary" onClick={()=>onEnter(true)} disabled={!ready||exiting}><span>Begin the journey</span><ArrowRight size={20}/></button>
          <button className="button secondary entry-lite" onClick={onLightweight} disabled={exiting}><Feather size={16}/><span>Lightweight journey</span></button>
        </div>
        {failures>0&&<p className="entry-failure" role="status">Some imagery is taking a detour. You can still explore.</p>}
      </main>
      <aside className="entry-guide">
        <div className="entry-gundu"><GraphicsBoundary onFailure={onGraphicsFailure}><Gundu state={reduced?'idle':action} reduced={reduced} onReady={onReady} onClick={()=>{setAction('quacking');setGuideVisible(true);}}/></GraphicsBoundary></div>
        {guideVisible&&<button className="entry-guide-copy" onClick={()=>setGuideVisible(false)} aria-label="Dismiss Gundu introduction"><span>Your local guide</span><p>{companionIntroduction}</p></button>}
      </aside>
    </div>
    <footer className="entry-footer">
      <div className="entry-systems"><div className="entry-system-title"><i className={ready?'is-ready':''}/><span>{ready?'Seven worlds. One journey.':'Preparing your journey'}</span><span>{Math.min(100,Math.round((loaded+(spaceReady?1:0))/(total+1)*100))}%</span></div><div className="entry-load-track"><span style={{transform:'scaleX('+Math.min(1,(loaded+(spaceReady?1:0))/(total+1))+')'}}/></div><p className="entry-command">{ready?liveCommands[command][1]:bootLines[Math.min(bootLines.length-1,loaded)]}</p></div>
      <p className="entry-route">Products. People. Open roads.<span>Scroll to travel once you're inside.</span></p>
    </footer>
  </div>;
}
