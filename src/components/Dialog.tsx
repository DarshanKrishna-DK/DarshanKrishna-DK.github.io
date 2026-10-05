import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Dialog({ title, children, onClose, wide=false }: { title:string; children:ReactNode; onClose:()=>void; wide?:boolean }) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const dialog=ref.current!;const previous=document.activeElement as HTMLElement|null;
    dialog.showModal();
    const cancel=(event:Event)=>{event.preventDefault();onClose();};dialog.addEventListener('cancel',cancel);
    return()=>{dialog.removeEventListener('cancel',cancel);dialog.close();previous?.focus();};
  },[onClose]);
  return <dialog ref={ref} className={`dialog ${wide?'wide':''}`} aria-labelledby="dialog-title" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <header className="dialog-header"><div><span className="eyebrow">DARSHAN.WORLD / FIELD NOTES</span><h2 id="dialog-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20}/></button></header>
    <div className="dialog-body">{children}</div>
  </dialog>;
}
