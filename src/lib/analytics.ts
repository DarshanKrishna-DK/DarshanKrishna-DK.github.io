import { worlds, type WorldId } from '../data/worlds';
import { profile } from '../data/profile';

type Parameters = Record<string, string | number | boolean>;
type Command = (...args: unknown[]) => void;
export type AnalyticsEvent = 'journey_start' | 'project_open' | 'briefing_open' | 'anime_archive_open' | 'resume_open' | 'contact_click' | 'social_click' | 'travel_story_view';
export type AnalyticsSettings = {
  measurementId: string; production: boolean; origin: string; pathname: string;
  allowedHosts: string[]; referrer?: string; doNotTrack?: string | null; globalPrivacyControl?: boolean;
};
function referringOrigin(referrer = '') { try { const url = new URL(referrer); return /^https?:$/.test(url.protocol) ? url.origin : ''; } catch { return ''; } }
export function analyticsEnabled(settings: AnalyticsSettings) {
  try {
    const url = new URL(settings.origin);
    return settings.production && /^G-[A-Z0-9]{6,20}$/.test(settings.measurementId)
      && url.protocol === 'https:' && settings.allowedHosts.includes(url.hostname)
      && settings.doNotTrack !== '1' && settings.doNotTrack !== 'yes' && !settings.globalPrivacyControl;
  } catch { return false; }
}

/** One virtual view per settled chapter, with no query strings or arbitrary hashes. */
export class PortfolioAnalytics {
  readonly enabled: boolean;
  private lastScreen: string | null = null;
  private previousLocation: string;
  constructor(private settings: AnalyticsSettings, private command: Command) {
    this.enabled = analyticsEnabled(settings);
    this.previousLocation = referringOrigin(settings.referrer);
    if (this.enabled) {
      this.send('js', new Date());
      this.send('config', settings.measurementId, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: this.location('entry'), page_referrer: this.previousLocation,
      });
    }
  }
  private send(...args: unknown[]) { try { this.command(...args); } catch { /* Measurement never interrupts the journey. */ } }
  private location(screen: 'entry' | WorldId) {
    const url = new URL(this.settings.pathname, this.settings.origin);
    url.search = ''; url.hash = screen === 'entry' ? '' : screen;
    return url.href;
  }
  pageView(screen: 'entry' | WorldId) {
    if (!this.enabled || this.lastScreen === screen) return;
    const location = this.location(screen);
    const name = screen === 'entry' ? 'Enter the world' : worlds.find(world => world.id === screen)!.name;
    this.send('event', 'page_view', {
      send_to: this.settings.measurementId, page_title: `DARSHAN.WORLD | ${name}`,
      page_location: location, page_referrer: this.previousLocation, chapter: screen,
    });
    this.lastScreen = screen; this.previousLocation = location;
  }
  event(name: AnalyticsEvent, parameters: Parameters = {}) {
    if (this.enabled) this.send('event', name, { ...parameters, send_to: this.settings.measurementId });
  }
}

export function portfolioLinkEvent(href: string): { name: AnalyticsEvent; parameters: Parameters } | null {
  if (href === profile.resumeUrl) return { name: 'resume_open', parameters: { destination: 'resume' } };
  if (href === `mailto:${profile.email}`) return { name: 'contact_click', parameters: { method: 'email' } };
  const social = profile.socials.find(item => item.url === href);
  return social ? { name: 'social_click', parameters: { network: social.name } } : null;
}

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Command; }
  interface Navigator { readonly globalPrivacyControl?: boolean; }
}

export type AnalyticsChoice = 'allowed' | 'declined' | null;
export function parseAnalyticsChoice(value: string | null): AnalyticsChoice {
  return value === 'allowed' || value === 'declined' ? value : null;
}
const choiceKey = 'dw-analytics-choice';
function storedChoice(): AnalyticsChoice {
  try { return parseAnalyticsChoice(localStorage.getItem(choiceKey)); } catch { return null; }
}
export function browserAnalytics() {
  const browser = typeof window !== 'undefined';
  const settings: AnalyticsSettings = {
    measurementId: String(import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim(), production: import.meta.env.PROD,
    origin: browser ? location.origin : 'https://invalid.local', pathname: browser ? location.pathname : '/',
    allowedHosts: String(import.meta.env.VITE_GA_HOSTNAMES ?? 'darshan-krishna-dk.me,www.darshan-krishna-dk.me').split(',').map((host: string) => host.trim()).filter(Boolean),
    referrer: browser ? document.referrer : '', doNotTrack: browser ? navigator.doNotTrack : null,
    globalPrivacyControl: browser && navigator.globalPrivacyControl,
  };
  const configured = browser && analyticsEnabled(settings);
  let choice = browser ? storedChoice() : null;
  let currentScreen: 'entry' | WorldId = 'entry';
  let tracker: PortfolioAnalytics | null = null;
  function start() {
    if (!configured || choice !== 'allowed' || tracker) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${settings.measurementId}`] = false;
    window.dataLayer ??= [];
    window.gtag ??= function (..._args: unknown[]) { window.dataLayer!.push(arguments); };
    const load = () => {
      if (choice !== 'allowed') return;
      if (document.getElementById('portfolio-google-analytics')) return;
      const script = document.createElement('script'); script.id = 'portfolio-google-analytics'; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(settings.measurementId)}`;
      document.head.append(script);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 2500 });
    else setTimeout(load, 1000);
    tracker = new PortfolioAnalytics(settings, (...args) => window.gtag?.(...args));
  }
  start();
  return {
    configured,
    get choice() { return choice; },
    pageView(screen: 'entry' | WorldId) { currentScreen = screen; tracker?.pageView(screen); },
    event(name: AnalyticsEvent, parameters: Parameters = {}) { tracker?.event(name, parameters); },
    setChoice(next: Exclude<AnalyticsChoice, null>) {
      const wasTracking = Boolean(tracker);
      choice = next;
      try { localStorage.setItem(choiceKey, next); } catch { /* Session choice still applies. */ }
      if (next === 'allowed') { start(); tracker?.pageView(currentScreen); return; }
      tracker = null;
      if (browser && wasTracking) {
        // Stop the already loaded tag immediately, then remove its first-party cookies.
        (window as unknown as Record<string, unknown>)[`ga-disable-${settings.measurementId}`] = true;
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.trim().split('=')[0];
          if (name !== '_ga' && !name.startsWith('_ga_')) continue;
          for (const domain of ['', location.hostname, ...settings.allowedHosts]) {
            document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
          }
        }
      }
    },
  };
}
export const analytics = browserAnalytics();
