export function nextStage(current:number,total:number):number { return Math.max(0,Math.min(total-1,current+1)); }
export function reactionResult(readyAt:number, clickedAt:number):number|null { return readyAt>0 && clickedAt>=readyAt ? Math.round(clickedAt-readyAt) : null; }
