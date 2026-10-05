export const AUDIENCE_DELAY=3;
export const AUDIENCE_DURATION=6.6;
export function applauseEnvelope(age:number){if(age<AUDIENCE_DELAY||age>AUDIENCE_DELAY+AUDIENCE_DURATION)return 0;return Math.min(1,(age-AUDIENCE_DELAY)/.6,(AUDIENCE_DELAY+AUDIENCE_DURATION-age)/1.3);}
export class AudienceCue {
  private since:number|null=null;private played=false;
  enter(active:boolean,now:number){if(!active){this.since=null;this.played=false;}else if(this.since===null){this.since=now;this.played=false;}}
  poll(now:number,audible:boolean){if(this.since===null||this.played||now-this.since<AUDIENCE_DELAY)return false;this.played=true;return audible;}
}
