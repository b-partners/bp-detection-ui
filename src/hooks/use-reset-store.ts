import { useDialog } from './use-dialog';
import { useStep } from './use-step';

export const useRestStore = () => {
  const { reset: resetDialog } = useDialog();
  const { reset: resetStep } = useStep();

  return () => {
    resetDialog();
    resetStep();
  };
};
