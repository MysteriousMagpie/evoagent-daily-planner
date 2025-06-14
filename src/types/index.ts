
export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  estimatedDuration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface PlanItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'event' | 'task';
  taskId?: string;
}

export interface DailyPlan {
  date: Date;
  items: PlanItem[];
  approved: boolean;
}
