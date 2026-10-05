import { expect, it } from 'vitest';
import { createRoadGeometry } from './Nature';
it('faces the fallback road upward, so it remains visible from the rider camera',()=>{
  const geometry=createRoadGeometry();const normals=geometry.attributes.normal;
  for(let i=0;i<normals.count;i++)expect(normals.getY(i)).toBeGreaterThan(.99);
  expect(geometry.index!.count).toBeGreaterThan(0);geometry.dispose();
});
