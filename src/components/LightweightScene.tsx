import { memo } from 'react';
function ScenicDetail({world,beat}:{world:number;beat:number}){
  return <svg className={`light-detail detail-${world}`} viewBox="0 0 700 400" fill="none">
    <defs><radialGradient id="fire-pool"><stop stopColor="#b57937" stopOpacity=".4"/><stop offset="1" stopColor="#b57937" stopOpacity="0"/></radialGradient><linearGradient id="little-flame" x2="0" y2="1"><stop stopColor="#ebad64"/><stop offset="1" stopColor="#b76335"/></linearGradient><linearGradient id="glass-room" x2="1" y2="1"><stop stopColor="#48606b"/><stop offset="1" stopColor="#0b1c28"/></linearGradient></defs>
    {world===6?<>
      <ellipse cx="350" cy="321" rx="215" ry="69" fill="url(#fire-pool)"/>
      <path d="M318 326l65-17m-57-2 53 27" stroke="#64503b" strokeWidth="12" strokeLinecap="round"/>
      <path d="M350 318c-56-31-10-55-5-105 5 42 51 68 16 104" fill="url(#little-flame)"/>
      <path d="M351 318c-20-20 2-39 4-58 17 29 20 47-4 58" fill="#e4bb77"/>
      <g stroke="#56706b" strokeWidth="5"><path d="m172 277 22 83m-44-49 82 0m-19-32-21 78m264-67 28 70m-35-50 91 0m-12-38-21 89"/></g>
      <path d="m145 252 65-8 17 44-72 12zM449 247l79 3-4 47-72-7z" fill="#2d494a" stroke="#648075"/>
      <circle cx="485" cy="216" r="15" fill="#797064"/><path d="m470 239 28-1 10 42-54 7z" fill="#354651"/>
      <path d="m465 286 14 48m13-47 22 42" stroke="#22343d" strokeWidth="14" strokeLinecap="round"/>
      {[0,1,2,3,4].map(i=><circle key={i} cx={342+Math.sin(i*2)*20} cy={190-i*21} r="1.4" fill="#c6a276"/>)}
    </>:world===3?<>
      <path d="M134 165h436v120H134z" fill="#122936" stroke="#6e8786"/><path d="M158 189h388v64H158z" fill="#1b3541"/>
      <text x="352" y="231" textAnchor="middle" fill="#d7c8a9" fontSize="30">KrowdKraft</text><circle cx="391" cy="266" r="8" fill="#bc9a7c"/><path d="M383 275h16l4 21h-24z" fill="#657d72"/><path d="M85 145h35v128H85m468-128h35v128h-35" stroke="#526978" strokeWidth="12"/><path d="M34 214h58m518 0h58M34 250h58m518 0h58" stroke="#b9a982" strokeWidth="3"/>
      {Array.from({length:64},(_,i)=><circle key={i} cx={108+(i%16)*31+(i%16>7?15:0)} cy={310+Math.floor(i/16)*22} r="5" fill={['#5a645f','#586273','#73665a'][i%3]}/>)}
    </>:world===4?(beat===2?<path d="M130 260h450M100 278h350m-300 19h480m-440 25h460m-490 27h350" stroke="#9baca1" strokeOpacity=".35"/>:<><path d="M322 115c140 74-158 97 65 160l125 125H94l170-131c223-55-58-98 58-154" fill="#0c2029" stroke="#637971" strokeOpacity=".4"/><path d="M322 118c115 72-162 127-4 177l-31 105" stroke="#a1a58b" strokeWidth="2" strokeDasharray="13 23"/></>):world===1?<>
      <path d="m69 275 476-14 110 72H123z" fill="#263d48" stroke="#789392"/><path d="M125 333v65m467-64v64" stroke="#28404a" strokeWidth="12"/>
      <rect x="199" y="122" width="300" height="164" rx="9" fill="url(#glass-room)" stroke="#79948f"/><path d="M218 143h262v115H218z" fill="#0b222c"/>
      {[0,1,2,3,4].map(i=><path key={i} d={`M243 ${168+i*16}h${145-i%3*33}`} stroke={i===3?'#b4a57d':'#648c8d'} strokeWidth="3"/>)}
    </>:world===2?<>
      {['sahay','zuik','swyftpay'].map((id,i)=><g key={id} transform={`translate(${115+i*180} ${i===1?75:110})`}><ellipse cx="65" cy="245" rx="79" ry="20" fill="#293d48"/><path d="M65 125v116" stroke="#4f6a70" strokeWidth="12"/><circle cx="65" cy="65" r="82" fill="url(#glass-room)" stroke={['#b7bd95','#a99ac5','#93bbc0'][i]} strokeWidth="2"/><image href={`/assets/project-logos/${id}.png`} x="6" y="10" width="118" height="97" preserveAspectRatio="xMidYMid meet"/><text x="65" y="132" textAnchor="middle" fill="#e0d3b6" fontSize="18">{id.toUpperCase()}</text></g>)}
    </>:world===5?<><path d="M80 300h520l50 38H58z" fill="#263646" stroke="#718188"/><path d="M111 338v62m475-62v62" stroke="#39525c" strokeWidth="10"/>{[0,1,2].map(i=><g key={i} transform={`translate(${85+i*175} ${i===1?160:90})`}><rect width="155" height="100" rx="8" fill="url(#glass-room)" stroke="#897c9e"/><path d="M77 100v39m-29 0h58" stroke="#71818a" strokeWidth="4"/><text x="77" y="42" textAnchor="middle" fill="#cfc1dd" fontSize="17">{['PUBG','CS:GO','MOBILE LEGENDS'][i]}</text><path d="m10 83 42-26 31 15 35-38 23 49" stroke="#729092" strokeWidth="2"/></g>)}<rect x="515" y="229" width="53" height="89" rx="12" fill="#172b3a"/>{[0,1,2].map(i=><circle key={i} cx="541" cy={245+i*26} r="10" stroke="#b1a0c4" strokeWidth="2"/>)}<text x="340" y="61" fill="#a494b9" textAnchor="middle" fontSize="17">100+ ANIME. STILL WATCHING.</text></>:null}
  </svg>;
}
export const LightweightScene=memo(function LightweightScene({world,beat}:{world:number;beat:number}){
  return <div className={`light-scene light-world-${world} light-beat-${beat}`} aria-hidden="true">{world===0&&<div className="light-portal"/>}<div className="light-haze"/><div className="light-horizon"/><div className="light-architecture">{Array.from({length:12},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div><div className="light-ground"/><div className="light-stars"/><div className="light-moon"/><div className="light-water"/><ScenicDetail world={world} beat={beat}/><div className="light-scenery-label">{['THE ORIGIN','IDEA ENGINE','PRODUCT SYSTEMS','BETTER TOGETHER','TAKE THE LONG WAY','SIDE QUESTS','STAY A WHILE'][world]}</div></div>;
});
