import { Event } from '@/types';
import * as ical from 'ical.js';          // pnpm add ical.js
import { isToday } from 'date-fns';

/** -------- configuration -------- */
const DEFAULT_SRC = '/cal/today.ics';     // served from public/ in dev
const FALLBACK_DELAY = 300;               // ms wait before mock

/** Mock data if real feed missing                                */
const mockEvents: Event[] = [
  {
    id: 'standup',
    title: 'Team Stand-up',
    start: new Date().setHours(9, 0, 0, 0),
    end:   new Date().setHours(9, 30, 0, 0),
    description: 'Daily sync'
  },
  {
    id: 'client',
    title: 'Client Call',
    start: new Date().setHours(14, 0, 0, 0),
    end:   new Date().setHours(15, 0, 0, 0),
    description: 'Q-review'
  }
] satisfies Event[];

/** Public API – returns only *today’s* VEVENTS, sorted */
export async function getTodayEvents(src: string = DEFAULT_SRC): Promise<Event[]> {
  try {
    const raw = await fetch(src).then(r => {
      if (!r.ok) throw new Error('ICS not found');      // fall to mock
      return r.text();
    });
    return parseICalFile(raw).filter(ev => isToday(ev.start));
  } catch (err) {
    console.warn('[ical] using mock events →', err);
    await new Promise(r => setTimeout(r, FALLBACK_DELAY));
    const today = new Date().toDateString();
    return mockEvents.filter(e => new Date(e.start).toDateString() === today);
  }
}

/** Parse ICS text → Event[] (browser safe via ical.js)            */
export function parseICalFile(ics: string): Event[] {
  const comp  = new ical.Component(ical.parse(ics));
  const ve    = comp.getAllSubcomponents('vevent') as ical.Component[];

  return ve.map(v => {
    const ev = new ical.Event(v);
    return {
      id:   ev.uid ?? crypto.randomUUID(),
      title: ev.summary,
      start: ev.startDate.toJSDate(),
      end:   ev.endDate.toJSDate(),
      description: ev.description ?? ''
    } as Event;
  }).sort((a, b) => +a.start - +b.start);
}
