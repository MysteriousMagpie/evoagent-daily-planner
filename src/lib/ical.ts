import { Event } from '../types';
import * as ical from 'ical';

// Mock calendar events for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(9, 30, 0, 0)),
    description: 'Daily team sync meeting'
  },
  {
    id: '2',
    title: 'Client Call',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    description: 'Quarterly review with client'
  },
  {
    id: '3',
    title: 'Design Review',
    start: new Date(new Date().setHours(16, 30, 0, 0)),
    end: new Date(new Date().setHours(17, 30, 0, 0)),
    description: 'Review new feature designs'
  }
];

export const getTodayEvents = async (): Promise<Event[]> => {
  // Simulate async file reading.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, you would need a mechanism to get the iCal file content,
  // for example, through a file input, as browsers cannot access local file system directly.
  // Then you would call parseICalFile(fileContent).
  // For now, we fall back to mock data.
  const today = new Date();
  return mockEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  });
};

export const parseICalFile = (icalContent: string): Event[] => {
  // Implementation of iCal parsing using ical.js
  try {
    const data = ical.parseICS(icalContent);
    const events: Event[] = [];
    
    for (const k in data) {
      if (data.hasOwnProperty(k)) {
        const ev = data[k] as any; // Using any as @types/ical is not available
        if (ev.type === 'VEVENT') {
          events.push({
            id: ev.uid,
            title: ev.summary,
            start: new Date(ev.start),
            end: new Date(ev.end),
            description: ev.description,
          });
        }
      }
    }
    return events;
  } catch (error) {
    console.error("Error parsing iCal content:", error);
    return []; // Return empty array on error
  }
};
