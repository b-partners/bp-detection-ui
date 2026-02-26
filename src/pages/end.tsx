import { PALETTE_COLORS } from '@/utilities/theme';
import { Button, Paper, Stack, SxProps, Typography } from '@mui/material';
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

const cta = {
  ...backButtonStyle,
  backgroundColor: PALETTE_COLORS.neon_orange,
  '&:hover': { backgroundColor: PALETTE_COLORS.neon_orange + '80' },
};

export const EndPage = () => {
  const { image, website, feedbackLink } = useLoaderData();

  return (
    <Paper sx={endPagePaperStyle} elevation={1}>
      <img src={image} alt='logo' />
      <Typography variant='h5' sx={titleStyle}>
        Merci d’avoir analysé votre toiture, notre expert toiture va vous contacter dans les plus bref délais.
      </Typography>
      <Stack direction='row' spacing={2}>
        <Button variant='contained' size='large' onClick={() => window.location.replace(website)} sx={cta}>
          LAisser un commentaire
        </Button>
        <Button variant='contained' size='large' onClick={() => window.location.replace(feedbackLink)} sx={backButtonStyle}>
          Retourner à l'accueil
        </Button>
      </Stack>
    </Paper>
  );
};
