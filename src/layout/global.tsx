import { GlobalDialog, GlobalSnackbar } from '@/components';
import { Box, SxProps, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
const disclaimerStyle: SxProps = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
};

export const GlobalLayout = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100dvh' }}>
      <Outlet />
      <GlobalDialog />
      <GlobalSnackbar />
      <Typography sx={disclaimerStyle}>Ce service est fourni par Birdia</Typography>
    </Box>
  );
};
