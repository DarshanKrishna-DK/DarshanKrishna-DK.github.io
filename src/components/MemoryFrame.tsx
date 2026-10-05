import type { CommunityMemory } from '../data/profile';
export function MemoryFrame({ memory, index }: { memory:CommunityMemory;index:number }) {
  return <figure className="memory-frame" style={{'--tilt':`${index%2===0?-3:3}deg`} as React.CSSProperties}><img src={memory.image} alt={memory.alt} loading="lazy"/><figcaption>{memory.caption}{memory.date && <span>{memory.date}</span>}</figcaption></figure>;
}
