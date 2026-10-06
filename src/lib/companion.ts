export type GunduState = 'idle' | 'walking' | 'running' | 'pointing' | 'talking' | 'sitting' | 'sleeping' | 'typing' | 'helmet' | 'microphone' | 'gaming' | 'campfire' | 'annoyed' | 'surprised' | 'waving' | 'peeking' | 'stretching' | 'dancing' | 'quacking' | 'warming';
export function companionState(input: { world: number; idle: number; speed: number; clicks: number }): GunduState {
  if(input.clicks>=5)return 'annoyed';
  if(input.speed>1.5)return 'running';
  if(input.speed>.015)return 'walking';
  if(input.idle>=60)return 'sleeping';
  if(input.world===6&&input.idle>=5&&input.idle<60&&Math.floor((input.idle-5)/10)%3!==2)return 'warming';
  if(input.idle>=10)return (['waving','dancing','stretching','peeking'] as GunduState[])[Math.floor((input.idle-10)/5)%4];
  return (['idle','typing','pointing','microphone','helmet','gaming','campfire'] as GunduState[])[input.world] ?? 'idle';
}
export function maySpeak(now: number, last: number): boolean { return now-last>=12000; }
export const bootActions:GunduState[]=['waving','dancing','peeking','stretching','sitting','quacking'];
export function nextBootAction(previous:GunduState,random:number):GunduState{const choices=bootActions.filter(s=>s!==previous);return choices[Math.min(choices.length-1,Math.floor(Math.max(0,Math.min(.999,random))*choices.length))];}
export function actionDelay(random:number){return 3000+Math.max(0,Math.min(1,random))*2000;}
