import { describe, expect, it } from 'vitest';
import { actionDelay, bootActions, companionState, nextBootAction } from './companion';
import { midiFrequency, soundscapeIndex, soundscapes } from '../data/soundscapes';
import { sectionDialogue, roadDialogue } from '../data/gundu';
import { profile } from '../data/profile';

describe('companion action scheduling',()=>{
  it('varies actions without consecutive repeats, with bounded intervals',()=>{
    expect(bootActions).not.toContain('jumping');
    for(const state of bootActions)for(const random of [0,.25,.5,.75,1]){
      const next=nextBootAction(state,random);expect(bootActions).toContain(next);expect(next).not.toBe(state);
      expect(actionDelay(random)).toBeGreaterThanOrEqual(3000);expect(actionDelay(random)).toBeLessThanOrEqual(5000);
    }
  });
  it('provides multiple section facts and separate landscape commentary',()=>{
    expect(sectionDialogue).toHaveLength(7);sectionDialogue.forEach(lines=>{expect(lines.length).toBeGreaterThanOrEqual(3);expect(new Set(lines).size).toBe(lines.length);});expect(roadDialogue).toHaveLength(3);
  });
});
describe('world music routing',()=>{
  it('keeps the first four worlds on one score and varies the landscapes and archive',()=>{
    const routes=[...Array.from({length:7},(_,i)=>soundscapeIndex(i,0)),soundscapeIndex(4,1),soundscapeIndex(4,2),soundscapeIndex(5,0,true)];
    expect(routes.slice(0,4)).toEqual([0,0,0,0]);expect(new Set(routes).size).toBe(7);routes.forEach(i=>expect(soundscapes[i]).toBeDefined());
    expect(soundscapeIndex(0,2)).toBe(0);expect(soundscapeIndex(5,0,false)).toBe(5);
  });
  it('has unique motifs and valid pitches/tempos',()=>{
    expect(midiFrequency(69)).toBe(440);expect(midiFrequency(57)).toBe(220);
    expect(new Set(soundscapes.map(s=>`${s.root}/${s.bpm}/${s.melody.join(',')}`)).size).toBe(10);
    for(const s of soundscapes){expect(s.bpm).toBeGreaterThan(0);expect(s.melody.length).toBeGreaterThan(0);expect(s.chords.length).toBe(4);}
  });
  it('preserves the explicitly supplied resume destination',()=>expect(profile.resumeUrl).toBe('https://drive.google.com/file/d/1OUpDvnZUzZc_PHhuugRdXb00gtgxOoNJ/view?usp=drive_link'));
});
describe('companion travel and idle behavior',()=>{
  it('walks during ordinary travel and prioritizes motion over idle dancing',()=>{
    expect(companionState({world:4,idle:22,speed:.2,clicks:0})).toBe('walking');
    expect(companionState({world:0,idle:22,speed:2,clicks:0})).toBe('running');
  });
  it('waves and dances after ten seconds without replacing the road helmet with a laptop',()=>{
    expect(companionState({world:4,idle:10,speed:0,clicks:0})).toBe('waving');
    expect(companionState({world:4,idle:15,speed:0,clicks:0})).toBe('dancing');
    for(let idle=0;idle<60;idle++)expect(companionState({world:4,idle,speed:0,clicks:0})).not.toBe('typing');
  });
});
