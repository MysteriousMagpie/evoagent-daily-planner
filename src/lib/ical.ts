
import { Event } from '../types';

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
  // Simulate async file reading
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real implementation, this would parse a local .ics file
  // For now, return mock data filtered to today
  const today = new Date();
  return mockEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  });
};

export const parseICalFile = (icalContent: string): Event[] => {
  // Placeholder for actual iCal parsing
  // Would use a library like ical.js in production
  console.log('Parsing iCal content:', icalContent);
  return mockEvents;
};
