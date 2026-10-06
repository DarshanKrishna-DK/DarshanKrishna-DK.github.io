import { useState } from 'react';
import { ArrowRight, RotateCcw, Check, ShieldCheck, GitBranch, Mic, LockKeyhole } from 'lucide-react';
import { projects } from '../data/projects';
import { nextStage } from '../lib/walkthrough';

export function ProjectWalkthrough({index}:{index:number}){
  const p=projects[index];const [step,setStep]=useState(0);const [view,setView]=useState<'flow'|'system'>('flow');const [system,setSystem]=useState<'purpose'|'capabilities'|'image'>('purpose');
  const stage=p.stages[step];
  return <div className={`project-detail project-${p.id}`}>
    <aside className="project-overview">
      <div className="project-detail-intro"><img src={p.logo} alt={`${p.name} logo`}/><div><span className="eyebrow">{p.label}</span><h3>{p.headline}</h3><p>{p.summary}</p></div></div>
      <div className="project-switch" role="group" aria-label="Project view"><button aria-pressed={view==='flow'} onClick={()=>setView('flow')}>Walk through the flow</button><button aria-pressed={view==='system'} onClick={()=>setView('system')}>Behind the system</button></div>
      <div className="project-stack"><span className="eyebrow">BUILT WITH</span><p>{p.tech.join(' / ')}</p></div>
    </aside>
    <div className="project-workspace">
      {view==='flow'?<>
        <nav className="flow-steps" aria-label="Workflow stages">{p.stages.map((s,i)=><button key={s.title} className={i<=step?'complete':''} aria-current={i===step?'step':undefined} aria-label={`Step ${i+1}: ${s.title}`} onClick={()=>setStep(i)}><span>{i<step?<Check size={13}/>:String(i+1).padStart(2,'0')}</span><i/></button>)}</nav>
        <div className="flow-machine" aria-hidden="true"><div className="flow-input">{p.id==='sahay'?<Mic size={27}/>:p.id==='zuik'?<GitBranch size={27}/>:<LockKeyhole size={27}/>}<span>{p.id==='sahay'?'REQUIREMENT':p.id==='zuik'?'INTENT':'AGENT'}</span></div><div className="flow-wire"><i/><i/></div><div className="flow-core"><span>{p.name}</span><small>{step===p.stages.length-1?'FLOW COMPLETE':`STAGE 0${step+1}`}</small></div><div className="flow-wire"><i/><i/></div><div className="flow-output">{step===p.stages.length-1?<Check size={27}/>:<ShieldCheck size={27}/>}<span>{step===p.stages.length-1?'COMPLETE':'REVIEWABLE'}</span></div></div>
        <div className="stage-copy" aria-live="polite"><span className="eyebrow">STEP {step+1} / {p.stages.length}</span><h3>{stage.title}</h3><p>{stage.description}</p><code>{stage.code}</code></div>
        <div className="flow-actions"><button className="button secondary" onClick={()=>setStep(0)}><RotateCcw size={15}/> Replay</button><button className="button" onClick={()=>setStep(s=>nextStage(s,p.stages.length))} disabled={step===p.stages.length-1}>{step===p.stages.length-1?'Complete':'Next step'}<ArrowRight size={16}/></button></div>
        <p className="demo-note"><ShieldCheck size={13}/> Illustrative flow. No live transactions or vendor calls.</p>
      </>:<>
        <div className="system-tabs" role="group" aria-label="System details"><button aria-pressed={system==='purpose'} onClick={()=>setSystem('purpose')}>Purpose</button><button aria-pressed={system==='capabilities'} onClick={()=>setSystem('capabilities')}>Capabilities</button>{p.image&&<button aria-pressed={system==='image'} onClick={()=>setSystem('image')}>{p.id==='sahay'?'Architecture':'Interface'}</button>}</div>
        <div className="system-panel" key={system}>
          {system==='purpose'?<div className="problem-solution"><div><span className="eyebrow">THE PROBLEM</span><p>{p.problem}</p></div><div><span className="eyebrow">THE SOLUTION</span><p>{p.solution}</p></div></div>:system==='capabilities'?<><h3>What it brings together</h3><div className="capability-list">{p.capabilities.map(c=><span key={c}><Check size={13}/>{c}</span>)}</div><div className="mobile-project-stack"><span className="eyebrow">BUILT WITH</span><p>{p.tech.join(' / ')}</p></div></>:<figure className="project-asset"><img src={p.image} alt={p.id==='sahay'?'Sahay system architecture':'SwyftPay product interface'} loading="lazy"/><figcaption>{p.id==='sahay'?'Procurement architecture':'Product interface'}</figcaption></figure>}
        </div>
      </>}
    </div>
  </div>;
}
