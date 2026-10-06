import { memo } from 'react';
import { Auditorium, GamingRoom, Laboratory, Origin, ProductGallery } from './scenery/InteriorWorlds';
import { NightCamp, RoadLandscape } from './scenery/NatureWorlds';
import { ScenicDefs } from './scenery/ScenicPrimitives';

/** Illustrated alternate renderer; chapter content and the 3D companion stay shared. */
export const LightweightScene=memo(function LightweightScene({world,beat,project=0}:{world:number;beat:number;project?:number}){
  return <div className={`atlas-scene atlas-world-${world} atlas-beat-${beat}`} aria-hidden="true">
    <svg className="atlas-art" key={`${world}-${beat}`} viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid slice">
      <ScenicDefs/>
      {world===0?<Origin/>:world===1?<Laboratory/>:world===2?<ProductGallery project={project}/>:world===3?<Auditorium/>:world===4?<RoadLandscape beat={beat}/>:world===5?<GamingRoom/>:<NightCamp/>}
    </svg>
    <div className="atlas-depth"/>
  </div>;
});
