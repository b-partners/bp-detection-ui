import { CheckApiKeyDialog } from '@/components';
import { useDialog } from './use-dialog';

export const useCheckApiKey = () => {
  const { open } = useDialog();
  return () => {
    open(<CheckApiKeyDialog />);
  };
};
