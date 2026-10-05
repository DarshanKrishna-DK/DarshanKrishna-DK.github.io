import { describe,it,expect } from 'vitest';
import { nextStage,reactionResult } from './walkthrough';
import { projects } from '../data/projects';
import { soundConsent } from './audio';
describe('product walkthrough trust boundaries',()=>{
  it('keeps review ahead of authorization and execution',()=>{
    const zuik=projects.find(p=>p.id==='zuik')!;
    expect(zuik.stages[2].title).toMatch(/Review/);
    expect(zuik.stages[3].title).toMatch(/Authorize/);
    expect(zuik.stages[4].title).toMatch(/Execute/);
    expect(nextStage(4,5)).toBe(4);
    expect(nextStage(-2,5)).toBe(0);
  });
  it('requires policy before an illustrative payment',()=>{
    const p=projects.find(p=>p.id==='swyftpay')!;
    expect(p.stages[2].title).toMatch(/Policy/);
    expect(p.stages[3].title).toMatch(/Settle/);
  });
  it('starts audio only after explicit sound entry',()=>{
    expect(soundConsent('sound',false)).toBe(false);
    expect(soundConsent('silent',true)).toBe(false);
    expect(soundConsent('sound',true)).toBe(true);
  });
  it('rejects early game clicks and measures actual elapsed time',()=>{
    expect(reactionResult(2000,1990)).toBeNull();
    expect(reactionResult(0,5000)).toBeNull();
    expect(reactionResult(2000,2245.5)).toBe(246);
  });
});
