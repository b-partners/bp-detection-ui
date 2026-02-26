import { PALETTE_COLORS } from '@/utilities/theme';
import { Button, Paper, SxProps, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

const endPagePaperStyle: SxProps = {
  p: 6,
  maxWidth: 600,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '& img': {
    maxWidth: 300,
    mb: 6,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const titleStyle = { mb: 3, color: '#455a64', textAlign: 'center' };

const backButtonStyle = {
  borderRadius: 2,
  textTransform: 'none',
  backgroundColor: PALETTE_COLORS.pine,
  '&:hover': { backgroundColor: PALETTE_COLORS.forest },
};

export const EndPage = () => {
  const { image, website } = useLoaderData();

  return (
    <Paper sx={endPagePaperStyle} elevation={1}>
      <img src={image} alt='logo' />
      <Typography variant='h5' sx={titleStyle}>
        Votre analyse de toiture est terminée. Nous vous remercions d'avoir utilisé Birdia.
      </Typography>
      <Button variant='contained' size='large' onClick={() => (window.location.href = website)} sx={backButtonStyle}>
        Retourner à l'accueil
      </Button>
    </Paper>
  );
};
