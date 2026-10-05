import { describe, expect, it } from 'vitest';
import { sampleJourney, worldProgress, hashWorld } from './journey';
import { companionState, maySpeak } from './companion';

describe('connected journey', () => {
  it('clamps invalid/outside positions and keeps the last world reachable', () => {
    expect(sampleJourney(-3).index).toBe(0);
    expect(sampleJourney(NaN).index).toBe(0);
    expect(sampleJourney(20).index).toBe(6);
    expect(sampleJourney(1).index).toBe(6);
  });
  it('maps direct destinations to matching camera beats', () => {
    expect(sampleJourney(worldProgress('devrel')).index).toBe(3);
    expect(sampleJourney(worldProgress('road')).index).toBe(4);
    expect(hashWorld('#arcade')).toBe('arcade');
    expect(hashWorld('#unknown')).toBe('spawn');
  });
  it('moves continuously across scene boundaries', () => {
    const before = sampleJourney(2.999 / 6).camera;
    const after = sampleJourney(3.001 / 6).camera;
    expect(Math.abs(before[2] - after[2])).toBeLessThan(0.2);
  });
});

describe('Gundu', () => {
  it('waves, dances and eventually sleeps after inactivity', () => {
    expect(companionState({ world: 0, idle: 13, speed: 0, clicks: 0 })).toBe('waving');
    expect(companionState({ world: 0, idle: 18, speed: 0, clicks: 0 })).toBe('dancing');
    expect(companionState({ world: 0, idle: 61, speed: 0, clicks: 0 })).toBe('sleeping');
  });
  it('reacts to speed and clicking before world-specific idle actions', () => {
    expect(companionState({ world: 4, idle: 0, speed: 3, clicks: 0 })).toBe('running');
    expect(companionState({ world: 3, idle: 0, speed: 0, clicks: 5 })).toBe('annoyed');
    expect(companionState({ world: 4, idle: 0, speed: 0, clicks: 0 })).toBe('helmet');
  });
  it('prevents repeated unsolicited dialogue', () => {
    expect(maySpeak(2000, 0)).toBe(false);
    expect(maySpeak(15000, 0)).toBe(true);
  });
});
