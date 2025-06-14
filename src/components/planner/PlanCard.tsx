
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { usePlanner } from '../../hooks/usePlanner';

export const PlanCard = () => {
  const { state } = usePlanner();

  if (!state.currentPlan) {
    return null;
  }

  const { currentPlan } = state;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Daily Plan</h3>
        {currentPlan.approved && (
          <Badge className="bg-green-100 text-green-800">Approved</Badge>
        )}
      </div>
      
      <div className="space-y-3">
        {currentPlan.items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              item.type === 'event' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.type === 'event' ? (
                <Calendar className="w-4 h-4 text-blue-600" />
              ) : (
                <Clock className="w-4 h-4 text-green-600" />
              )}
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">
                  {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                </p>
              </div>
            </div>
            
            <Badge 
              variant="secondary"
              className={item.type === 'event' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
            >
              {item.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
