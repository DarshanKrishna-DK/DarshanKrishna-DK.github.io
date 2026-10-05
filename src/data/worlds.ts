export const worlds = [
  { id: 'spawn', name: 'Spawn', subtitle: 'Meet the human', icon: '01', color: '#d5b575', keyword: 'IDENTITY' },
  { id: 'devlab', name: 'DevLab', subtitle: 'Ideas into systems', icon: '02', color: '#b3c8c4', keyword: 'BUILD' },
  { id: 'projects', name: 'Projects', subtitle: 'Three ideas. Made real.', icon: '03', color: '#d5b575', keyword: 'PRODUCTS' },
  { id: 'devrel', name: 'DevRel City', subtitle: 'Better, together', icon: '04', color: '#d5b575', keyword: 'CONNECT' },
  { id: 'road', name: 'The Road', subtitle: 'Take the long way', icon: '05', color: '#bac4a0', keyword: 'EXPLORE' },
  { id: 'arcade', name: 'Arcade', subtitle: 'A few side quests', icon: '06', color: '#c9aba8', keyword: 'PLAY' },
  { id: 'campfire', name: 'Campfire', subtitle: 'Stay for a conversation', icon: '07', color: '#d5b575', keyword: 'HELLO' },
] as const;
export type WorldId = typeof worlds[number]['id'];
