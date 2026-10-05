import { hasMusic, midiFrequency, soundscapeIndex, soundscapes } from '../data/soundscapes';
import { AudienceCue } from './audienceCue';
import { NatureAudio } from './natureAudio';
export function soundConsent(choice:'sound'|'silent',gesture:boolean){return choice==='sound'&&gesture;}
type Bus={gain:GainNode;pad:OscillatorNode[];noise:AudioBufferSourceNode};
// Original generative score. Nothing starts before a gesture.
export class Ambience {
  private context:AudioContext|null=null;private master:GainNode|null=null;private analyser:AnalyserNode|null=null;
  private buses=new Map<number,Bus>();private noise:AudioBuffer|null=null;private timer:ReturnType<typeof setInterval>|null=null;
  private audienceCue=new AudienceCue();private audienceBursts=0;private nature:NatureAudio|null=null;
  private world=0;private roadBeat=0;private archive=false;private current=0;private muted=true;private volume=.65;
  private next=0;private step=0;private samples=new Float32Array(256);
  private crowd:GainNode|null=null;private clapNoise:AudioBuffer|null=null;
  private audienceAnalyser:AnalyserNode|null=null;private audienceSamples=new Float32Array(256);private audienceBuffer:AudioBuffer|null=null;private audienceSource:AudioBufferSourceNode|null=null;
  async start(){
    if(!this.context){
      const c=new AudioContext({latencyHint:'interactive',sampleRate:32000});this.context=c;
      const master=c.createGain();master.gain.value=0;this.master=master;
      const limiter=c.createDynamicsCompressor();limiter.threshold.value=-15;limiter.knee.value=18;limiter.ratio.value=4;
      this.nature=new NatureAudio(c,master);
      this.analyser=c.createAnalyser();this.analyser.fftSize=512;
      master.connect(limiter).connect(this.analyser).connect(c.destination);
      this.crowd=c.createGain();this.crowd.gain.value=0;this.audienceAnalyser=c.createAnalyser();this.audienceAnalyser.fftSize=512;this.crowd.connect(this.audienceAnalyser).connect(master);
      void this.loadAudience(c);
      this.clapNoise=c.createBuffer(1,c.sampleRate*.35,c.sampleRate);const clap=this.clapNoise.getChannelData(0);for(let i=0;i<clap.length;i++)clap[i]=Math.random()*2-1;
      const noise=c.createBuffer(1,c.sampleRate*4,c.sampleRate);const channel=noise.getChannelData(0);let previous=0;
      for(let i=0;i<channel.length;i++){previous=(previous+(Math.random()*2-1)*.025)/1.025;channel[i]=previous*4;}
      this.noise=noise;
      this.current=soundscapeIndex(this.world,this.roadBeat,this.archive);this.next=c.currentTime+.06;
      this.activate();this.timer=setInterval(()=>this.schedule(),100);
    }
    await this.context.resume();if(this.context.state!=='running')throw new Error('Audio context could not start');
    this.muted=false;this.master!.gain.setTargetAtTime(this.volume,this.context.currentTime,.18);this.schedule();
  }
  private bus(index:number){
    const existing=this.buses.get(index);if(existing)return existing;
    const c=this.context!;const p=soundscapes[index];const gain=c.createGain();gain.gain.value=0;gain.connect(this.master!);
    const delay=c.createDelay(1);delay.delayTime.value=.27;const wet=c.createGain();wet.gain.value=.16;
    gain.connect(delay).connect(wet).connect(this.master!);
    const pad=(hasMusic(index)?[0,7]:[]).map((offset,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=midiFrequency(p.root+offset);o.detune.value=i?4:-4;
      const amplitude=c.createGain();amplitude.gain.value=p.environment==='night'?.025:.04;o.connect(amplitude).connect(gain);o.start();return o;});
    const noise=c.createBufferSource();noise.buffer=this.noise;noise.loop=true;
    const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=p.filter;const air=c.createGain();air.gain.value=p.air;
    noise.connect(filter).connect(air).connect(gain);noise.start();
    const bus={gain,pad,noise};this.buses.set(index,bus);return bus;
  }
  private activate(){if(!this.context)return;const c=this.context;this.bus(this.current);
    this.buses.forEach((b,i)=>{b.gain.gain.cancelAndHoldAtTime(c.currentTime);b.gain.gain.linearRampToValueAtTime(i===this.current?1:0,c.currentTime+1.6);});
    this.nature?.setTheme(this.current);this.step=0;this.next=c.currentTime+.04;
  }
  private change(){const index=soundscapeIndex(this.world,this.roadBeat,this.archive);if(index!==this.current){this.current=index;this.activate();}}
  setWorld(world:number){this.world=world;this.audienceCue.enter(world===3,this.context?.currentTime??0);this.change();if(world>=3)this.nature?.preload();if(this.context&&this.crowd&&world!==3){this.crowd.gain.setTargetAtTime(0,this.context.currentTime,.04);this.audienceSource?.stop(this.context.currentTime+.12);}}
  setRoadBeat(beat:number){this.roadBeat=beat;this.change();}
  setArchive(archive:boolean){this.archive=archive;this.change();}
  setVolume(volume:number){this.volume=Math.max(0,Math.min(1,volume));if(this.master&&this.context&&!this.muted)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.1);}
  setMuted(muted:boolean){this.muted=muted;if(this.context&&this.master)this.master.gain.setTargetAtTime(muted?0:this.volume,this.context.currentTime,.12);}
  quack(){const c=this.context;if(!c||this.muted||c.state!=='running'||!this.master)return;const start=c.currentTime;
    for(let i=0;i<2;i++){const o=c.createOscillator(),filter=c.createBiquadFilter(),gain=c.createGain();const at=start+i*.19;o.type='sawtooth';o.frequency.setValueAtTime(320-i*30,at);o.frequency.exponentialRampToValueAtTime(125,at+.17);filter.type='bandpass';filter.frequency.value=1100;filter.Q.value=2.7;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.12,at+.025);gain.gain.exponentialRampToValueAtTime(.0001,at+.18);o.connect(filter).connect(gain).connect(this.master);o.start(at);o.stop(at+.20);o.onended=()=>{o.disconnect();filter.disconnect();gain.disconnect();};}
  }
  status(){let rms=0,audienceRms=0;if(this.analyser){this.analyser.getFloatTimeDomainData(this.samples);rms=Math.sqrt(this.samples.reduce((sum,v)=>sum+v*v,0)/this.samples.length);}if(this.audienceAnalyser&&!this.muted){this.audienceAnalyser.getFloatTimeDomainData(this.audienceSamples);audienceRms=Math.sqrt(this.audienceSamples.reduce((sum,v)=>sum+v*v,0)/this.audienceSamples.length);}return {state:this.context?.state??'closed',rms,audienceRms,audienceReady:Boolean(this.audienceBuffer),audienceBursts:this.audienceBursts,natureReady:this.nature?.ready??0,music:hasMusic(this.current),theme:this.world===3&&!this.archive?'Darshan universe / audience':soundscapes[this.current].name};}
  private async loadAudience(context:AudioContext){try{const response=await fetch('/assets/audio/auditorium-applause.mp3');if(!response.ok)return;const data=await response.arrayBuffer();const buffer=await context.decodeAudioData(data);if(this.context!==context)return;this.audienceBuffer=buffer;}catch{/* The original synthesized crowd remains available offline. */}}
  private applause(time:number){const c=this.context;if(!c||!this.crowd||!this.clapNoise||this.muted)return;this.audienceBursts++;this.crowd.gain.setTargetAtTime(1,time,.08);
    if(this.audienceBuffer){const source=c.createBufferSource(),gain=c.createGain();source.buffer=this.audienceBuffer;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.62,time+.5);gain.gain.setValueAtTime(.62,time+4);gain.gain.exponentialRampToValueAtTime(.0001,time+6.5);source.connect(gain).connect(this.crowd);source.start(time,Math.min(3,Math.max(0,this.audienceBuffer.duration-7)));source.stop(time+6.6);this.audienceSource=source;source.onended=()=>{source.disconnect();gain.disconnect();if(this.audienceSource===source)this.audienceSource=null;};}
    
    for(let i=0;i<(this.audienceBuffer?0:44);i++){const n=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),pan=c.createStereoPanner();const at=time+i*.07+Math.random()*.05;n.buffer=this.clapNoise;filter.type='bandpass';filter.frequency.value=1100+Math.random()*1300;filter.Q.value=.6;pan.pan.value=Math.sin(i*3)*.8;gain.gain.setValueAtTime(.038+Math.random()*.024,at);gain.gain.exponentialRampToValueAtTime(.0001,at+.11);n.connect(filter).connect(gain).connect(pan).connect(this.crowd);n.start(at);n.stop(at+.13);n.onended=()=>{n.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};}
    // Layered vowel formants make a soft, original crowd "woo", with stereo spread.
    for(let i=0;i<6;i++){const o=c.createOscillator(),gain=c.createGain(),pan=c.createStereoPanner();const at=time+i*.16,root=135+i*17;o.type='sawtooth';o.frequency.setValueAtTime(root,at);o.frequency.linearRampToValueAtTime(root*1.38,at+.32);o.frequency.linearRampToValueAtTime(root*1.1,at+.95);pan.pan.value=Math.sin(i*4)*.85;gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(.044,at+.18);gain.gain.exponentialRampToValueAtTime(.0001,at+1.05);const filters=[380,860,2250].map((frequency,j)=>{const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=j===0?2:4;f.frequency.setValueAtTime(frequency,at);f.frequency.linearRampToValueAtTime(frequency*(j===0?.8:1.1),at+.6);o.connect(f).connect(gain);return f;});gain.connect(pan).connect(this.crowd);o.start(at);o.stop(at+1.1);o.onended=()=>{o.disconnect();filters.forEach(f=>f.disconnect());gain.disconnect();pan.disconnect();};}
  }
  private note(frequency:number,time:number,length:number,level:number,wave:OscillatorType='sine',pan=0){
    const c=this.context!;const o=c.createOscillator();const envelope=c.createGain();const stereo=c.createStereoPanner();stereo.pan.value=pan;
    o.type=wave;o.frequency.value=frequency;
    envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(level,time+.025);envelope.gain.exponentialRampToValueAtTime(.0001,time+length);
    o.connect(envelope).connect(stereo).connect(this.bus(this.current).gain);o.start(time);o.stop(time+length+.05);
    o.onended=()=>{o.disconnect();envelope.disconnect();stereo.disconnect();};return o;
  }
  private percussion(time:number,fire=false){const c=this.context!;const n=c.createBufferSource();n.buffer=this.noise;
    const filter=c.createBiquadFilter();filter.type='highpass';filter.frequency.value=fire?2200:3800;
    const gain=c.createGain();gain.gain.setValueAtTime(fire?.075:.07,time);gain.gain.exponentialRampToValueAtTime(.0001,time+.09);
    n.connect(filter).connect(gain).connect(this.bus(this.current).gain);n.start(time,Math.random());n.stop(time+.1);n.onended=()=>{n.disconnect();filter.disconnect();gain.disconnect();};
  }
  private schedule(){const c=this.context;if(!c||c.state!=='running'||document.hidden)return;
    if(this.audienceCue.poll(c.currentTime,!this.muted&&this.world===3&&!this.archive))this.applause(c.currentTime+.02);
    if(this.muted)return;
    // Outdoor scenes contain no pads, melody, bass, or rhythmic engine notes.
    if(!hasMusic(this.current))return;
    if(this.next<c.currentTime)this.next=c.currentTime+.03;
    const p=soundscapes[this.current];const beat=60/p.bpm;
    while(this.next<c.currentTime+.25){const s=this.step;const chord=p.chords[Math.floor(s/16)%4];const bus=this.bus(this.current);
      if(s%16===0){bus.pad.forEach((o,i)=>o.frequency.setTargetAtTime(midiFrequency(p.root+chord+(i?7:0)),this.next,.8));}
      const sparse=p.environment==='night'||p.environment==='fire';
      if(s%(sparse?4:2)===0){const n=p.melody[Math.floor(s/2)%p.melody.length];this.note(midiFrequency(p.root+n),this.next,sparse?2.4:beat*1.8,p.wave==='square'?.038:.105,p.wave,Math.sin(s*.7)*.55);}
      if(p.rhythm&&s%4===0){const kick=this.note(100,this.next,.22,.16,'sine');kick.frequency.exponentialRampToValueAtTime(35,this.next+.18);this.note(midiFrequency(p.root+chord-12),this.next,.6,.085,'triangle');}
      if(p.rhythm&&s%2===1)this.percussion(this.next);
      if(p.environment==='fire'&&s%3===0)this.percussion(this.next,true);
      if(p.environment==='water'&&s%12===4){const bird=this.note(1450,this.next,.3,.028,'sine',.7);bird.frequency.exponentialRampToValueAtTime(2250,this.next+.2);}
      if(p.environment==='engine'||p.environment==='night')this.note(p.environment==='engine'?48+Math.sin(s*.3)*4:36,this.next,.6,.075,'triangle');
      this.next+=beat/2;this.step++;
    }
  }
  visibility(hidden:boolean){if(!this.context)return;if(hidden)void this.context.suspend();else if(!this.muted)void this.context.resume();}
  dispose(){this.nature?.dispose();this.audienceSource?.stop();if(this.timer)clearInterval(this.timer);this.buses.forEach(b=>{b.pad.forEach(o=>o.stop());b.noise.stop();});this.buses.clear();void this.context?.close();this.context=null;}
}
