
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Calendar, ListTodo } from 'lucide-react';
import { usePlanner } from '../../hooks/usePlanner';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { PlanCard } from './PlanCard';
import { Controls } from './Controls';
import { format } from 'date-fns';

export const DailyPlannerPanel = () => {
  const { state, loadTodayEvents, generatePlan } = usePlanner();

  useEffect(() => {
    loadTodayEvents();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Focus Agent</h1>
        <p className="text-lg text-gray-600">
          Plan your perfect day • {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Today's Events */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Today's Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.isLoading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : state.events.length > 0 ? (
            <div className="space-y-3">
              {state.events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events scheduled for today</p>
          )}
        </CardContent>
      </Card>

      {/* Task Management */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ListTodo className="w-5 h-5 text-green-600" />
            <span>Enter Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TaskInput />
          <TaskList />
        </CardContent>
      </Card>

      {/* Generate Plan */}
      <div className="text-center">
        <Button
          onClick={generatePlan}
          disabled={state.isLoading || state.tasks.length === 0}
          size="lg"
          className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Intelligent Plan
        </Button>
      </div>

      {/* Plan Display */}
      {state.currentPlan && (
        <div className="space-y-6">
          <PlanCard />
          <div className="flex justify-center">
            <Controls />
          </div>
        </div>
      )}
    </div>
  );
};
