import { Broadleaf, Moon, Reeds, Stars } from './ScenicPrimitives';

function LandscapeDefs({night=false}:{night?:boolean}){return <defs>
  <linearGradient id="atlas-sky" x2="0" y2="1"><stop stopColor={night?'#071023':'#29434f'}/><stop offset=".62" stopColor={night?'#182940':'#698b8b'}/><stop offset="1" stopColor={night?'#384754':'#c0baa0'}/></linearGradient>
  <linearGradient id="atlas-lake" x2="0" y2="1"><stop stopColor={night?'#283c4a':'#8daba8'}/><stop offset=".44" stopColor={night?'#142734':'#467a80'}/><stop offset="1" stopColor={night?'#0e1d28':'#204a55'}/></linearGradient>
  <linearGradient id="atlas-road" x2=".35" y2="1"><stop stopColor={night?'#182b39':'#6d8280'}/><stop offset=".5" stopColor={night?'#101e29':'#344f53'}/><stop offset="1" stopColor="#17242f"/></linearGradient>
  <linearGradient id="atlas-shore" x2=".7" y2="1"><stop stopColor={night?'#33433c':'#72866b'}/><stop offset="1" stopColor={night?'#101e26':'#253e3c'}/></linearGradient>
  <radialGradient id="atlas-sun"><stop stopColor="#f0d8a0" stopOpacity=".65"/><stop offset=".3" stopColor="#e8c48d" stopOpacity=".18"/><stop offset="1" stopColor="#e8c48d" stopOpacity="0"/></radialGradient>
</defs>}

function Ridges({night=false}:{night?:boolean}){return <>
  <path d="M0 488c143-117 217-34 326-126 86-73 120-32 166-57s52-46 74-22 66 43 99 87c121 104 230-54 320-39 79 13 129-81 195-58 90 32 140 4 260 107v320H0z" fill={night?'#293e50':'#678985'}/>
  <path d="M0 547c153-98 230-3 328-76s150-114 207-63c145 112 229 90 314-7s122-60 192-12c129 110 261 3 399 116v220H0z" fill={night?'#213647':'#487474'}/>
  <path d="M617 547c108-43 155-38 226-119s137-45 230-24c75 17 119 57 152 60s131-8 215 50v211H583z" fill={night?'#172f3b':'#345d61'}/>
  <path d="M876 446c21-12 19-35 47-35l41 14m101-7 39 17m-883-28 47-12 45 22" fill="none" stroke={night?'#526b77':'#93aaa0'} strokeWidth="3" opacity=".3"/>
</>}

function LakeWater({night=false}:{night?:boolean}){return <>
  <path d="M0 524q517-41 1011-14t429 1v389H0z" fill="url(#atlas-lake)"/>
  <path d="M540 544q328-47 900 0l-186 61-89-42-117 45-216-62-198 47z" fill={night?'#20333f':'#4e7d7d'} opacity=".3"/>
  <g className="atlas-water-lines" fill="none" stroke={night?'#96afb5':'#e1d9b4'} strokeLinecap="round">
    {Array.from({length:49},(_,i)=>{const y=548+i*5.8,x=620+((i*113)%820),w=16+((i*39)%115);return <path key={i} d={`M${x} ${y}q${w*.5} -2 ${w} 0`} opacity={.055+(i%5)*.027} strokeWidth={i%4===0?2:1}/>})}
  </g>
</>}

export function RoadLandscape({beat}:{beat:number}){
  const night=beat===1,lake=beat===2;
  return <>
    <LandscapeDefs night={night}/><path fill="url(#atlas-sky)" d="M0 0h1440v900H0z"/>
    {night?<><Stars count={110}/><Moon x={1134} y={206} r={24}/></>:<><ellipse cx="1095" cy="298" rx="380" ry="300" fill="url(#atlas-sun)"/><circle cx="1095" cy="298" r="32" fill="#e6d4a6" opacity=".62"/><g fill="none" stroke="#dfded0" strokeLinecap="round" opacity=".12"><path d="M674 217q153-33 337-2m158-29 199 1" strokeWidth="9"/><path d="M759 242q135-21 294-7m-425 73q127-14 221-2" strokeWidth="5"/></g></>}
    <Ridges night={night}/>
    {lake?<>
      <LakeWater/>
      <path d="M0 685q206-10 353 41t345 4c261-106 324-39 504 49 54 22 149 0 238-16v137H0z" fill="url(#atlas-shore)"/>
      <path d="M723 728c129-59 209-58 279-23s109 65 203 74" fill="none" stroke="#c0b993" strokeOpacity=".45" strokeWidth="3"/>
      <Broadleaf x={1391} y={769} s={2.4} fill="#264c4c" trunk="#385a50"/>
      <Broadleaf x={664} y={717} s={.74} fill="#396259"/>
      <g transform="translate(1090 762) rotate(-5)"><path d="m-68 5 139-3 3 16-139 2z" fill="#5a503e"/><path d="m-68-43 134-3 5 34-137 4z" fill="#87735b" stroke="#b39a70" strokeOpacity=".35"/><path d="m-55-9 9 50m96-52 6 45" stroke="#3e4540" strokeWidth="6"/><path d="M-65-24 68-28" stroke="#b1a078" strokeOpacity=".3"/></g>
      <g fill="none" stroke="#193b47" strokeWidth="2"><path d="m1020 352 10-5 10 5m45-20 9-5 9 4m-121 33 7-4 7 3"/></g>
    </>:<>
      <path d="M0 561c204-73 374 18 633 7 221-16 220-112 358-115 112 4 197 84 449 67v380H0z" fill={night?'#142a32':'#30564f'}/>
      <path d="M942 462c-141 50-32 92 60 139 111 56 4 99-82 130-129 45-165 91-189 169h642c-42-135-126-170-236-220-114-52 50-50-3-129-48-69-126-72-192-89" fill="url(#atlas-road)"/>
      <path d="M942 463c-140 50-30 93 61 138 111 56 3 100-83 130-129 45-165 91-189 169M956 465c58 15 130 28 177 86 53 79-111 77 3 129 110 50 194 85 237 220" fill="none" stroke={night?'#82918d':'#bdd0b6'} strokeWidth="2" opacity=".47"/>
      <path d="M949 465c-54 60 105 102 128 152 20 45-7 61-54 85-88 47-85 125-10 198" stroke="#c6c1a0" strokeWidth="3" strokeDasharray="26 33" strokeOpacity={night?.26:.5} fill="none"/>
      <path d="M978 505c-22 33 139 79 116 137s-120 61-132 118" stroke="#a4c6c2" strokeWidth="13" opacity=".055" fill="none"/>
      <path d="M938 464q-23 65 98 111M809 792l-43 81m489-76 42 68" stroke="#bed6cb" strokeOpacity=".12" strokeWidth="6" fill="none"/>
      {Array.from({length:16},(_,i)=>{const x=689+i*47,y=510+Math.sin(i*1.9)*18,s=.27+i%4*.06;return <Broadleaf key={i} x={x} y={y} s={s} fill={night?'#142e35':'#31584d'}/>})}
      <Broadleaf x={730} y={744} s={1.75} fill={night?'#0c242c':'#20473f'}/><Broadleaf x={1414} y={805} s={2.75} fill={night?'#102830':'#23493f'}/>
      <Broadleaf x={640} y={660} s={1.05} fill={night?'#173039':'#396154'}/>
      {!night&&<g transform="translate(1213 540)"><path d="M0 0v141" stroke="#505f58" strokeWidth="6"/><path d="m-61-7 124-7 20 17-16 19-124 7z" fill="#68776a" stroke="#aeb796" strokeOpacity=".55"/><text x="7" y="12" textAnchor="middle" fill="#e0d9b8" fontSize="12" transform="rotate(-3)">TAKE THE LONG WAY →</text></g>}
    </>}
    <path className="atlas-mist-bank" d="M430 503q346-52 1010-1v129q-484-47-1010 24z" fill="url(#atlas-mist)" opacity={night?.7:.9}/>
    {Array.from({length:16},(_,i)=><Reeds key={i} x={490+i*65} y={849+i%3*28} s={.52+i%4*.18} color={night?'#26413f':'#4c7058'}/>)}
    {[0,1,2,3,4].map(i=><ellipse key={i} cx={650+i*180} cy={843+i%2*26} rx={12+i%3*11} ry={6+i%2*5} fill={night?'#253b3d':'#53695d'} transform={`rotate(${i*9-13} ${650+i*180} ${843+i%2*26})`}/>)}
  </>;
}

function CampChair({x,y,flip=false,person=false}:{x:number;y:number;flip?:boolean;person?:boolean}){return <g transform={`translate(${x} ${y}) scale(${flip?-1:1} 1)`}>
  {/* Three-quarter chair faces inward. Body sits above the seat, legs in front. */}
  <path d="M-44-54 4-69 13-14-36 2z" fill="#42595b" stroke="#8c9a89" strokeWidth="2"/>
  <path d="m-39 1 55-11 21 16-57 17z" fill="#4b6060" stroke="#819081"/>
  <path d="m-43-60 15 112m34-126 7 116m-48-46 72 50m-60 6 47-56" fill="none" stroke="#777c6c" strokeWidth="4" strokeLinecap="round"/>
  {person&&<>
    <path d="M-23-7 11-20 36 9 26 21-51 8z" fill="#293c48"/>
    <path d="M-28-53q12-7 33-5l9 39-46 17z" fill="#758277"/>
    <path d="m4-48 27 23 27-11" fill="none" stroke="#9d9f85" strokeWidth="9" strokeLinecap="round"/>
    <path d="m27 16 26 28m-63-30 37 40" fill="none" stroke="#2d414b" strokeWidth="15" strokeLinecap="round"/>
    <path d="m49 42 20 7m-45 7 18 7" stroke="#162933" strokeWidth="10" strokeLinecap="round"/>
    <circle cx="-9" cy="-78" r="16" fill="#ab8d73"/><path d="M-25-77c-9-26 30-33 31-10l-18-7-6 20z" fill="#242e34"/>
    <path d="m-19-60 15 2" stroke="#3c514f" strokeWidth="7"/>
  </>}
</g>}

export function NightCamp(){return <>
  <LandscapeDefs night/><path fill="url(#atlas-sky)" d="M0 0h1440v900H0z"/><Stars count={145}/><Moon x={1115} y={176} r={44}/>
  <Ridges night/><LakeWater night/>
  <g fill="none" stroke="#b7c6bf" strokeOpacity=".13" strokeLinecap="round">{Array.from({length:19},(_,i)=><path key={i} d={`M${1115-12-i*1.7} ${544+i*8}h${24+i*3.4}`} strokeWidth={i%3===0?3:1}/>)}</g>
  <path d="M0 692q277-23 450 38c258 75 363-72 542-61 157 0 297 71 448 23v208H0z" fill="url(#atlas-shore)"/>
  <path d="M657 734c156-23 271-104 367-56s266 59 416 16" stroke="#7b8070" strokeOpacity=".3" fill="none" strokeWidth="2"/>
  <Broadleaf x={1414} y={756} s={2.55} fill="#142d33"/><Broadleaf x={703} y={734} s={1.45} fill="#183436"/><Broadleaf x={623} y={718} s={1.1} fill="#1e3b3e"/>
  <ellipse className="atlas-firelight" cx="1110" cy="705" rx="263" ry="117" fill="url(#atlas-gold)"/>
  <CampChair x={955} y={697} person/><CampChair x={1310} y={709} flip/>
  <g transform="translate(1127 706)">
    {[0,1,2,3,4,5,6,7,8].map(i=>{const a=i/9*Math.PI*2;return <ellipse key={i} cx={Math.cos(a)*60} cy={Math.sin(a)*17+6} rx="15" ry="9" transform={`rotate(${i*31} ${Math.cos(a)*60} ${Math.sin(a)*17+6})`} fill={i%2?'#53615a':'#727265'} stroke="#929381" strokeOpacity=".15"/>})}
    <path d="m-40 3 74-12m-64-5 61 26" stroke="#423a31" strokeWidth="13" strokeLinecap="round"/><path d="m-33 2 61-10m-54-3 55 22" stroke="#ba753f" strokeWidth="2" strokeOpacity=".6"/>
    <g className="atlas-flame"><path d="M-18 5c-46-40 14-47 3-108 20 12 13 48 38 63 28 31 17 46-41 45z" fill="url(#atlas-fire)"/><path d="M-4 7c-31-23-4-35 5-57 0 22 34 38 7 57z" fill="#f5d995"/></g>
    <g className="atlas-smoke" fill="none" stroke="#b4b8ae" strokeOpacity=".13" strokeLinecap="round"><path d="M-5-116c-25-50 50-49 11-111" strokeWidth="10"/><path d="M9-125c18-29-21-44-3-75" strokeWidth="4"/></g>
    {[0,1,2,3,4,5,6,7].map(i=><circle className={'atlas-ember ember-'+i} key={i} cx={-24+i*7} cy={-36-i%3*18} r={i%3===0?1.8:1.1} fill="#f5c47d"/>) }
  </g>
  {Array.from({length:19},(_,i)=><Reeds key={i} x={421+i*62} y={850+i%3*17} s={.55+i%3*.18} color={i%3===0?'#455b47':'#304b43'}/>)}
  <g fill="#496054"><path d="m842 851 24-13 29 7 4 14-43 2zM1201 868l16-13 26 4 6 13zM1344 829l21-13 17 6-1 15-35 5z"/></g>
  {[0,1,2,3,4,5].map(i=><circle className="atlas-firefly" key={i} cx={777+i*105} cy={649+i%3*23} r="1.5" fill="#c1c99a" style={{animationDelay:`${-i*1.4}s`}}/>)}
</>}

