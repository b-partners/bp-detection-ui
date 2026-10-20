import { captureError } from '@/utilities/sentry';
import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

// React Router catches render errors itself, so they would never reach Sentry without this element.
export const RouteError = () => {
  const error = useRouteError();

  useEffect(() => {
    captureError(error);
  }, [error]);

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' gap={2} minHeight='100dvh' p={2}>
      <Typography variant='h6'>Une erreur inattendue est survenue.</Typography>
      <Button variant='contained' onClick={() => window.location.reload()}>
        Recharger la page
      </Button>
    </Box>
  );
};
