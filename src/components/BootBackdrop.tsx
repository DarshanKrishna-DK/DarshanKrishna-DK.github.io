import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { GraphicsBoundary } from './GraphicsBoundary';
const EntrySpace=lazy(()=>import('../scene/EntrySpace'));

export const BootBackdrop=memo(function BootBackdrop({reduced,onReady}:{reduced:boolean;onReady:()=>void}){
  const [failed,setFailed]=useState(false);const ready=useRef(false);
  const complete=useCallback(()=>{ready.current=true;onReady();},[onReady]);
  const fail=useCallback(()=>{setFailed(true);complete();},[complete]);
  useEffect(()=>{const timer=setTimeout(()=>{if(!ready.current)fail();},9000);return()=>clearTimeout(timer);},[fail]);
  return <div className="entry-space" aria-hidden="true">
    <div className="entry-earth-fallback"/>
    {!failed&&<GraphicsBoundary onFailure={fail}><Suspense fallback={null}><EntrySpace reduced={reduced} onReady={complete} onFailure={fail}/></Suspense></GraphicsBoundary>}
    <div className="entry-readability"/>
  </div>;
});
