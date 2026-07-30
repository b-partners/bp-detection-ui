import { useAccountInfoStore } from '@/queries';
import { PALETTE_COLORS } from '@/utilities/theme';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';

const endPagePaperStyle = {
  p: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: {
    xs: '97vw',
    md: '94vw',
    lg: '92vw',
  },
};

const titleStyle = { mb: 3, color: '#455a64', textAlign: 'center', width: { xs: '50%', md: '60%' } };

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

export const AcknowledgementsStep = () => {
  const { website, feedbackLink } = useAccountInfoStore();

  return (
    <Stack sx={endPagePaperStyle}>
      <Typography variant='h5' sx={titleStyle}>
        Merci d’avoir analysé votre toiture, notre expert toiture va vous contacter dans les plus bref délais.
      </Typography>
      <Stack direction='row' spacing={2} mt={2}>
        <Button variant='contained' size='large' onClick={() => window.location.replace(website)} sx={cta}>
          Laisser un commentaire
        </Button>
        <Button variant='contained' size='large' onClick={() => window.location.replace(feedbackLink)} sx={backButtonStyle}>
          Retourner à l'accueil
        </Button>
      </Stack>
    </Stack>
  );
};
