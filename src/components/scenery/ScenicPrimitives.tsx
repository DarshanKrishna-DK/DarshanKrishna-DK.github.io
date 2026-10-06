/** Reusable, original vector forms. No textures, WebGL, or per-frame React work. */
export function ScenicDefs(){return <defs>
  <radialGradient id="atlas-purple"><stop stopColor="#9c61e5" stopOpacity=".42"/><stop offset="1" stopColor="#482464" stopOpacity="0"/></radialGradient>
  <radialGradient id="atlas-blue"><stop stopColor="#4baccd" stopOpacity=".25"/><stop offset="1" stopColor="#315283" stopOpacity="0"/></radialGradient>
  <radialGradient id="atlas-gold"><stop stopColor="#dba969" stopOpacity=".4"/><stop offset="1" stopColor="#bb7840" stopOpacity="0"/></radialGradient>
  <linearGradient id="atlas-metal" x2=".8" y2="1"><stop stopColor="#53616c"/><stop offset=".35" stopColor="#202c38"/><stop offset=".65" stopColor="#0d1521"/><stop offset="1" stopColor="#384752"/></linearGradient>
  <linearGradient id="atlas-screen" x2=".8" y2="1"><stop stopColor="#142a3b"/><stop offset="1" stopColor="#08131d"/></linearGradient>
  <linearGradient id="atlas-wood" x2=".7" y2="1"><stop stopColor="#82634c"/><stop offset=".5" stopColor="#4c3933"/><stop offset="1" stopColor="#30262b"/></linearGradient>
  <linearGradient id="atlas-beam" x2="0" y2="1"><stop stopColor="#f5d0a2" stopOpacity=".23"/><stop offset="1" stopColor="#f2c58d" stopOpacity="0"/></linearGradient>
  <linearGradient id="atlas-upbeam" x2="0" y2="1"><stop stopColor="#b7dded" stopOpacity="0"/><stop offset="1" stopColor="#c1e4f6" stopOpacity=".3"/></linearGradient>
  <linearGradient id="atlas-moon" x2=".8" y2="1"><stop stopColor="#e0e0cc"/><stop offset=".55" stopColor="#aebbc0"/><stop offset="1" stopColor="#677e95"/></linearGradient>
  <radialGradient id="atlas-moonhalo"><stop stopColor="#c3d7dd" stopOpacity=".17"/><stop offset=".25" stopColor="#a9cbd8" stopOpacity=".08"/><stop offset="1" stopColor="#9cb5c9" stopOpacity="0"/></radialGradient>
  <linearGradient id="atlas-fire" x2=".4" y2="1"><stop stopColor="#ffe5a0"/><stop offset=".45" stopColor="#e9a45f"/><stop offset="1" stopColor="#b4482c"/></linearGradient>
  <linearGradient id="atlas-mist" x2="0" y2="1"><stop stopColor="#abc5c3" stopOpacity="0"/><stop offset=".7" stopColor="#abc5c3" stopOpacity=".13"/><stop offset="1" stopColor="#abc5c3" stopOpacity="0"/></linearGradient>
  <pattern id="atlas-speaker-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#9daebb" opacity=".2"/></pattern>
  <pattern id="atlas-keyboard" width="12" height="11" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="9" height="8" rx="2" fill="#263846" stroke="#8ebcc5" strokeOpacity=".3"/></pattern>
</defs>}

export function Stars({count=95}:{count?:number}){return <g className="atlas-stars">{Array.from({length:count},(_,i)=><circle key={i} cx={(Math.sin(i*133.3+2)*.5+.5)*1440} cy={(Math.cos(i*77.1)*.5+.5)*520} r={i%16===0?1.6:.7} fill={i%5===0?'#e6d1af':'#a7c4d9'} opacity={.25+(i%5)*.12}/>)}</g>}

export function Moon({x=1140,y=175,r=43}:{x?:number;y?:number;r?:number}){return <g transform={`translate(${x} ${y})`}>
  <circle r={r*4.6} fill="url(#atlas-moonhalo)"/>
  <g fill="none" stroke="#c2d5dc" strokeWidth="1" opacity=".12"><path d={`M0 ${-r*1.5}v${-r*1.4}M0 ${r*1.5}v${r*1.4}M${-r*1.5} 0h${-r*1.4}M${r*1.5} 0h${r*1.4}`}/></g>
  <circle r={r} fill="url(#atlas-moon)"/>
  <g fill="#687d8b" opacity=".28"><ellipse cx={-r*.3} cy={-r*.26} rx={r*.25} ry={r*.31}/><ellipse cx={r*.27} cy={r*.23} rx={r*.34} ry={r*.28}/><circle cx={-r*.22} cy={r*.47} r={r*.12}/><circle cx={r*.48} cy={-r*.3} r={r*.14}/></g>
  {Array.from({length:12},(_,i)=>{const a=i*2.4,d=(.25+(i%4)*.17)*r;return <circle key={i} cx={Math.cos(a)*d} cy={Math.sin(a)*d} r={r*(.025+(i%3)*.02)} fill="none" stroke="#e5e9d9" strokeOpacity=".23"/>})}
  <path d={`M${r*.25} ${-r*.95}A${r} ${r} 0 0 1 ${r*.2} ${r*.98}A${r*.89} ${r} 0 0 0 ${r*.25} ${-r*.95}`} fill="#1d344d" opacity=".24"/>
</g>}

export function Broadleaf({x,y,s=1,fill='#172f32',trunk='#263c37'}:{x:number;y:number;s?:number;fill?:string;trunk?:string}){return <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M-9 0 0-178 9-185 12 0z" fill={trunk}/><path d="M1-88-40-149M7-126 49-183M4-149-29-193" fill="none" stroke={trunk} strokeWidth="7" strokeLinecap="round"/>
  <path d="M-8-217c-21-20-49-13-51 10-32-8-59 23-44 47-25 18-13 55 20 55 9 31 43 37 64 14 23 20 56 15 67-11 37 8 63-24 43-49 11-26-11-54-38-52-7-31-42-34-61-14z" fill={fill}/>
  <path d="M-84-166c19-20 42-22 66-17m28-28c9 17 29 22 44 21m-72 63c16-10 36-11 51-3" stroke="#90a293" strokeOpacity=".07" strokeWidth="5" strokeLinecap="round" fill="none"/>
</g>}

export function Reeds({x,y,s=1,color='#3a5550'}:{x:number;y:number;s?:number;color?:string}){return <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
  <path d="M0 0q-5-37-25-55M3 0q2-59-10-82M7 0q11-49 27-61M11 0q24-29 36-32M-6 0q-21-25-39-23M10 0q-4-35 5-53"/><path d="m-7-79-2-16m43 34 6-12" strokeWidth="4"/>
</g>}

export function Monitor({x,y,w=260,h=160,poster,children}:{x:number;y:number;w?:number;h?:number;poster?:string;children?:React.ReactNode}){return <g transform={`translate(${x} ${y})`}>
  <path d={`M${w*.48} ${h}v34l-47 12h106l-47-12v-34`} fill="url(#atlas-metal)" stroke="#465969"/>
  <rect width={w} height={h} rx="10" fill="#080e17" stroke="#566977" strokeWidth="2"/>
  <rect x="7" y="7" width={w-14} height={h-19} rx="4" fill="url(#atlas-screen)"/>
  {poster&&<image href={poster} x="7" y="7" width={w-14} height={h-19} preserveAspectRatio="xMidYMid slice"/>}
  {children}<circle cx={w/2} cy={h-5} r="1.5" fill="#a3d4d0"/>
</g>}

export function Speaker({x,y,s=1}:{x:number;y:number;s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect width="48" height="91" rx="12" fill="#131b26" stroke="#344551"/><rect x="4" y="5" width="40" height="82" rx="10" fill="url(#atlas-speaker-mesh)"/>
  <circle cx="24" cy="28" r="11" fill="#0c141d" stroke="#445562"/><circle cx="24" cy="63" r="17" fill="#0b131b" stroke="#3a4b55"/><circle cx="24" cy="63" r="8" fill="#283740"/><circle cx="24" cy="28" r="4" fill="#697b82"/>
</g>}

export function Computer({x,y,accent='#70adb9'}:{x:number;y:number;accent?:string}){return <g transform={`translate(${x} ${y})`}>
  <path d="M0 10 29 0l91 16-1 156-30 13L0 165z" fill="#101925" stroke="#3a4857"/><path d="m89 26 29-10v156l-29 13z" fill="#0a111c"/><path d="M8 20 81 33v137L8 155z" fill="#1a2a38" stroke="#648193" strokeOpacity=".35"/>
  {[0,1,2].map(i=><g key={i} transform={`translate(48 ${52+i*41})`}><ellipse rx="23" ry="18" fill="#0e1826" stroke={accent} strokeOpacity=".66" strokeWidth="2"/><g className="atlas-fan" fill={accent} opacity=".26">{[0,1,2,3,4].map(n=><path key={n} transform={`rotate(${n*72})`} d="M0 0c-1-16 13-19 17-8C12-12 9-2 0 0"/>)}</g><circle r="5" fill="#56667a"/></g>)}
  <path d="M98 31v42m8-43v43m-8 36v40m8-39v40" stroke="#465666" opacity=".5"/><circle cx="100" cy="17" r="2" fill={accent}/>
</g>}

export function Desk({arcade=false}:{arcade?:boolean}){return <g>
  <path d="m720 570 537-18 132 83-620 30z" fill="url(#atlas-wood)" stroke="#8e7966" strokeOpacity=".42"/>
  <path d="m769 665 620-30v15l-620 30z" fill="#302c30"/><path d="m776 679 9 168h17l5-169m481-22 29 163h19l-11-165" fill="url(#atlas-metal)"/>
  <path d="m726 579 518-16m-491 30 507-18m-430 38 505-18" stroke="#dab88a" strokeOpacity=".06" fill="none"/>
  <path d="m880 599 246-6 45 34-255 10z" fill="#111c27" stroke={arcade?'#826eaf':'#526471'} strokeOpacity=".55"/>
  <path d="m900 602 220-5 32 26-229 10z" fill="url(#atlas-keyboard)"/>
  <ellipse cx="1210" cy="616" rx="15" ry="11" fill="#26323e" stroke={arcade?'#a38bbd':'#6b8c92'}/><path d="M1210 607v7" stroke="#88bfc7"/>
</g>}
