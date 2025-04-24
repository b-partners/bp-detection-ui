import { Dialog } from '@mui/material';
import { useDialog } from '../hooks';

export const GlobalDialog = () => {
  const { close, content, isOpen, closeOnBlur, style } = useDialog();

  return (
    <Dialog sx={style} open={isOpen} onClose={closeOnBlur ? close : () => {}}>
      {content}
    </Dialog>
  );
};
