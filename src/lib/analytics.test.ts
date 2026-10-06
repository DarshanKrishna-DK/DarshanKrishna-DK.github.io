import { afterEach, expect, it, vi } from 'vitest';
import { analyticsEnabled, browserAnalytics, parseAnalyticsChoice, PortfolioAnalytics, portfolioLinkEvent, type AnalyticsSettings } from './analytics';
import { profile } from '../data/profile';

const settings: AnalyticsSettings = {
  measurementId: 'G-TEST123456', production: true, origin: 'https://darshan-krishna-dk.me', pathname: '/',
  allowedHosts: ['darshan-krishna-dk.me'], referrer: 'https://example.com/recruiter?email=private@example.com',
};
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
it('loads no tag before consent, cancels a pending load on withdrawal and can be enabled again',()=>{
  vi.stubEnv('PROD',true);vi.stubEnv('VITE_GA_MEASUREMENT_ID',settings.measurementId);
  let saved:string|null=null;
  const callbacks:Array<()=>void>=[];
  const appended:unknown[]=[];
  const testWindow:Record<string,unknown>={requestIdleCallback:(callback:()=>void)=>callbacks.push(callback)};
  vi.stubGlobal('window',testWindow);
  vi.stubGlobal('location',{origin:settings.origin,pathname:'/',hostname:'darshan-krishna-dk.me'});
  vi.stubGlobal('navigator',{doNotTrack:null});
  vi.stubGlobal('localStorage',{getItem:()=>saved,setItem:(_key:string,value:string)=>{saved=value;}});
  vi.stubGlobal('document',{referrer:'',cookie:'_ga=visitor',getElementById:()=>null,createElement:()=>({}),head:{append:(script:unknown)=>appended.push(script)}});
  const tracker=browserAnalytics();tracker.pageView('projects');tracker.event('project_open',{project:'sahay'});
  expect(testWindow.dataLayer).toBeUndefined();expect(callbacks).toHaveLength(0);
  tracker.setChoice('allowed');expect(saved).toBe('allowed');expect(callbacks).toHaveLength(1);
  expect(Array.from((testWindow.dataLayer as IArguments[]).at(-1)!)[2]).toMatchObject({chapter:'projects'});
  tracker.setChoice('declined');callbacks[0]();expect(appended).toHaveLength(0);
  expect(testWindow[`ga-disable-${settings.measurementId}`]).toBe(true);
  const count=(testWindow.dataLayer as unknown[]).length;tracker.event('contact_click');
  expect(testWindow.dataLayer).toHaveLength(count);
  tracker.setChoice('allowed');callbacks[1]();expect(appended).toHaveLength(1);
  expect(testWindow[`ga-disable-${settings.measurementId}`]).toBe(false);
});
it('requires an explicit known analytics choice rather than treating arbitrary stored values as permission',()=>{
  expect(parseAnalyticsChoice(null)).toBeNull();
  expect(parseAnalyticsChoice('true')).toBeNull();
  expect(parseAnalyticsChoice('allowed')).toBe('allowed');
  expect(parseAnalyticsChoice('declined')).toBe('declined');
});
it('does not track dev, unknown domains, invalid IDs or browser opt-outs',()=>{
  for(const change of [{production:false},{origin:'http://localhost:5173'},{origin:'https://preview.vercel.app'},{measurementId:''},{measurementId:'<script>'},{doNotTrack:'1'},{globalPrivacyControl:true}]) {
    const calls:unknown[][]=[];new PortfolioAnalytics({...settings,...change},(...args)=>calls.push(args)).pageView('spawn');
    expect(calls).toHaveLength(0);
  }
  expect(analyticsEnabled(settings)).toBe(true);
});
it('counts chapter changes once while preserving return visits and virtual referrers',()=>{
  const calls:unknown[][]=[];const tracker=new PortfolioAnalytics(settings,(...args)=>calls.push(args));
  tracker.pageView('entry');tracker.pageView('entry');tracker.pageView('spawn');tracker.pageView('spawn');tracker.pageView('devlab');tracker.pageView('spawn');
  const views=calls.filter(c=>c[0]==='event'&&c[1]==='page_view');
  expect(views).toHaveLength(4);
  expect(views[0][2]).toMatchObject({page_referrer:'https://example.com',page_location:'https://darshan-krishna-dk.me/'});
  expect(views[2][2]).toMatchObject({page_referrer:'https://darshan-krishna-dk.me/#spawn',page_location:'https://darshan-krishna-dk.me/#devlab'});
});
it('disables ad features and strips query strings from page context',()=>{
  const calls:unknown[][]=[];const tracker=new PortfolioAnalytics({...settings,pathname:'/?email=private@example.com#random'},(...args)=>calls.push(args));tracker.pageView('campfire');
  expect(calls[1][2]).toMatchObject({send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
  expect(JSON.stringify(calls)).not.toContain('private@example.com');
  expect(JSON.stringify(calls)).not.toContain('#random');
});
it('records contact destinations by label without transmitting email or full profile links',()=>{
  expect(portfolioLinkEvent(`mailto:${profile.email}`)).toEqual({name:'contact_click',parameters:{method:'email'}});
  expect(portfolioLinkEvent(profile.resumeUrl)).toEqual({name:'resume_open',parameters:{destination:'resume'}});
  expect(portfolioLinkEvent(profile.socials[0].url)).toEqual({name:'social_click',parameters:{network:'LinkedIn'}});
  expect(portfolioLinkEvent('https://unrelated.example')).toBeNull();
});
it('does not interrupt the portfolio when the measurement transport fails',()=>{
  expect(()=>{const tracker=new PortfolioAnalytics(settings,()=>{throw new Error('blocked');});tracker.pageView('projects');tracker.event('project_open',{project:'sahay'});}).not.toThrow();
});
