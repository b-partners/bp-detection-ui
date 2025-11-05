import { Dialog, useMediaQuery } from '@mui/material';
import { useDialog } from '../hooks';

export const GlobalDialog = () => {
  const { close, content, isOpen, closeOnBlur, style } = useDialog();
  const matches = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <Dialog
      fullScreen={!matches}
      sx={{ ...style, '& .MuiDialogContent-root': { maxWidth: '90vw' } }}
      maxWidth='lg'
      open={isOpen}
      onClose={closeOnBlur ? close : () => {}}
    >
      {content}
    </Dialog>
  );
};
