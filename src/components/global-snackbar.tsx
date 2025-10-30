import { useSnackbarStore } from '@/hooks';
import { Alert, Snackbar } from '@mui/material';

export const GlobalSnackbar = () => {
  const { open, message, type, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={closeSnackbar} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
