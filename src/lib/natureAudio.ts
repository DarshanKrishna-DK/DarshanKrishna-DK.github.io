export const natureLayers=['forest-birds','tree-breeze','wood-fire','forest-insects'] as const;
export function natureMix(theme:number):readonly number[]{
  return theme===4?[.48,.28,0,0]:theme===7?[0,.32,0,.12]:theme===8?[.30,.16,0,.035]:theme===6?[0,.14,.53,.09]:[0,0,0,0];
}
// Overlap the head and tail in PCM so compressed-file boundaries never click.
export function seamlessBuffer(context:BaseAudioContext,input:AudioBuffer){
  const overlap=Math.min(Math.floor(input.sampleRate*2),Math.floor(input.length/4));
  const out=context.createBuffer(input.numberOfChannels,input.length-overlap,input.sampleRate);
  for(let channel=0;channel<input.numberOfChannels;channel++){
    const source=input.getChannelData(channel),target=out.getChannelData(channel);target.set(source.subarray(0,out.length));
    for(let i=0;i<overlap;i++){const phase=i/overlap*Math.PI/2;target[i]=source[input.length-overlap+i]*Math.cos(phase)+source[i]*Math.sin(phase);}
  }return out;
}
export class NatureAudio {
  private theme=0;private disposed=false;private requests=new Map<string,AbortController>();
  private layers=new Map<string,{buffer:AudioBuffer;gain:GainNode;source:AudioBufferSourceNode|null;stop:ReturnType<typeof setTimeout>|null}>();
  constructor(private context:AudioContext,private output:AudioNode){}
  preload(){for(const name of natureLayers){if(this.layers.has(name)||this.requests.has(name))continue;const abort=new AbortController();this.requests.set(name,abort);const timeout=setTimeout(()=>abort.abort(),15000);
    void fetch(`/assets/audio/${name}.mp3`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Ambient file unavailable');return r.arrayBuffer();}).then(b=>this.context.decodeAudioData(b)).then(decoded=>{
      if(this.disposed)return;const buffer=seamlessBuffer(this.context,decoded),gain=this.context.createGain();gain.gain.value=0;gain.connect(this.output);this.layers.set(name,{buffer,gain,source:null,stop:null});this.setTheme(this.theme);
    }).catch(()=>{/* The procedural air layer still works if a file is unavailable. */}).finally(()=>{clearTimeout(timeout);this.requests.delete(name);});
  }}
  setTheme(theme:number){this.theme=theme;if(natureMix(theme).some(Boolean))this.preload();const levels=natureMix(theme),now=this.context.currentTime;
    this.layers.forEach((layer,name)=>{const level=levels[natureLayers.indexOf(name as typeof natureLayers[number])];if(layer.stop){clearTimeout(layer.stop);layer.stop=null;}
      if(level&&!layer.source){const source=this.context.createBufferSource();source.buffer=layer.buffer;source.loop=true;source.connect(layer.gain);source.start(now,Math.random()*Math.min(9,layer.buffer.duration/3));layer.source=source;}
      layer.gain.gain.cancelAndHoldAtTime(now);layer.gain.gain.linearRampToValueAtTime(level,now+1.6);
      if(!level&&layer.source)layer.stop=setTimeout(()=>{layer.source?.stop();layer.source?.disconnect();layer.source=null;layer.stop=null;},1700);
    });
  }
  get ready(){return this.layers.size;}
  dispose(){this.disposed=true;this.requests.forEach(a=>a.abort());this.layers.forEach(l=>{if(l.stop)clearTimeout(l.stop);l.source?.stop();l.source?.disconnect();l.gain.disconnect();});this.layers.clear();}
}
