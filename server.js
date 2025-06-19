import express from 'express';
import ical from 'ical';
import path from 'path';
import os from 'os';

const app = express();
const PORT = 3001;

// TODO: Replace this with your actual file path
const calendarPath = path.join(
  os.homedir(),
  'Library/Calendars',
  'YOUR_CALENDAR_FILENAME.ics'
);

app.get('/api/today', (req, res) => {
  try {
    const rawEvents = ical.parseFile(calendarPath);
    const today = new Date().toDateString();

    const events = Object.values(rawEvents)
      .filter(ev => ev.type === 'VEVENT')
      .map(ev => ({
        title: ev.summary,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }))
      .filter(ev => new Date(ev.start).toDateString() === today)
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    res.json(events);
  } catch (err) {
    console.error('❌ Failed to read calendar:', err);
    res.status(500).json({ error: 'Calendar read failed' });
  }
});

app.listen(PORT, () => {
  console.log(`📅 EvoAgent calendar server running on http://localhost:${PORT}`);
});
