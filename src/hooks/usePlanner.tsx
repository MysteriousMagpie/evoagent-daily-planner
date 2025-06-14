import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Event, Task, DailyPlan, PlanItem } from '../types';
import { generateDailyPlan } from '../lib/plan';
import { getTodayEvents } from '../lib/ical';
import { getOpenTasks } from '../lib/tasks';
import { format } from 'date-fns';

interface PlannerState {
  events: Event[];
  tasks: Task[];
  currentPlan: DailyPlan | null;
  isLoading: boolean;
  error: string | null;
}

type PlannerAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_PLAN'; payload: DailyPlan }
  | { type: 'APPROVE_PLAN' }
  | { type: 'SET_ERROR'; payload: string };

const getInitialState = (): PlannerState => {
  try {
    const storedTasks = localStorage.getItem('tasks');
    const storedPlan = localStorage.getItem('currentPlan');

    const tasks = storedTasks ? JSON.parse(storedTasks) : getOpenTasks();
    
    let currentPlan = null;
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      // Revive date objects from string representation
      currentPlan = {
        ...parsedPlan,
        date: new Date(parsedPlan.date),
        items: parsedPlan.items.map((item: PlanItem) => ({
          ...item,
          start: new Date(item.start),
          end: new Date(item.end),
        })),
      };
    }
    
    return {
      events: [],
      tasks,
      currentPlan,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load state from localStorage", error);
    // Fallback to default state if parsing fails
    return {
      events: [],
      tasks: getOpenTasks(),
      currentPlan: null,
      isLoading: false,
      error: null,
    };
  }
};

const initialState: PlannerState = getInitialState();

const plannerReducer = (state: PlannerState, action: PlannerAction): PlannerState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_PLAN':
      return { ...state, currentPlan: action.payload };
    case 'APPROVE_PLAN':
      return {
        ...state,
        currentPlan: state.currentPlan
          ? { ...state.currentPlan, approved: true }
          : null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const PlannerContext = createContext<{
  state: PlannerState;
  dispatch: React.Dispatch<PlannerAction>;
  generatePlan: () => Promise<void>;
  loadTodayEvents: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  approvePlan: () => void;
  savePlan: () => void;
} | null>(null);

const generatePlanMarkdown = (plan: DailyPlan): string => {
  let markdown = `# Daily Plan - ${format(plan.date, 'EEEE, MMMM d, yyyy')}\n\n`;
  plan.items.forEach(item => {
    const startTime = format(item.start, 'HH:mm');
    const endTime = format(item.end, 'HH:mm');
    const checkbox = item.type === 'task' ? '- [ ]' : '-';
    markdown += `${checkbox} ${startTime}-${endTime}: ${item.title} (${item.type})\n`;
  });
  return markdown;
};

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [state.tasks]);

  useEffect(() => {
    try {
      if (state.currentPlan) {
        localStorage.setItem('currentPlan', JSON.stringify(state.currentPlan));
      } else {
        localStorage.removeItem('currentPlan');
      }
    } catch (error) {
      console.error("Failed to save plan to localStorage", error);
    }
  }, [state.currentPlan]);

  const loadTodayEvents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const events = await getTodayEvents();
      dispatch({ type: 'SET_EVENTS', payload: events });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load events' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generatePlan = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const plan = generateDailyPlan(state.events, state.tasks);
      dispatch({ type: 'SET_PLAN', payload: plan });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate plan' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const approvePlan = () => {
    dispatch({ type: 'APPROVE_PLAN' });
  };

  const savePlan = () => {
    if (state.currentPlan && state.currentPlan.approved) {
      console.log('Saving plan to daily note:', state.currentPlan);
      const markdown = generatePlanMarkdown(state.currentPlan);
      localStorage.setItem('dailyPlanMarkdown', markdown);
      alert('Plan saved as Markdown to localStorage!');
    }
  };

  return (
    <PlannerContext.Provider value={{
      state,
      dispatch,
      generatePlan,
      loadTodayEvents,
      addTask,
      updateTask,
      deleteTask,
      approvePlan,
      savePlan
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
