import { GlobalDialog, GlobalSnackbar } from '@/components';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const GlobalLayout = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100dvh' }}>
      <Outlet />
      <GlobalDialog />
      <GlobalSnackbar />
    </Box>
  );
};
