/** The quiet edge of the universe, before crossing Spawn's violet portal. */
export function BootBackdrop(){return <div className="boot-cosmos" aria-hidden="true">
  <div className="cosmic-nebula"/><div className="cosmic-horizon"/><div className="horizon-reflection"/>
  <svg className="cosmic-stars" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="starlight"><stop stopColor="#b8a9f5" stopOpacity="0"/><stop offset=".8" stopColor="#b8a9f5" stopOpacity=".35"/><stop offset="1" stopColor="#e8d1b0" stopOpacity=".65"/></linearGradient></defs>
    {Array.from({length:115},(_,i)=><circle key={i} cx={(Math.sin(i*127.1)*.5+.5)*1440} cy={(Math.cos(i*73.7)*.5+.5)*810} r={i%13===0?1.25:.6} fill={i%7?'#bfc6e2':'#dbbd92'} opacity={.12+(i%5)*.1}/>)}
    <g className="stellar-trails" fill="none" stroke="url(#starlight)" strokeWidth=".65"><path d="M720 -160C350 85 520 470 1530 335"/><path d="M705 -205C195 132 570 540 1580 347"/><path d="M880 -190C580 45 700 284 1520 235"/></g>
  </svg>
  <div className="cosmic-veil"/>
</div>;}
