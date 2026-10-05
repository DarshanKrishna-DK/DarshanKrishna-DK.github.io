import {it,expect} from 'vitest';
import {boundedReadiness} from './readiness';
it('a stalled loader cannot block entry indefinitely',async()=>{
  expect(await boundedReadiness(new Promise(()=>{}),15)).toBe(false);
});
it('a failed asset is reported as failed rather than available',async()=>{
  expect(await boundedReadiness(Promise.reject(new Error('missing')),15)).toBe(false);
  expect(await boundedReadiness(Promise.resolve(true),15)).toBe(true);
});
