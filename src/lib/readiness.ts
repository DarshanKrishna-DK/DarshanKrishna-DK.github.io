export async function boundedReadiness(work:Promise<boolean>,timeoutMs=5000):Promise<boolean>{
  let timer:ReturnType<typeof setTimeout>|undefined;
  try{return await Promise.race([work.catch(()=>false),new Promise<boolean>(resolve=>{timer=setTimeout(()=>resolve(false),timeoutMs);})]);}
  finally{clearTimeout(timer);}
}
export function graphicsAvailable():boolean{
  try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}
}
