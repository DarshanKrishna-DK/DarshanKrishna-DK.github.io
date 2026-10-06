import { useContext, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { SceneMotion } from './Motion';
import { arcadeScreenVisible } from '../lib/routeLayout';

// Official trailers stay on their publishers' players. No footage is copied.
export const gameClips=[
  {name:'PUBG',id:'aUZWZYshCgM',poster:'/assets/arcade/pubg.webp'},
  {name:'CS:GO',id:'edYCtaNueQY',poster:'/assets/arcade/csgo.webp'},
  {name:'MOBILE LEGENDS',id:'1WolDM3mnSY',poster:'/assets/arcade/mobile-legends.webp'},
];
export function MediaScreen({index,width,height,active,preload=false}:{index:number;width:number;height:number;active:boolean;preload?:boolean}){
  const group=useRef<Group>(null),element=useRef<HTMLDivElement|null>(null),{gl,size}=useThree(),reduced=useContext(SceneMotion);
  const isActive=useRef(active);isActive.current=active;const shouldLoad=active||preload;
  const corners=useRef([new Vector3(),new Vector3(),new Vector3(),new Vector3()]);
  useEffect(()=>{
    if(!shouldLoad||reduced||(size.width<761&&index!==1))return;
    const host=gl.domElement.parentElement;if(!host)return;
    const el=document.createElement('div'),frame=document.createElement('iframe');element.current=el;
    el.className='world-video-screen';el.setAttribute('aria-hidden','true');el.style.width='854px';el.style.height='480px';el.style.opacity='0';el.style.transition='opacity .5s';
    frame.title=`${gameClips[index].name} official trailer`;frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.allow='autoplay; encrypted-media';frame.tabIndex=-1;
    frame.src=`https://www.youtube-nocookie.com/embed/${gameClips[index].id}?autoplay=${reduced?0:1}&mute=1&controls=0&playsinline=1&loop=1&playlist=${gameClips[index].id}&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
    el.append(frame);host.append(el);
    const command=(func:string,args:unknown[]=[])=>frame.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'https://www.youtube-nocookie.com');
    let playing=false,ready=false;
    const listen=()=>frame.contentWindow?.postMessage(JSON.stringify({event:'listening',id:`world-screen-${index}`}),'https://www.youtube-nocookie.com');
    const playerReady=()=>{if(ready)return;ready=true;command('addEventListener',['onStateChange']);command('addEventListener',['onError']);command('mute');if(!document.hidden)command('playVideo');};
    const message=(event:MessageEvent)=>{if(event.source!==frame.contentWindow||event.origin!=='https://www.youtube-nocookie.com')return;try{const data=typeof event.data==='string'?JSON.parse(event.data):event.data;if(data?.event==='onReady'||data?.event==='initialDelivery')playerReady();if(data?.event==='onError'){el.style.opacity='0';el.dataset.playerState='error';}if((data?.event==='onStateChange'&&data.info===1)||(data?.event==='infoDelivery'&&data.info?.playerState===1)){ready=true;playing=true;el.style.opacity='1';el.dataset.playerState='playing';}}catch{/* Ignore unrelated player messages. */}};
    el.dataset.playerState='loading';const handshake=setInterval(()=>{if(!ready&&!playing)listen();},750);frame.addEventListener('load',listen);window.addEventListener('message',message);
    const visibility=()=>ready&&frame.contentWindow?.postMessage(JSON.stringify({event:'command',func:document.hidden||reduced?'pauseVideo':'playVideo',args:[]}), 'https://www.youtube-nocookie.com');
    document.addEventListener('visibilitychange',visibility);
    return()=>{clearInterval(handshake);document.removeEventListener('visibilitychange',visibility);frame.removeEventListener('load',listen);window.removeEventListener('message',message);el.remove();element.current=null;};
  },[shouldLoad,index,gl,reduced,size.width<761]);
  useFrame(({camera,size})=>{
    const el=element.current,g=group.current;if(!el||!g)return;if(!isActive.current||!arcadeScreenVisible(camera.position.z)){el.style.visibility='hidden';el.dataset.inRoom='false';return;}el.dataset.inRoom='true';g.updateWorldMatrix(true,false);
    const p=corners.current;p[0].set(-width/2,height/2,0);p[1].set(width/2,height/2,0);p[2].set(width/2,-height/2,0);p[3].set(-width/2,-height/2,0);
    for(const v of p){g.localToWorld(v);v.project(camera);v.x=(v.x+1)*size.width/2;v.y=(1-v.y)*size.height/2;}
    if(p.some(v=>v.z>1||v.z< -1)){el.style.visibility='hidden';return;}el.style.visibility='visible';
    const [a,b,c,d]=p,dx1=b.x-c.x,dx2=d.x-c.x,sx=a.x-b.x+c.x-d.x,dy1=b.y-c.y,dy2=d.y-c.y,sy=a.y-b.y+c.y-d.y,det=dx1*dy2-dx2*dy1;
    if(Math.abs(det)<.01)return;const u=(sx*dy2-dx2*sy)/det,v=(dx1*sy-sx*dy1)/det;
    el.style.transform=`matrix3d(${(b.x-a.x+u*b.x)/854},${(b.y-a.y+u*b.y)/854},0,${u/854},${(d.x-a.x+v*d.x)/480},${(d.y-a.y+v*d.y)/480},0,${v/480},0,0,1,0,${a.x},${a.y},0,1)`;
  });
  return <group ref={group}/>;
}
