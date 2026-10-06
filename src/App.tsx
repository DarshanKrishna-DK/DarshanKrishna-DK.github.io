import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, FileText, GitBranch, Map, VolumeX } from 'lucide-react';
import { Boot } from './components/Boot';
import { AnimeArchive } from './components/AnimeArchive';
import { Hud } from './components/Hud';
import { WorldContent } from './components/WorldContent';
import { Dialog } from './components/Dialog';
import { ProjectWalkthrough } from './components/ProjectWalkthrough';
import { ArcadeGame } from './components/ArcadeGame';
import { MemoryFrame } from './components/MemoryFrame';
import { Gundu } from './scene/Gundu';
import { profile, ecosystemRoles, communityStats, communityMemories } from './data/profile';
import { projects } from './data/projects';
import { worlds, type WorldId } from './data/worlds';
import { worldDialogue, clickDialogue, projectDialogue, sectionDialogue, roadDialogue } from './data/gundu';
import { entryWorld, sampleJourney } from './lib/journey';
import { useJourney } from './lib/useJourney';
import { LightweightScene } from './components/LightweightScene';
import { companionState, maySpeak } from './lib/companion';
import { Ambience } from './lib/audio';
import { boundedReadiness,graphicsAvailable } from './lib/readiness';
import { GraphicsBoundary } from './components/GraphicsBoundary';
import { analytics, portfolioLinkEvent } from './lib/analytics';
import { AnalyticsPrivacy } from './components/AnalyticsPrivacy';

const WorldCanvas = lazy(()=>import('./scene/WorldCanvas'));
type Manifest={portrait:boolean;cutout:boolean;bike:boolean;resume:boolean};

export default function App() {
  const [entered,setEntered]=useState(()=>entryWorld(location.hash)!==null);
  const [bootVisible,setBootVisible]=useState(()=>entryWorld(location.hash)===null);const [volume,setVolume]=useState(.65);
  const [audioStatus,setAudioStatus]=useState({state:'closed',rms:0,audienceRms:0,audienceReady:false,audienceBursts:0,natureReady:0,music:true,theme:'Spawn / first light'});
  const [worldReady,setWorldReady]=useState(false);
  const worldRendered=useCallback(()=>setWorldReady(true),[]);
  const [loaded,setLoaded]=useState(0);const [sceneReady,setSceneReady]=useState(false);const [failures,setFailures]=useState(0);
  const [manifest,setManifest]=useState<Manifest>({portrait:true,cutout:false,bike:true,resume:false});
  const [lightweight,setLightweight]=useState(()=>!graphicsAvailable());
  const [reduced,setReduced]=useState(()=>localStorage.getItem('dw-reduced')==='true'||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [muted,setMuted]=useState(true);const [modal,setModal]=useState<string|null>(null);
  const [project,setProject]=useState(0);const [roadBeat,setRoadBeat]=useState(0);const [dialogue,setDialogue]=useState<string|null>(null);
  const [idle,setIdle]=useState(0);const [clicks,setClicks]=useState(0);const [quacking,setQuacking]=useState(false);const quackTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [copied,setCopied]=useState(false);const [audioError,setAudioError]=useState(false);
  const audio=useRef<Ambience|null>(null);const interaction=useRef(Date.now());const lastSpoke=useRef(-20000);const lineTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const {progress,speed,navigate,lastTravel,seek}=useJourney(entered,reduced,Boolean(modal));
  const index=sampleJourney(progress).index;
  useEffect(()=>{
    const timer=setTimeout(()=>analytics.pageView(entered?worlds[index].id:'entry'),900);
    return()=>clearTimeout(timer);
  },[entered,index]);
  useEffect(()=>{
    if(!modal)return;
    if(modal.startsWith('project-'))analytics.event('project_open',{project:projects[Number(modal.split('-')[1])].id});
    else if(modal==='briefing')analytics.event('briefing_open');
    else if(modal==='anime')analytics.event('anime_archive_open');
  },[modal]);
  useEffect(()=>{
    if(entered&&index===4)analytics.event('travel_story_view',{story:['ride','midnight_ghats','lake_reset'][roadBeat]});
  },[entered,index,roadBeat]);
  const close=useCallback(()=>setModal(null),[]);
  const ready=useCallback(()=>setSceneReady(true),[]);
  const fail=useCallback(()=>{setLightweight(true);setSceneReady(true);},[]);
  const speak=useCallback((line:string,force=false)=>{const now=performance.now();if(!force&&!maySpeak(now,lastSpoke.current))return;lastSpoke.current=now;setDialogue(line);if(lineTimer.current)clearTimeout(lineTimer.current);lineTimer.current=setTimeout(()=>setDialogue(null),6500);},[]);


  useEffect(()=>{
    let live=true;
    if(location.hash&&!entryWorld(location.hash))window.history.replaceState(null,'',location.pathname+location.search);
    const essential=['/assets/portrait.webp','/assets/yezdi.webp','/assets/project-logos/sahay.png','/assets/project-logos/zuik.png','/assets/project-logos/swyftpay.png','/assets/portrait-cutout.webp'];
    essential.forEach(url=>{const image=new Image();const work=new Promise<boolean>(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=url;});void boundedReadiness(work).then(success=>{if(!live)return;setLoaded(n=>n+1);if(!success){setFailures(n=>n+1);if(url.includes('portrait'))setManifest(m=>({...m,portrait:false}));if(url.includes('yezdi'))setManifest(m=>({...m,bike:false}));}});});
    fetch('/assets/manifest.json').then(r=>r.ok?r.json():Promise.reject()).then((m:Manifest)=>{if(live)setManifest(m);}).catch(()=>{});
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setReduced(media.matches);media.addEventListener('change',changed);
    audio.current=new Ambience();const lost=()=>fail();window.addEventListener('world-context-lost',lost);
    return()=>{live=false;media.removeEventListener('change',changed);window.removeEventListener('world-context-lost',lost);audio.current?.dispose();if(lineTimer.current)clearTimeout(lineTimer.current);if(quackTimer.current)clearTimeout(quackTimer.current);};
  },[fail]);
  useEffect(()=>{if(!entered||sceneReady&&(worldReady||lightweight))return;const timeout=setTimeout(fail,12000);return()=>clearTimeout(timeout);},[entered,sceneReady,worldReady,lightweight,fail]);
  useEffect(()=>{if(lightweight)setSceneReady(true);},[lightweight]);
  useEffect(()=>{localStorage.setItem('dw-reduced',String(reduced));},[reduced]);
  useEffect(()=>{audio.current?.setRoadBeat(roadBeat);},[roadBeat]);
  useEffect(()=>{audio.current?.setArchive(modal==='anime');},[modal]);
  useEffect(()=>{audio.current?.setVolume(volume);},[volume]);
  useEffect(()=>{if(!entered)return;const timer=setTimeout(()=>setBootVisible(false),reduced?0:850);return()=>clearTimeout(timer);},[entered,reduced]);
  useEffect(()=>{if(!entered)return;const timer=setInterval(()=>{const status=audio.current?.status();if(status)setAudioStatus(status);},500);return()=>clearInterval(timer);},[entered]);
  useEffect(()=>{if(!entered||modal)return;let line=1;const timer=setInterval(()=>{if(document.hidden)return;const facts=sectionDialogue[index];speak(facts[line%facts.length]);line++;},21000);return()=>clearInterval(timer);},[entered,index,modal,speak]);
  useEffect(()=>{if(entered&&index===4)speak(roadDialogue[roadBeat],true);},[entered,index,roadBeat,speak]);
  useEffect(()=>{
    if(!entered)return;
    let lastPointer=0;
    const activity=(e:PointerEvent)=>{const now=performance.now();if(now-lastPointer<70)return;lastPointer=now;interaction.current=Date.now();};
    const interval=setInterval(()=>setIdle((Date.now()-Math.max(lastTravel.current,interaction.current))/1000),1000);
    const visibility=()=>audio.current?.visibility(document.hidden);
    window.addEventListener('pointermove',activity,{passive:true});document.addEventListener('visibilitychange',visibility);
    return()=>{window.removeEventListener('pointermove',activity);clearInterval(interval);document.removeEventListener('visibilitychange',visibility);};
  },[entered,lastTravel]);
  useEffect(()=>{
    if(!entered)return;
    audio.current?.setWorld(index);
    setDialogue(null);
    const timer=setTimeout(()=>{window.history.replaceState(null,'',`#${worlds[index].id}`);speak(worldDialogue[index],true);},900);
    return()=>clearTimeout(timer);
  },[entered,index,speak]);
  useEffect(()=>{
    if(!entered||modal)return;
    const key=(e:KeyboardEvent)=>{
      const target=e.target as HTMLElement;if(target.closest('button,a,input,textarea,select'))return;
      if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();navigate(worlds[Math.min(6,index+1)].id);}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();navigate(worlds[Math.max(0,index-1)].id);}if(e.key.toLowerCase()==='m')setModal('map');
    };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[entered,modal,index,navigate]);
  async function toggleSound(){try{if(muted){await audio.current?.start();setMuted(false);}else{audio.current?.setMuted(true);setMuted(true);}setAudioError(false);}catch{setAudioError(true);setMuted(true);}}
  async function enter(sound:boolean,mode=lightweight?'lightweight':'cinematic'){analytics.event('journey_start',{mode,sound});interaction.current=Date.now();setIdle(0);setEntered(true);if(sound)await toggleSound();}
  const selectProject=useCallback((i:number)=>{setProject(i);speak(projectDialogue[i],true);},[speak]);
  async function copyEmail(){try{await navigator.clipboard.writeText(profile.email);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{setCopied(false);}}
  function talkDuck(){interaction.current=Date.now();setQuacking(true);audio.current?.quack();if(quackTimer.current)clearTimeout(quackTimer.current);quackTimer.current=setTimeout(()=>setQuacking(false),1300);setClicks(c=>c+1);speak(clickDialogue[Math.min(Math.floor(clicks/2),clickDialogue.length-1)],true);setTimeout(()=>setClicks(0),8000);}
  const baseState=companionState({world:index,idle,speed,clicks});
  const duckState=quacking&&clicks<5?'quacking':dialogue&&!['walking','running','annoyed','sleeping','dancing','waving','stretching','warming'].includes(baseState)?'talking':baseState;
  const accessory=companionState({world:index,idle:0,speed:0,clicks:0});
  const portrait=manifest.cutout?'/assets/portrait-cutout.webp':'/assets/portrait.webp';
  const modalTitle=modal==='map'?'Choose your next world':modal==='briefing'?'The 60-second briefing':modal==='community'?'People make the difference':modal==='work'?'The work behind the title':modal==='agents'?'A builder with a very good PA':modal==='game'?'BotLifeMatters · the side quest':modal==='anime'?'Anime Archive':modal?.startsWith('project-')?projects[Number(modal.split('-')[1])].name:'';

  return <div className={`app ${entered?'entered':''} ${lightweight?'lightweight':''} ${reduced?'reduced-motion':''}`} data-world={worlds[index].id} onClickCapture={e=>{const anchor=(e.target as Element).closest('a');if(anchor){const event=portfolioLinkEvent(anchor.href);if(event)analytics.event(event.name,event.parameters);}}}>
    {import.meta.env.DEV&&entered&&new URLSearchParams(location.search).has('scene-review')&&<label style={{position:'fixed',top:68,left:20,zIndex:100,fontSize:13,padding:8,background:'#101a2bd9',borderRadius:8}}>Camera chapter <input aria-label="Camera chapter" type="number" min="0" max="6" step="0.05" value={Number((progress*6).toFixed(3))} onChange={e=>seek(Number(e.target.value))} style={{width:65,marginLeft:8}}/></label>}
    <div className="scene-layer" aria-hidden="true">{lightweight&&<LightweightScene world={index} beat={roadBeat} project={project}/>} {!lightweight && entered && <GraphicsBoundary onFailure={fail}><Suspense fallback={null}><WorldCanvas progress={progress} reduced={reduced} roadBeat={roadBeat} project={project} onProject={selectProject} onReady={worldRendered} onFailure={fail} paused={Boolean(modal)||!entered}/></Suspense></GraphicsBoundary>}<div className="scene-vignette"/><div className="scene-grain"/><div className="spatial-grid"/></div>
    {bootVisible&&<Boot loaded={loaded+(sceneReady?1:0)} total={7} onEnter={enter} onLightweight={()=>{setLightweight(true);void enter(true,'lightweight');}} reduced={reduced} onReady={ready} onGraphicsFailure={fail} failures={failures} exiting={entered}/>}{entered&&<>

      <a className="skip-link" href="#world-content" onClick={e=>{e.preventDefault();document.getElementById('world-content')?.focus({preventScroll:true});}}>Skip to current world content</a>
      <Hud index={index} progress={progress} muted={muted} lightweight={lightweight} onMap={()=>setModal('map')} onBriefing={()=>setModal('briefing')} onMute={()=>void toggleSound()} onMode={()=>setLightweight(l=>!l)} navigate={navigate}/>
      <WorldContent progress={progress} index={index} project={project} setProject={selectProject} roadBeat={roadBeat} setRoadBeat={setRoadBeat} portrait={manifest.portrait?portrait:''} hasBike={manifest.bike} navigate={navigate} open={setModal}/>
      <div className="companion"><div className="gundu-dialogue-slot">{dialogue&&<button className="gundu-dialogue" onClick={()=>setDialogue(null)} aria-label="Dismiss Gundu dialogue"><span>GUNDU</span><p>{dialogue}</p><small>tap to dismiss</small></button>}</div>{<GraphicsBoundary onFailure={fail}><Gundu state={duckState} accessory={accessory} reduced={reduced} onClick={talkDuck} onReady={ready}/></GraphicsBoundary>}</div>
      <output className="soundscape-status" data-audio-state={audioStatus.state} data-audio-rms={audioStatus.rms.toFixed(5)} data-audience-rms={audioStatus.audienceRms.toFixed(5)} data-audience-ready={audioStatus.audienceReady} data-audience-bursts={audioStatus.audienceBursts} data-nature-ready={audioStatus.natureReady} data-music={audioStatus.music} data-muted={muted} aria-hidden="true"/>
      {audioError&&<div className="audio-error" role="status"><VolumeX size={14}/> Sound unavailable in this browser. The journey continues silently.</div>}
      {modal&&<Dialog title={modalTitle} onClose={close} project={modal.startsWith('project-')} wide={modal==='anime'||modal==='resume'||modal.startsWith('project-')}>
        {modal==='map'&&<div className="map-content"><p>Take the scenic route, or go straight to what interests you.</p><div className="map-utilities"><button className="button secondary" onClick={()=>setModal('briefing')}>Quick briefing<ArrowUpRight size={15}/></button><button className="text-button" onClick={()=>setLightweight(l=>!l)}>{lightweight?'Enable cinematic mode':'Enable lightweight mode'}</button><button className="text-button" aria-pressed={reduced} onClick={()=>setReduced(r=>!r)}>{reduced?'Restore motion':'Reduce motion'}</button></div><label className="volume-setting"><span>Soundscape volume</span><input type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))} aria-label="Soundscape volume"/><span>{Math.round(volume*100)}%</span></label><div className="map-route">{worlds.map((w,i)=><button key={w.id} className={i===index?'current':''} onClick={()=>{close();navigate(w.id);}}><span>{w.icon}</span><div><b>{w.name}</b><small>{w.subtitle}</small></div><ArrowRight size={17}/></button>)}</div><p className="map-hint"><Map size={14}/> Scroll or swipe to travel. Arrow controls let you jump.</p></div>}
        {modal==='briefing'&&<div className="briefing"><div className="briefing-identity">{manifest.portrait&&<img src="/assets/portrait.webp" alt="Darshan Krishna"/>}<div><span className="eyebrow">DEVELOPER / DEVREL / COMMUNITY BUILDER</span><h3>{profile.name}</h3><p>{profile.introduction}</p></div></div><div className="briefing-job"><span className="eyebrow">CURRENTLY</span><h3>{profile.role}</h3><p>{profile.employer} · {profile.dates}</p></div><h3>Products I've built</h3><div className="briefing-products">{projects.map((p,i)=><button key={p.id} onClick={()=>setModal(`project-${i}`)}><b>{p.name}</b><p>{p.summary}</p><ArrowUpRight size={18}/></button>)}</div><h3>Community, in numbers</h3><div className="briefing-stats">{communityStats.map(s=><div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div><p>{profile.philosophy}</p><div className="briefing-actions"><a className="button" href={`mailto:${profile.email}`}>Get in touch<ArrowUpRight size={15}/></a><a className="button secondary" href={profile.resumeUrl}><FileText size={15}/> View Resume</a></div></div>}
        {modal==='community'&&<div className="community-detail"><span className="eyebrow">FOUNDER / KROWDKRAFT</span><h3>Technology is only half the story.</h3><p>{profile.philosophy}</p><div className="briefing-stats">{communityStats.map(s=><div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div><h3>Across the ecosystem</h3><ul className="role-list">{ecosystemRoles.map(r=><li key={r}>{r}</li>)}</ul><p>Talks and training across GitHub, Postman, AWS Cloud and Blockchain.</p>{communityMemories.length>0&&<div className="memory-wall">{communityMemories.map((m,i)=><MemoryFrame key={m.image} memory={m} index={i}/>)}</div>}<a className="text-button" href={profile.socials[0].url} target="_blank" rel="noreferrer">Connect on LinkedIn<ArrowUpRight size={15}/></a></div>}
        {modal==='work'&&<div><span className="eyebrow">{profile.employer} / {profile.dates}</span><h3>{profile.role}</h3><p>Developing and maintaining business rules on JLL's NextGen data governance platform and automating data-quality workflows.</p><ul className="role-list"><li>Automation scripts for data-quality workflows</li><li>QA validation scripts in Databricks</li><li>Dashboard and feature testing</li><li>PySpark, SQL, Databricks, Power BI and Python</li></ul><p>My professional direction is deliberate: developer relations and advocacy, alongside building technical products and developer communities.</p></div>}
        {modal==='agents'&&<div className="agent-detail"><GitBranch size={40}/><h3>I still build. My toolchain just got a little more agentic.</h3><p>Programming, product thinking and technical judgment come first. AI-assisted development helps move from intent to implementation, with tool boundaries, review and validation.</p><div className="agent-terminal"><p>&gt; intent: build something useful</p><p>&gt; tools: Python / SQL / TypeScript / MCPs</p><p>&gt; assistant: Codex connected</p><p>&gt; human: review + test + decide</p><p className="terminal-success">&gt; Gundu: apparently that's his PA now.</p></div></div>}
        {modal?.startsWith('project-')&&<ProjectWalkthrough key={modal} index={Number(modal.split('-')[1])}/>}
        {modal==='game'&&<ArcadeGame/>}
        {modal==='anime'&&<AnimeArchive/>}
        {(modal==='briefing'||modal==='community')&&<div className="dialog-contact"><span>{profile.email}</span><button className="icon-button" onClick={()=>void copyEmail()} aria-label="Copy email address">{copied?<Check size={17}/>:<Copy size={17}/>}</button>{copied&&<span role="status">Copied</span>}</div>}
      </Dialog>}
    </>}
    <AnalyticsPrivacy/>
  </div>;
}
