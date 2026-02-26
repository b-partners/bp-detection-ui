import { GlobalDialog, GlobalSnackbar } from '@/components';
import { SxProps, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
const disclaimerStyle: SxProps = {
  position: 'absolute',
  bottom: 1,
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
};

export const GlobalLayout = () => {
  return (
    <>
      <Outlet />
      <GlobalDialog />
      <GlobalSnackbar />
      <Typography sx={disclaimerStyle}>Ce service est fourni par Birdia</Typography>
    </>
  );
};
