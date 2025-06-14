import { Event, Task, PlanItem, DailyPlan } from '../types';
import { addMinutes, isAfter, isBefore } from 'date-fns';

export const generateDailyPlan = (events: Event[], tasks: Task[]): DailyPlan => {
  const today = new Date();
  const workStart = new Date(today.setHours(8, 0, 0, 0));
  const workEnd = new Date(today.setHours(22, 0, 0, 0)); // Changed from 18:00 to 22:00
  
  // Convert events to plan items
  const eventItems: PlanItem[] = events.map(event => ({
    id: `event-${event.id}`,
    title: event.title,
    start: event.start,
    end: event.end,
    type: 'event'
  }));
  
  // Sort events by start time
  eventItems.sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Find free slots and schedule tasks
  const taskItems: PlanItem[] = [];
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  
  let currentTime = workStart;
  
  for (const task of sortedTasks) {
    // Find next available slot
    let slotFound = false;
    
    while (isBefore(currentTime, workEnd) && !slotFound) {
      const taskEnd = addMinutes(currentTime, task.estimatedDuration);
      
      // Check if this slot conflicts with any event
      const hasConflict = eventItems.some(event => {
        return (
          (isAfter(currentTime, event.start) && isBefore(currentTime, event.end)) ||
          (isAfter(taskEnd, event.start) && isBefore(taskEnd, event.end)) ||
          (isBefore(currentTime, event.start) && isAfter(taskEnd, event.end))
        );
      });
      
      if (!hasConflict && isBefore(taskEnd, workEnd)) {
        // Schedule the task
        taskItems.push({
          id: `task-${task.id}`,
          title: task.title,
          start: new Date(currentTime),
          end: taskEnd,
          type: 'task',
          taskId: task.id
        });
        
        currentTime = taskEnd;
        slotFound = true;
      } else {
        // Move to next 15-minute slot or after next event
        const nextEvent = eventItems.find(event => isAfter(event.start, currentTime));
        if (nextEvent && hasConflict) {
          currentTime = nextEvent.end;
        } else {
          currentTime = addMinutes(currentTime, 15);
        }
      }
    }
  }
  
  // Combine and sort all items
  const allItems = [...eventItems, ...taskItems].sort((a, b) => 
    a.start.getTime() - b.start.getTime()
  );
  
  return {
    date: today,
    items: allItems,
    approved: false
  };
};
