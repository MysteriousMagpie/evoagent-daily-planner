
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Save } from 'lucide-react';
import { usePlanner } from '../../hooks/usePlanner';

export const Controls = () => {
  const { state, approvePlan, savePlan } = usePlanner();

  if (!state.currentPlan) {
    return null;
  }

  const { currentPlan } = state;

  return (
    <div className="flex space-x-3">
      {!currentPlan.approved ? (
        <>
          <Button onClick={approvePlan} className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Approve Plan</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </>
      ) : (
        <Button onClick={savePlan} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save to Daily Note</span>
        </Button>
      )}
    </div>
  );
};
