// Local chapter coordinates stay stable; the outdoor ride gets twice the space.
export const WORLD_Z = [0, -36, -72, -108, -144, -216, -252] as const;
export const EXIT_Z = [-4, -7.1, -8.9, -12.3, -46, -7.1] as const;
export const ARCH = { left: -5.3, right: -1.15, center: -3.225, base: -1.73, spring: 1.85, radius: 2.075 };
export function chapterLength(chapter:number){return chapter<6?WORLD_Z[chapter]-WORLD_Z[chapter+1]:36;}
export function routeZ(t:number){const i=Math.min(6,Math.max(0,Math.floor(t)));return WORLD_Z[i]-(t-i)*chapterLength(i);}
export function portalPhase(chapter:number){return (8-EXIT_Z[chapter])/chapterLength(chapter);}
export function roadBikeOpacity(progress:number){const phase=progress*6-4,end=portalPhase(4);return Math.max(0,Math.min(1,(end-.035-phase)/.10));}
