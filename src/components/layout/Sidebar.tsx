
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const Sidebar = () => {
  const currentDate = new Date();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">EvoAgent X</h1>
        <p className="text-sm text-gray-500 mt-1">Daily Focus Agent</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
          >
            <Calendar className="w-5 h-5" />
            <span>Daily Focus</span>
          </a>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{format(currentDate, 'EEEE, MMM d')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{format(currentDate, 'h:mm a')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
