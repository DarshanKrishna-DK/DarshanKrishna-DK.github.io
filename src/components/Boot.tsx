import { useEffect, useState } from 'react';
import { ArrowRight, Feather, Terminal } from 'lucide-react';
import { actionDelay, nextBootAction, type GunduState } from '../lib/companion';
import { Gundu } from '../scene/Gundu';
import { GraphicsBoundary } from './GraphicsBoundary';
import { BootBackdrop } from './BootBackdrop';
import { bootLines, companionIntroduction, liveCommands } from '../data/boot';
export function Boot({loaded,total,onEnter,onLightweight,reduced,onReady,onGraphicsFailure,failures,exiting=false}:{loaded:number;total:number;onEnter:(sound:boolean)=>void;onLightweight:()=>void;reduced:boolean;onReady:()=>void;onGraphicsFailure:()=>void;failures:number;exiting?:boolean}) {
  const ready=loaded>=total;const [action,setAction]=useState<GunduState>('waving');const [command,setCommand]=useState(0);
  useEffect(()=>{if(reduced||exiting)return;let timer:ReturnType<typeof setTimeout>;const next=()=>{timer=setTimeout(()=>{if(!document.hidden)setAction(previous=>nextBootAction(previous,Math.random()));next();},actionDelay(Math.random()));};next();return()=>clearTimeout(timer);},[reduced,exiting]);
  useEffect(()=>{if(!ready||exiting||reduced)return;const timer=setInterval(()=>{if(!document.hidden)setCommand(n=>(n+1)%liveCommands.length);},2400);return()=>clearInterval(timer);},[ready,exiting,reduced]);
  return <div className={`boot-screen ${exiting?'boot-exiting':''}`} inert={exiting}>
    <BootBackdrop/><div className="boot-grain"/>
    <header className="boot-header"><span>DARSHAN.WORLD</span><span>PERSONAL UNIVERSE</span></header>
    <div className="boot-layout">
      <div className="boot-welcome"><span className="eyebrow">A SMALL WORLD. A LOT OF DARSHAN.</span><h1>EVERY IDEA<br/>HAS A<br/><em>WORLD.</em></h1><p>Products, people and a few detours.<br/>A world worth getting a little lost in.</p><div className="entry-actions"><button className="button entry-button" onClick={()=>onEnter(true)} disabled={!ready||exiting}><span>Begin the journey</span><ArrowRight size={20}/></button><span className="entry-sound-note">Sound on entry. Mute anytime.</span>{failures>0&&<p className="quiet-note" role="status">Some imagery couldn't load. All stories remain available.</p>}<button className="button secondary lightweight-entry" onClick={onLightweight} disabled={exiting}><Feather size={15}/><span>Explore in lightweight mode</span><ArrowRight size={15}/></button></div></div>
      <div className={`boot-terminal ${ready&&!reduced?'terminal-ready':''}`}><div className="terminal-chrome"><div><i/><i/><i/></div><span>gundu@darshan.world:~</span><Terminal size={13}/></div><span className="eyebrow">SYSTEM / COMPANION SCAN</span><div className="terminal-lines">{bootLines.slice(0,Math.max(2,Math.ceil(loaded/total*bootLines.length))).map((line,i)=><p key={line} style={{animationDelay:`${i*70}ms`}}><span>&gt;</span> {line}{i===6&&<b> FOUND</b>}</p>)}{ready&&<div className="terminal-live" key={command}><p><span>$</span> {liveCommands[command][0]}</p><p className="command-result">↳ {liveCommands[command][1]}<i className="live-caret"/></p></div>}</div><div className="boot-track"><span style={{transform:`scaleX(${loaded/total})`}}/></div><div className="boot-status"><span>{ready?'WORLD READY':'PREPARING YOUR WORLD'}</span><span>{loaded}/{total} SYSTEMS</span></div></div>
      <div className="boot-duck"><div className="boot-introduction"><span>COMPANION ONLINE</span><p>{companionIntroduction}</p></div><GraphicsBoundary onFailure={onGraphicsFailure}><Gundu state={reduced?'idle':action} reduced={reduced} onReady={onReady} onClick={()=>setAction('quacking')}/></GraphicsBoundary></div>
    </div><footer className="boot-footer"><span>DESIGNED TO WANDER. BUILT TO MAKE SENSE.</span><span>BENGALURU, INDIA</span></footer>
  </div>;
}
