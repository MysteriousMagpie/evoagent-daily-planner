
import { Task } from '../types';

export const mockOpenTasks: Task[] = [
  {
    id: '1',
    title: 'Review pull requests',
    estimatedDuration: 45,
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'Write documentation',
    estimatedDuration: 60,
    priority: 'medium',
    completed: false
  },
  {
    id: '3',
    title: 'Update project dependencies',
    estimatedDuration: 30,
    priority: 'low',
    completed: false
  }
];

export const getOpenTasks = (): Task[] => {
  return mockOpenTasks.filter(task => !task.completed);
};
