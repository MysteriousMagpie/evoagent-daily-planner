
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock } from 'lucide-react';
import { usePlanner } from '../../hooks/usePlanner';

export const TaskList = () => {
  const { state, deleteTask } = usePlanner();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (state.tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks added yet. Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {state.tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{task.estimatedDuration} min</span>
              </div>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
