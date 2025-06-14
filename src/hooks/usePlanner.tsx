
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Event, Task, DailyPlan } from '../types';
import { generateDailyPlan } from '../lib/plan';
import { getTodayEvents } from '../lib/ical';
import { getOpenTasks } from '../lib/tasks';

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

const initialState: PlannerState = {
  events: [],
  tasks: getOpenTasks(),
  currentPlan: null,
  isLoading: false,
  error: null
};

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

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

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
    if (state.currentPlan) {
      console.log('Saving plan to daily note:', state.currentPlan);
      // Placeholder for saving to daily note
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
