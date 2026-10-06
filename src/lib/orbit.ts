/** Elliptic orbit with Kepler timing. Units and period are scaled for this scene. */
export function satelliteOrbit(seconds:number):[number,number,number]{
  const eccentricity=.12,mean=.9+seconds/66*Math.PI*2;
  let eccentric=mean;
  for(let i=0;i<4;i++)eccentric-=(eccentric-eccentricity*Math.sin(eccentric)-mean)/(1-eccentricity*Math.cos(eccentric));
  const x=8.5*(Math.cos(eccentric)-eccentricity),y=8.5*Math.sqrt(1-eccentricity**2)*Math.sin(eccentric);
  return [x,y*Math.cos(.81),y*Math.sin(.81)];
}
