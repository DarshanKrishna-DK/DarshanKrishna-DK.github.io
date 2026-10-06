import { Computer, Desk, Monitor, Speaker, Stars } from './ScenicPrimitives';

export function Origin(){return <>
  <path fill="#080611" d="M0 0h1440v900H0z"/><Stars count={75}/>
  <ellipse cx="1110" cy="460" rx="590" ry="570" fill="url(#atlas-purple)"/>
  <path d="M0 723Q750 669 1440 716V900H0z" fill="#0b0917"/>
  <ellipse cx="1110" cy="741" rx="355" ry="41" fill="url(#atlas-purple)"/>
  <g transform="translate(1100 420)">
    <ellipse rx="230" ry="298" fill="#080712" stroke="#684697" strokeWidth="3"/>
    <ellipse rx="212" ry="278" fill="#060610" stroke="#b78ddd" strokeWidth="2"/>
    {[0,1,2,3,4,5,6,7].map(i=><ellipse key={i} className={'atlas-orbit orbit-'+i%2} rx={221+i*4} ry={285+i*4} fill="none" stroke={i%2?'#a07ad1':'#664893'} strokeWidth={i%3===0?3:1} strokeDasharray={`${110+i*23} ${56+i*11} ${10+i} ${92-i*3}`} opacity={.8-i*.07} transform={`rotate(${i*23})`}/>)}
    <ellipse rx="201" ry="270" fill="none" stroke="#c0a3ed" strokeOpacity=".27" strokeWidth="12"/>
    <path d="M-157-161C-60-300 155-183 165 18S-93 235-151 104" fill="none" stroke="#aa8cc8" strokeWidth="1" opacity=".2"/>
    {Array.from({length:46},(_,i)=>{const a=i*2.4;return <circle key={i} cx={Math.cos(a)*(233+i%6*9)} cy={Math.sin(a)*(310+i%4*10)} r={i%4===0?2:1} fill="#c3a3ee" opacity={.15+i%5*.13}/>})}
  </g>
  <path d="M740 900 938 733m499 167-176-166" stroke="#9574bc" strokeOpacity=".16"/><path d="M825 803q277-37 501-4m-626 62q360-66 740-6" fill="none" stroke="#9574bc" strokeOpacity=".08"/>
</>}

function RoomShell({arcade=false}:{arcade?:boolean}){return <>
  <path fill={arcade?'#080916':'#0a1018'} d="M0 0h1440v900H0z"/>
  <path d="M595 0h845v755c-282-90-593-62-845-24z" fill={arcade?'#111321':'#18212b'}/>
  <path d="M605 0h110v727l-110 24z" fill={arcade?'#10111f':'#141d27'}/>
  <path d="M715 0v727m-78-727v741" stroke="#61707a" strokeOpacity=".13"/>
  <path d="M0 744q884-95 1440 1v155H0z" fill={arcade?'#0b0c17':'#111923'}/>
  {[0,1,2,3,4,5].map(i=><path key={i} d={`M${650+i*136} 732 ${340+i*220} 900`} stroke="#6f8290" strokeOpacity=".07"/>)}
  <path d="M500 813q610-50 940 10" stroke="#6f8290" strokeOpacity=".06" fill="none"/>
  <ellipse cx="1070" cy="806" rx="358" ry="62" fill="#030710" opacity=".6"/>
</>}

export function Laboratory(){return <>
  <RoomShell/>
  <ellipse cx="1050" cy="492" rx="500" ry="410" fill="url(#atlas-gold)" opacity=".39"/>
  <path d="M1024 0v156" stroke="#797b79" strokeWidth="3"/>
  <path d="m987 168 76-1 117 427H828z" fill="url(#atlas-beam)"/>
  <path d="M976 170q7-32 49-36 38 4 49 36z" fill="#29343b" stroke="#7b847e"/>
  <ellipse cx="1025" cy="170" rx="47" ry="7" fill="#ccb790"/><ellipse cx="1025" cy="170" rx="31" ry="3" fill="#f4e4b8"/>
  <g transform="translate(1335 248)"><path d="M0 0h141v446H0z" fill="#2a2e33" stroke="#54544e"/><path d="M8 8h125v105H8zm0 123h125v142H8zm0 160h125v147H8z" fill="#151f27" stroke="#3d4649"/><path d="M21 101V31m13 70V39m15 62V29m16 72V44m19 57V22m15 79V35" stroke="#778779" strokeWidth="9"/><path d="M48 249h57m-57 9h57" stroke="#80715d" strokeWidth="6"/><path d="M19 308h45v115H19zM81 308h41v115H81z" fill="#3b4240"/><path d="M72 337v47" stroke="#aaa18a" strokeWidth="2"/></g>
  <g transform="translate(803 218)"><path d="M0 0h119v73H0z" fill="#22313a" stroke="#5d6c6e" strokeOpacity=".5"/><path d="m21 52 20-21 17 11 23-23 16 36" fill="none" stroke="#94aca5" strokeWidth="2"/><circle cx="83" cy="19" r="4" fill="#ccb58a"/><text x="8" y="94" fill="#627782" fontSize="12">MAKE SOMETHING USEFUL.</text></g>
  <Desk/>
  <ellipse cx="1035" cy="547" rx="219" ry="114" fill="url(#atlas-blue)"/>
  <Monitor x={876} y={359} w={306} h={187}>
    <g transform="translate(21 24)"><path d="M0 0h264" stroke="#334c60"/><circle cx="3" cy="-6" r="2" fill="#bf8d7f"/><circle cx="11" cy="-6" r="2" fill="#b9a57a"/><circle cx="19" cy="-6" r="2" fill="#7caa9e"/>
      <text x="0" y="24" fill="#b2ccd8" fontSize="14">darshan@devlab ~ build</text>
      {['def turn_ideas_into_products():','    intent = understand(problem)','    solution = build(intent)','    return test_and_share(solution)'].map((line,i)=><text key={line} x="0" y={48+i*19} fontSize="12" fill={i===0?'#b6a3d2':i===3?'#a0c8b3':'#7297ad'}>{line}</text>)}
      <g className="atlas-code-cursor"><path d="M0 137h8" stroke="#b6d4d4" strokeWidth="2"/></g><text x="15" y="140" fontSize="10" fill="#728d9b">human judgment + agentic workflows</text>
    </g>
  </Monitor>
  <Computer x={1219} y={399}/><Speaker x={802} y={476}/>
  <g transform="translate(854 569)"><path d="M0 2c-12-38 44-38 34 0" fill="none" stroke="#10171e" strokeWidth="9"/><path d="M0 1c-9-7-17 0-12 13 4 11 14 11 18 2m25-15c10-6 16 1 12 13-4 10-12 12-18 2" fill="#3b4954" stroke="#78908e" strokeWidth="2"/></g>
  <g transform="translate(1190 571)"><path d="M-17-24h32l-3 28h-26z" fill="#87938b"/><ellipse cy="-24" rx="16" ry="4" fill="#3a342e"/><path d="M15-19c17-5 16 22-2 16" fill="none" stroke="#9a9f8e" strokeWidth="4"/><path className="atlas-steam" d="M-4-36c-8-11 10-15 2-28" fill="none" stroke="#c9d1c5" strokeOpacity=".3" strokeWidth="2"/></g>
  <path d="M971 703c-19-58 147-75 152-11l4 79-171 3z" fill="#1a2832" stroke="#495b64" strokeWidth="2"/><path d="M965 745c30-16 135-21 159-9l-2 42-162 4z" fill="#273841"/><path d="M1038 782v65m-60 20 61-22 59 16" stroke="#4b5c65" strokeWidth="7" strokeLinecap="round"/>
  <text x="806" y="862" fill="#576b77" fontSize="13" letterSpacing="4">THE IDEA ENGINE / 02</text>
</>}

export function ProductGallery({project}:{project:number}){
  const ids=['sahay','zuik','swyftpay'];const order=[(project+2)%3,project,(project+1)%3];
  return <>
    <path fill="#0a0b16" d="M0 0h1440v900H0z"/>
    <path d="M590 798V348c0-399 1020-393 1020 0v450z" fill="#151725"/>
    <path d="M681 754V359c0-319 795-319 795 0v395" fill="none" stroke="#474555" strokeWidth="2"/>
    <path d="M706 737V365c0-285 746-285 746 0" fill="none" stroke="#262837" strokeWidth="14"/>
    <path d="M0 785q868-111 1440-23v138H0z" fill="#10141f"/>
    <path d="M543 820c331-66 660-61 972-4M629 875c267-68 636-61 884-16" fill="none" stroke="#716880" strokeOpacity=".14"/>
    {order.map((n,i)=>{const active=n===project,x=[755,1070,1340][i],y=active?456:397,s=active?1:.7,color=['#c1bb81','#b3a0d7','#83bdce'][n];return <g key={n} transform={`translate(${x} ${y}) scale(${s})`} opacity={active?1:.5}>
      <ellipse cy="280" rx="204" ry="50" fill="url(#atlas-blue)" opacity=".7"/>
      <path d="M-150 225v32c0 41 300 41 300 0v-32z" fill="url(#atlas-metal)"/>
      <ellipse cy="225" rx="150" ry="30" fill="#29323d" stroke="#75818a" strokeWidth="1"/><ellipse cy="225" rx="121" ry="21" fill="#151e2a"/>
      <path d="M-10 121v89q11 18 22 0v-89" fill="url(#atlas-metal)"/><ellipse cy="217" rx="47" ry="9" fill="#080f1a"/>
      <ellipse cy="83" rx="219" ry="228" fill="url(#atlas-purple)" opacity=".45"/>
      <path d="m-126 224-30-299 211 40zM126 224 157-75-55-35z" fill="url(#atlas-upbeam)" opacity=".6"/>
      <circle r="135" fill="url(#atlas-metal)" stroke="#62707f" strokeWidth="2"/><circle r="127" fill="#0b1521" stroke={color} strokeWidth="2"/>
      <circle r="121" fill="none" stroke={color} strokeWidth="1" strokeOpacity=".25"/><circle className="atlas-logo-orbit" r="130" fill="none" stroke={color} strokeWidth="3" strokeDasharray="50 167 8 167"/>
      <image href={`/assets/project-logos/${ids[n]}.png`} x="-91" y="-85" width="182" height="158" preserveAspectRatio="xMidYMid meet"/>
      <text textAnchor="middle" y="100" fill={color} fontSize="18" letterSpacing="5">{ids[n].toUpperCase()}</text>
      {[-1,1].map(sign=><g key={sign} transform={`translate(${sign*126} 222) rotate(${sign*22})`}><path d="M-10 0h20v14h-20z" fill="#121c29" stroke="#586877"/><ellipse rx="11" ry="4" fill="#cae2ec"/><ellipse rx="19" ry="9" fill="url(#atlas-blue)"/></g>)}
      <path d="m-76 287 152 0" stroke={color} strokeOpacity=".2"/><text textAnchor="middle" y="324" fill="#738494" fontSize="12" letterSpacing="4">{['AGENTIC PROCUREMENT','INTENT TO EXECUTION','PAYMENTS FOR AGENTS'][n]}</text>
    </g>})}
    <path d="M658 96q410-148 812 0" fill="none" stroke="#a3a0b7" strokeOpacity=".14"/>
  </>;
}

export function Auditorium(){return <>
  <path fill="#0b0b16" d="M0 0h1440v900H0z"/>
  <path d="M540 146Q993-44 1470 146V655H540z" fill="#231c28"/>
  {Array.from({length:20},(_,i)=><path key={i} d={`M${590+i*45} ${128-Math.sin(i/20*Math.PI)*74}v491`} stroke={i%2?'#443038':'#302635'} strokeWidth="21" opacity=".6"/>)}
  <path d="M520 208Q1000 61 1480 208" fill="none" stroke="#5b515b" strokeWidth="8"/>
  <path d="M690 192h629m-629 13h629" stroke="#746575" strokeWidth="3"/>
  <path d="M899 204 772 605h373zM1215 204 963 605h346z" fill="url(#atlas-beam)"/>
  {[722,898,1082,1214,1301].map((x,i)=><g key={x} transform={`translate(${x} 200) rotate(${i%2?20:-10})`}><path d="M-10-5h20v30h-20z" fill="#202532" stroke="#5c6270"/><ellipse cy="25" rx="10" ry="4" fill="#dfcbb0"/></g>)}
  <path d="M775 279q258-26 516 0v215q-258 22-516 0z" fill="#111722" stroke="#766769" strokeWidth="2"/>
  <path d="M790 293q244-22 486 0v186q-244 21-486 0z" fill="#1c2431"/>
  <g fill="#d8c29f" textAnchor="middle"><text x="1034" y="385" fontSize="46" fontWeight="600">KrowdKraft</text><text x="1034" y="423" fontSize="13" letterSpacing="5" fill="#8c9ba8">BUILD. LEARN. BELONG.</text></g>
  <path d="M720 576q335-65 680 0l40 57q-397-54-775 24z" fill="url(#atlas-wood)"/><path d="M665 657q396-78 775-24v29q-375-48-767 26z" fill="#252331" stroke="#5f4b4e"/>
  <ellipse cx="1061" cy="580" rx="107" ry="24" fill="url(#atlas-gold)"/>
  <g className="atlas-speaker-person" transform="translate(1071 533)"><path d="m-9 14-7 33m22-33 9 33" stroke="#151c29" strokeWidth="10" strokeLinecap="round"/><path d="m-18-20 36-1 6 38h-45z" fill="#536f78"/><circle cy="-38" r="13" fill="#bc9477"/><path d="M-13-41q6-22 25-4l-1-9-18-6-9 8z" fill="#202431"/><path className="atlas-presenter-arm" d="m-16-13-22 10-14-14" fill="none" stroke="#91aaa7" strokeWidth="7" strokeLinecap="round"/><path d="m17-12 10 7-5-29" fill="none" stroke="#91aaa7" strokeWidth="7" strokeLinecap="round"/><path d="M21-43v15" stroke="#171b25" strokeWidth="4"/><circle cx="21" cy="-44" r="4" fill="#7d8a93"/></g>
  <Speaker x={707} y={498} s={1.1}/><Speaker x={1348} y={478} s={1.1}/>
  {[0,1,2,3].map(row=><g key={row}>
    <path d={`M${580-row*60} ${694+row*55}Q1030 ${593+row*55} 1550 ${688+row*65}`} fill="none" stroke="#38303b" strokeWidth="21"/>
    {Array.from({length:16},(_,i)=>{const x=597+i*62-row*22,y=676+row*62+Math.pow((i-8)/8,2)*43,s=.77+row*.13;return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-21 0q-4-27 5-33h31q13 9 7 33z" fill={['#3c414f','#3f3a42','#37444a'][i%3]}/>
      <circle cy="-41" r="10" fill={['#907664','#695f5e','#a18a73','#6e645f'][i%4]}/><path d="M-10-42q0-14 12-12l8 7v7q-14-6-20-2" fill={i%3===0?'#24232b':'#2e282e'}/>
      <path d="M-24-5q24-12 48 0v25h-48z" fill="#322e3d" stroke="#54434e"/>
      {i%5===1&&<path className="atlas-audience-hand" d="M-13-20-20-39-5-49" fill="none" stroke="#a48b77" strokeWidth="5" strokeLinecap="round"/>}
      {i%5===3&&<path d="m-12-19 16 8 10-11" fill="none" stroke="#776d6a" strokeWidth="5"/>}
    </g>})}
  </g>)}
  <path d="m594 900 204-256m641 256-141-264" stroke="#b7a283" strokeOpacity=".22" strokeWidth="2"/>
</>}

export function GamingRoom(){return <>
  <RoomShell arcade/>
  <ellipse cx="1010" cy="460" rx="368" ry="350" fill="url(#atlas-purple)" opacity=".43"/>
  <ellipse cx="1270" cy="502" rx="248" ry="280" fill="url(#atlas-blue)" opacity=".55"/>
  <g transform="translate(802 175) rotate(-4)"><path d="M-5-5h115v161H-5z" fill="#0b111c" stroke="#5c5067"/><image href="/assets/anime/one-piece.webp" width="105" height="151" preserveAspectRatio="xMidYMid slice"/><path d="M0 0h105v151H0z" fill="#15263a" opacity=".12"/></g>
  <g transform="translate(1210 190) rotate(3)"><path d="M-5-5h110v148H-5z" fill="#0b111c" stroke="#5c5067"/><image href="/assets/anime/hunter-x-hunter.webp" width="100" height="138" preserveAspectRatio="xMidYMid slice"/></g>
  <text x="1034" y="228" textAnchor="middle" fill="#baa7d2" fontSize="23" letterSpacing="3">JUST ONE MORE.</text><path d="M958 244h156" stroke="#8e719e" strokeOpacity=".3"/>
  <Desk arcade/>
  <g transform="translate(776 381) skewY(8)"><Monitor x={0} y={0} w={183} h={143} poster="/assets/arcade/pubg.webp"/></g>
  <g transform="translate(1154 405) skewY(-8)"><Monitor x={0} y={0} w={183} h={143} poster="/assets/arcade/mobile-legends.webp"/></g>
  <Monitor x={951} y={374} w={221} h={173} poster="/assets/arcade/csgo.webp"/>
  <path d="M958 553h207" stroke="#baa1cf" strokeWidth="2" opacity=".7"/>
  <Computer x={1287} y={542} accent="#c09acb"/><Speaker x={730} y={496} s={.8}/>
  <path d="M995 710c-7-54 108-60 117-11l18 103-144 5z" fill="#22283b" stroke="#60617b" strokeWidth="2"/><path d="m1010 713 10 51m78-58-4 59" stroke="#9c8aad" strokeWidth="3" opacity=".5"/><path d="M989 784q75-17 139-4l-4 29H988z" fill="#333849"/><path d="M1057 811v40m-58 18 58-20 64 11" fill="none" stroke="#596374" strokeWidth="7" strokeLinecap="round"/>
  <g transform="translate(1195 579)"><path d="M-16 8c-19-42 47-51 37-2" fill="none" stroke="#837692" strokeWidth="8"/><path d="M-17 1c-11-4-17 7-10 19 6 9 16 5 16-3m31-17c14-4 19 8 12 19-6 8-14 5-15-3" fill="#242b3c" stroke="#aa90b9" strokeWidth="2"/></g>
  <path d="m764 612 57-5 7 14-57 5z" fill="#323846"/><circle cx="785" cy="617" r="3" fill="#b6a5c5"/><path d="M808 612v7m-4-3h8" stroke="#b6a5c5"/>
  <text x="808" y="864" fill="#68627c" fontSize="13" letterSpacing="3">BOTLIFEMATTERS / PLAYER TWO IS A DUCK</text>
</>}

