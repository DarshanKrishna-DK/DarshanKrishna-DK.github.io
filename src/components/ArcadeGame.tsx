import { useEffect, useRef, useState } from 'react';
import { Crosshair, RotateCcw } from 'lucide-react';
import { reactionResult } from '../lib/walkthrough';
export function ArcadeGame() {
  const [state,setState]=useState<'ready'|'waiting'|'go'|'early'|'done'>('ready');const [result,setResult]=useState(0);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const readyAt=useRef(0);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  function play(){readyAt.current=0;setState('waiting');timer.current=setTimeout(()=>{readyAt.current=performance.now();setState('go');},1200+Math.random()*1800);}
  function hit(){if(state==='ready'||state==='early'||state==='done'){play();return;}if(state==='waiting'){if(timer.current)clearTimeout(timer.current);setState('early');return;}const measured=reactionResult(readyAt.current,performance.now());if(measured!==null){setResult(measured);setState('done');}}
  return <div className="arcade-game"><div className="game-identity"><span>PLAYER / BotLifeMatters</span><span>REACTION CHECK / 01</span></div><h3>Quick hands. Questionable alias.</h3><p>Wait for the target to light up, then tap or press Space on the button. No leaderboard. Just you and your reflexes.</p>
    <button className={`reaction-pad ${state}`} onClick={hit} aria-live="polite"><Crosshair size={58}/><strong>{state==='ready'?'START ROUND':state==='waiting'?'WAIT FOR IT…':state==='go'?'NOW!':state==='early'?'TOO EAGER. TRY AGAIN.':`${result} ms`}</strong><span>{state==='done'?'Your actual reaction time. Tap to replay.':state==='go'?'TAP / SPACE':'One click. One side quest.'}</span></button>
    {state==='done' && <p className="game-result">{result<250?'Okay. Maybe that alias is a bluff.':result<450?'Respectable. Gundu remains unimpressed.':'Gundu says the keyboard was clearly lagging.'}</p>}
    <button className="text-button" onClick={()=>{if(timer.current)clearTimeout(timer.current);setState('ready');readyAt.current=0;}}><RotateCcw size={14}/> Reset cabinet</button>
  </div>;
}
