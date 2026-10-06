import { useCallback, useState } from 'react';
import { analytics } from '../lib/analytics';
import { Dialog } from './Dialog';

export function AnalyticsPrivacy() {
  const [choice, setChoice] = useState(analytics.choice);
  const [open, setOpen] = useState(false);
  const close = useCallback(()=>setOpen(false), []);
  function choose(value: 'allowed' | 'declined') { analytics.setChoice(value); setChoice(value); setOpen(false); }
  return <>
    <button className="privacy-access" onClick={()=>setOpen(true)} aria-label="Privacy and analytics preferences">Privacy</button>
    {analytics.configured && !choice && !open && <aside className="analytics-notice" aria-label="Optional analytics">
      <p>Help me understand how people explore this world.</p>
      <span>Optional Google Analytics uses cookies to measure visits and interactions.</span>
      <div><button onClick={()=>choose('declined')}>No thanks</button><button onClick={()=>choose('allowed')}>Allow analytics</button><button onClick={()=>setOpen(true)} aria-label="Read analytics privacy details">Details</button></div>
    </aside>}
    {open && <Dialog title="Privacy & analytics" onClose={close}>
      <div className="analytics-details">
        <p>This is Darshan Krishna N's personal professional portfolio. Optional Google Analytics helps me understand which chapters, projects and contact actions visitors find useful.</p>
        <h3>Your choice</h3>
        <p>Analytics stays off until you allow it. Your preference is stored in this browser. Do Not Track and Global Privacy Control signals also keep Analytics off.</p>
        <h3>What is measured</h3>
        <p>If you allow Analytics, Google receives visit and interaction data, browser/device information and approximate location information. Google Analytics cookies distinguish visits. This site sends chapter names, project names and action labels; its custom events do not send your email address or form content.</p>
        <p>Advertising personalization and Google signals are disabled in this integration. Google processes Analytics data according to its own policies. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses data from sites that use its services ↗</a></p>
        <h3>Other services</h3>
        <p>Arcade trailers use YouTube embeds. Resume and social links open third-party services with their own privacy policies. This Analytics preference controls Google Analytics on this portfolio.</p>
        <p>Questions: <a href="mailto:darshankrishna2k2@gmail.com">contact Darshan</a>.</p>
        <p className="analytics-choice-status">{!analytics.configured?'Analytics is inactive in this environment.':choice==='allowed'?'Your choice: analytics allowed.':choice==='declined'?'Your choice: analytics declined.':'Your choice: analytics off until allowed.'}</p>
        <div className="analytics-preferences"><button className="button secondary" onClick={()=>choose('declined')}>Keep analytics off</button><button className="button" onClick={()=>choose('allowed')}>Allow analytics</button></div>
      </div>
    </Dialog>}
  </>;
}
