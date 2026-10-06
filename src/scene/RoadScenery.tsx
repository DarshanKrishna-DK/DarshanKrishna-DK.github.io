import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, Color, Float32BufferAttribute, PlaneGeometry, RepeatWrapping, ShaderMaterial, Shape, ShapeGeometry, SRGBColorSpace } from 'three';
import { Instances, type Instance } from './Instances';
import { ARCH, EXIT_Z } from '../lib/routeLayout';
import { ArchPortal } from './ArchPortal';
import { createRoadGeometry, roadCenter } from './roadGeometry';
import { useMotionTime } from './Motion';
import { LeafCanopies } from './LeafCanopies';
import { LightPool } from './Materials';

const random=(n:number)=>{const r=Math.sin(n*127.1+311.7)*43758.5453;return r-Math.floor(r);};
const smooth=(a:number,b:number,n:number)=>{const t=Math.max(0,Math.min(1,(n-a)/(b-a)));return t*t*(3-2*t);};
export const lakeShore=(z:number)=>9.8+Math.sin(z*.19)*1.3+Math.sin(z*.43)*.45-smooth(-5,9,z)*3;
export function roadGroundHeight(x:number,z:number,lake:boolean){
  const edge=lake?Math.abs(x+2)-lakeShore(z):Math.abs(x-roadCenter(z))-2.1;
  if(edge<0)return lake?-2.35:-1.69;
  const detail=Math.sin(x*.28+z*.17)*Math.cos(z*.24)+Math.sin(x*.64-z*.35)*.28;
  return -1.64+smooth(0,1.5,edge)*.18+Math.pow(Math.max(0,edge-2)*.21,1.3)*(1.1+detail*.3);
}

function useGroundMap(){
  const map=useMemo(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!,pixels=ctx.createImageData(256,256);for(let y=0;y<256;y++)for(let x=0;x<256;x++){const n=random(x+y*257),s=.82+n*.32,i=(x+y*256)*4;pixels.data[i]=s*137;pixels.data[i+1]=s*141;pixels.data[i+2]=s*121;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(22,18);t.anisotropy=4;return t;},[]);
  useEffect(()=>()=>map.dispose(),[map]);return map;
}

function Ground({lake,night}:{lake:boolean;night:boolean}){
  const map=useGroundMap();const geometry=useMemo(()=>{const g=new PlaneGeometry(110,60,132,100);g.rotateX(-Math.PI/2);g.translate(0,0,-20);const p=g.attributes.position,colors:number[]=[];for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=roadGroundHeight(x,z,lake);p.setY(i,h);const edge=lake?Math.abs(x+2)-lakeShore(z):Math.abs(x-roadCenter(z))-2.1;const soil=new Color('#827d67'),green=new Color(night?'#46564b':'#687556');soil.lerp(green,smooth(.15,3,edge));soil.multiplyScalar(.83+.17*Math.sin(x*.71+z*.3)*Math.cos(z*.39));colors.push(soil.r,soil.g,soil.b);}g.setAttribute('color',new Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;},[lake,night]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry}><meshStandardMaterial vertexColors map={map} bumpMap={map} bumpScale={.075} roughness={.98}/></mesh>;
}

function Hills({night}:{night:boolean}){
  const geometry=useMemo(()=>{const g=new PlaneGeometry(150,82,110,65);g.rotateX(-Math.PI/2);g.translate(0,0,-26);const p=g.attributes.position,colors:number[]=[];for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),edge=Math.max(0,Math.abs(x+2)-15);const peak=Math.exp(-Math.pow((Math.abs(x+2)-31)/15,2));const ridge=8+Math.sin(z*.065+.7)*4+Math.sin(z*.18+x*.09)*1.3+Math.sin(x*.36-z*.23)*.6;const y=-2+smooth(0,12,edge)*peak*ridge;p.setY(i,y);const color=new Color(night?'#324b55':'#566f68').multiplyScalar(.8+(y+2)*.025);colors.push(color.r,color.g,color.b);}g.setAttribute('color',new Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;},[night]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry}><meshStandardMaterial vertexColors roughness={1}/></mesh>;
}

function Woodland({lake,night}:{lake:boolean;night:boolean}){
  const forest=useMemo(()=>{const trunks:Instance[]=[],branches:Instance[]=[],leaves:Instance[]=[];for(let i=0;i<110;i++){
    const z=7-random(i+20)*50,side=i%2?1:-1;
    const x=lake?-2+side*(lakeShore(z)+1.4+random(i+40)*12):roadCenter(z)+side*((z>-3?10:5.2)+random(i+40)*13);
    const ground=roadGroundHeight(x,z,lake),h=2.8+random(i+7)*4.7,lean=(random(i+91)-.5)*.15;
    trunks.push({position:[x,ground+h/2,z],scale:[.055+h*.014,h,.055+h*.014],rotation:[lean,0,lean*.5],color:'#4d4838'});
    for(let j=0;j<7;j++){const a=j*2.399+i,spread=.35+random(i*9+j)*1.05,y=ground+h*(.63+j*.047),cx=x+Math.sin(a)*spread,cz=z+Math.cos(a)*spread;leaves.push({position:[cx,y,cz],scale:[.65+random(j+i)*.6,.3+random(j*4+i)*.55,.65+random(i+j*7)*.6],rotation:[i*.17,a,j*.27],color:(night?['#30473f','#253d39','#3a5145']:['#657b4e','#7c8f5c','#899960','#617952'])[(i+j)%(night?3:4)]});if(j<3)branches.push({position:[(x+cx)/2,y-.45,(z+cz)/2],scale:[.045,1.7,.045],rotation:[Math.cos(a)*.65,a,-Math.sin(a)*.65],color:'#4c4939'});}
  }return {trunks,branches,leaves};},[lake,night]);
  return <><Instances shape="trunk" items={forest.trunks}/><Instances shape="trunk" items={forest.branches}/><LeafCanopies items={forest.leaves}/></>;
}

function ShoreDetails({lake}:{lake:boolean}){
  const data=useMemo(()=>{const grass:Instance[]=[],rocks:Instance[]=[];for(let i=0;i<550;i++){const z=8-random(i+200)*51,side=i%2?1:-1;
    const x=lake?-2+side*(lakeShore(z)+.38+random(i+40)*3.5):roadCenter(z)+side*(2.6+random(i+40)*3.1);
    const y=roadGroundHeight(x,z,lake);grass.push({position:[x,y,z],scale:[.4+random(i)*.5,.17+random(i*7)*.42,.55],rotation:[0,random(i+2)*6,0],color:['#566247','#6f7553','#4b5d43'][i%3]});
    if(i%7===0)rocks.push({position:[x,y+.09,z],scale:[.16+random(i)*.45,.12+random(i+8)*.25,.25+random(i+10)*.35],rotation:[i,i*.7,i*.3],color:['#73776a','#606859','#878777'][i%3]});
  }return {grass,rocks};},[lake]);
  return <><Instances shape="grass" items={data.grass}/><Instances shape="rock" items={data.rocks}/></>;
}

function Lake(){
  const material=useRef<ShaderMaterial>(null),time=useMotionTime();const uniforms=useMemo(()=>({time:{value:0}}),[]);
  useFrame(({clock})=>{if(material.current)material.current.uniforms.time.value=time(clock);});
  return <mesh position={[-2,-1.62,-18]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[34,56,1,1]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={`varying vec3 world;void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`} fragmentShader={`
    uniform float time;varying vec3 world;
    void main(){
      float shore=9.8+sin(world.z*.19)*1.3+sin(world.z*.43)*.45-smoothstep(-5.,9.,world.z)*3.;
      if(abs(world.x+2.)>shore)discard;
      float a=world.x*.91+world.z*1.4+time*.22,b=world.x*2.7-world.z*.6+time*.31;
      vec3 normal=normalize(vec3(cos(a)*.016+cos(b)*.007,1.,sin(a*.8)*.013+sin(b)*.006));
      vec3 view=normalize(cameraPosition-world),r=reflect(-view,normal);
      float fresnel=.035+.965*pow(1.-max(dot(view,normal),0.),5.);
      vec3 sky=mix(vec3(.27,.33,.28),vec3(.13,.23,.27),smoothstep(0.,.6,r.y));
      float reflectedRidge=.08+sin(r.x*14.)*.025+sin(r.x*31.)*.012;
      float hill=1.-smoothstep(reflectedRidge-.025,reflectedRidge+.02,r.y);
      sky=mix(sky,vec3(.12,.20,.17),hill*.65);
      vec3 water=vec3(.045,.13,.14);
      float sunlight=pow(max(dot(r,normalize(vec3(.6,.32,-.6))),0.),190.);
      float smallRipples=sin(a*4.+sin(b))*sin(b*3.)*.004;
      vec3 color=mix(water,sky,.38+fresnel*.57)+smallRipples+sunlight*vec3(.55,.45,.27);
      gl_FragColor=vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`}/></mesh>;
}

function Asphalt({night}:{night:boolean}){
  const map=useGroundMap(),geometry=useMemo(createRoadGeometry,[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const marks=useMemo<Instance[]>(()=>Array.from({length:37},(_,i)=>{const z=5-i*1.35;return {position:[roadCenter(z),-1.56,z],scale:[.035,.008,.58],rotation:[0,Math.cos(z*.075)*.15,0],color:'#b4b29c'};}),[]);
  const edges=useMemo<Instance[]>(()=>Array.from({length:150},(_,i)=>{const z=5.8-Math.floor(i/2)*.69,side=i%2?1:-1;return {position:[roadCenter(z)+side*1.73,-1.558,z],scale:[.032,.006,.72],rotation:[0,Math.cos(z*.075)*.13,0],color:'#929b89'};}),[]);
  const posts=useMemo<Instance[]>(()=>Array.from({length:30},(_,i)=>{const z=2-Math.floor(i/2)*3.05,side=i%2?1:-1,x=roadCenter(z)+side*2.4;return {position:[x,roadGroundHeight(x,z,false)+.23,z],scale:[.09,.45,.09],color:i%3?'#8b907e':'#555b4f'};}),[]);
  return <><mesh geometry={geometry}><meshStandardMaterial map={map} bumpMap={map} bumpScale={.018} color={night?'#324147':'#465250'} roughness={night?.40:.64} metalness={.10}/></mesh><Instances items={marks}/><Instances items={edges}/><Instances items={posts}/></>;
}

function ValleyMist({night}:{night:boolean}){
  return <>{[-16,-29,-41].map((z,i)=><mesh key={z} position={[0,-.8+i*.28,z]}><planeGeometry args={[48,3.3]}/><shaderMaterial transparent depthWrite={false} uniforms={{tint:{value:new Color(night?'#9bb0bb':'#c1c7b5')},strength:{value:night?.07:.09}}} vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 v;uniform vec3 tint;uniform float strength;void main(){float a=pow(sin(v.x*3.14159)*sin(v.y*3.14159),3.)*strength;gl_FragColor=vec4(tint,a);\n#include <colorspace_fragment>\n}'}/></mesh>)}</>;
}

function StonePassage(){
  const bluff=useMemo(()=>{const shape=new Shape();shape.moveTo(-65,-1.75);for(let x=-65;x<=65;x+=2)shape.lineTo(x,8+Math.sin(x*.08)*3+Math.sin(x*.23)*.7);shape.lineTo(65,-1.75);shape.lineTo(ARCH.right,-1.75);shape.lineTo(ARCH.right,ARCH.spring);shape.absarc(ARCH.center,ARCH.spring,ARCH.radius,0,Math.PI,false);shape.lineTo(ARCH.left,-1.75);shape.closePath();return new ShapeGeometry(shape,32);},[]);
  useEffect(()=>()=>bluff.dispose(),[bluff]);
  const stones=useMemo<Instance[]>(()=>{const list:Instance[]=[];for(let i=0;i<21;i++){const a=i/20*Math.PI;list.push({position:[ARCH.center+Math.cos(a)*2.55,ARCH.spring+Math.sin(a)*2.55,EXIT_Z[4]-.15],scale:[.56,.50,.70],rotation:[i*.3,0,a],color:['#596357','#6d7565','#525f54'][i%3]});}for(const side of [-1,1])for(let i=0;i<6;i++)list.push({position:[ARCH.center+side*2.55,-1.4+i*.59,EXIT_Z[4]-.15],scale:[.55,.48,.74],rotation:[i*.15,side*.15,0],color:'#5c675a'});return list;},[]);
  return <><mesh geometry={bluff} position={[0,0,EXIT_Z[4]+.006]}><meshStandardMaterial color="#536151" roughness={1}/></mesh><Instances shape="rock" items={stones}/><ArchPortal z={EXIT_Z[4]+.02} color="#a291cb"/></>;
}

function LakesideSeat(){const x=9.3,z=-7.5,y=roadGroundHeight(x,z,true);return <group position={[x,y,z]} rotation={[0,-.65,0]}>
  <Instances items={[0,1,2].map(i=>({position:[0,.54,-.21+i*.19],scale:[1.85,.065,.15],color:'#77705a'}))}/>
  <Instances items={[0,1].map(i=>({position:[0,.92+i*.2,-.35],scale:[1.85,.14,.075],color:'#8c8064'}))}/>
  <Instances items={[-.66,.66].flatMap(x=>[{position:[x,.26,0] as [number,number,number],scale:[.06,.52,.6] as [number,number,number],color:'#4d554e'},{position:[x,.78,-.39] as [number,number,number],scale:[.06,.82,.06] as [number,number,number],color:'#4d554e'}])}/>
 </group>;}

function HillsideCascade(){
  const ref=useRef<ShaderMaterial>(null),time=useMotionTime(),y=roadGroundHeight(9.8,-20,false);
  const uniforms=useMemo(()=>({time:{value:0}}),[]);
  useFrame(({clock})=>{if(ref.current)ref.current.uniforms.time.value=time(clock);});
  return <group position={[9.8,y+1.8,-20]}>
    <Instances shape="rock" items={[-1,1].map(side=>({position:[side*.65,0,-.3],scale:[.75,2.2,.8],rotation:[.1,side*.4,side*.1],color:'#5b695b'}))}/>
    <mesh position={[0,0,.51]}><planeGeometry args={[1.3,3.7]}/><shaderMaterial ref={ref} transparent depthWrite={false} uniforms={uniforms} vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 v;uniform float time;void main(){float x=v.x-.5-sin(v.y*6.)*.05;float edge=1.-smoothstep(.15,.43,abs(x));float strands=.55+.18*sin(v.x*63.+sin(v.y*18.+time*3.))+.12*sin(v.x*113.+v.y*9.+time*2.);float fade=smoothstep(0.,.08,v.y)*(1.-smoothstep(.92,1.,v.y));gl_FragColor=vec4(.66,.74,.71,edge*strands*fade*.75);\n#include <colorspace_fragment>\n}'}/></mesh>
  </group>;
}

export function RoadEnvironment({beat}:{beat:number}){
  const lake=beat===2,night=beat===1;
  return <group><Hills night={night}/><Ground lake={lake} night={night}/><Woodland lake={lake} night={night}/><ShoreDetails lake={lake}/>{lake?<><Lake/><LakesideSeat/></>:<Asphalt night={night}/>}<ValleyMist night={night}/><StonePassage/>{beat===0&&<HillsideCascade/>}{night&&<LightPool position={[1.4,-1.552,-3]} size={11} color="#c4d4c3" opacity={.18}/>}</group>;
}
