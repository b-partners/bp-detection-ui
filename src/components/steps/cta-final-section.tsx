import { Stack, Typography } from '@mui/material';
import { AddressSearchForm } from './address-search-form';

export const CtaFinalSection = () => {
  return (
    <Stack className='cta-final'>
      <Typography className='cta-final-title' component='h2'>
        Analysez votre toiture <span className='accent'>maintenant.</span>
      </Typography>
      <Typography className='cta-final-sub'>2 minutes suffisent. Vous recevez votre pré-diagnostic et un rappel de Toiture9 sous 24 h.</Typography>
      <AddressSearchForm />
      <Typography className='cta-final-note'>
        Gratuit · sans engagement · <strong>2 min</strong>
      </Typography>
    </Stack>
  );
};
