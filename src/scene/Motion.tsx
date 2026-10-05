import { createContext, useContext } from 'react';
export const SceneMotion=createContext(false);
// Freeze shader time and decorative poses even when interaction invalidates a reduced-motion frame.
export function useMotionTime(){const reduced=useContext(SceneMotion);return (clock:{elapsedTime:number})=>reduced?0:clock.elapsedTime;}
