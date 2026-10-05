export function presenterPose(time:number){
  // Walk, pause to explain, return, pause. Smooth endpoints keep feet grounded.
  const phase=((time%18)+18)%18;
  const returning=phase>=9;
  const legTime=returning?phase-9:phase;
  const walking=legTime<5;
  const t=Math.min(1,legTime/5),ease=t*t*(3-2*t);
  return {x:returning?5.1-ease*2.8:2.3+ease*2.8,walking,step:walking?Math.sin(legTime*Math.PI*2)*.27:0,yaw:walking?(returning?-.35:.35):0,gesture:walking?.2:.7+Math.sin(time*1.3)*.25};
}
