// Original musical direction. MIDI notes, tempo and environmental layers are editable here.
export type Soundscape = { name:string; bpm:number; root:number; melody:number[]; chords:number[]; wave:OscillatorType; air:number; filter:number; rhythm:boolean; environment:'room'|'engine'|'night'|'water'|'arcade'|'fire'|'cinema' };
export const soundscapes:Soundscape[] = [
  {name:'Darshan’s universe',bpm:72,root:48,melody:[12,19,24,16,19,14,12,7],chords:[0,5,9,7],wave:'sine',air:.012,filter:600,rhythm:false,environment:'room'},
  {name:'DevLab / thinking in circuits',bpm:96,root:45,melody:[12,19,15,22,19,24,15,19],chords:[0,7,3,5],wave:'triangle',air:.008,filter:850,rhythm:true,environment:'room'},
  {name:'Projects / idea to system',bpm:108,root:50,melody:[12,14,19,21,26,21,19,14],chords:[0,5,7,2],wave:'triangle',air:.008,filter:1100,rhythm:true,environment:'room'},
  {name:'DevRel City / better together',bpm:88,root:48,melody:[16,19,24,21,19,16,14,19],chords:[0,5,9,7],wave:'sine',air:.016,filter:950,rhythm:true,environment:'room'},
  {name:'The Road / breeze and birdsong',bpm:78,root:43,melody:[12,19,24,21,19,14,12,7],chords:[0,5,9,7],wave:'triangle',air:.03,filter:800,rhythm:false,environment:'engine'},
  {name:'Arcade / BotLifeMatters',bpm:120,root:45,melody:[12,19,24,19,15,22,27,22],chords:[0,3,5,7],wave:'square',air:.006,filter:1800,rhythm:true,environment:'arcade'},
  {name:'Campfire / wood fire and night air',bpm:60,root:41,melody:[12,19,16,24,21,19,16,7],chords:[0,5,9,7],wave:'sine',air:.027,filter:1100,rhythm:false,environment:'fire'},
  {name:'Midnight ghats / headlights in the mist',bpm:58,root:38,melody:[12,19,14,15,19,22,15,14],chords:[0,3,5,0],wave:'sine',air:.03,filter:480,rhythm:false,environment:'night'},
  {name:'Vatadahosahalli / morning water',bpm:64,root:53,melody:[12,19,24,26,21,19,16,14],chords:[0,5,9,7],wave:'sine',air:.03,filter:1600,rhythm:false,environment:'water'},
  {name:'Anime Archive / other universes',bpm:76,root:50,melody:[12,19,15,22,24,22,19,15],chords:[0,3,7,5],wave:'triangle',air:.014,filter:850,rhythm:true,environment:'cinema'},
];
export function soundscapeIndex(world:number,roadBeat:number,archive=false){return archive?9:world<=3?0:world===4?(roadBeat===1?7:roadBeat===2?8:4):Math.max(0,Math.min(6,world));}
export function midiFrequency(note:number){return 440*Math.pow(2,(note-69)/12);}

export function hasMusic(index:number){return ![4,6,7,8].includes(index);}
