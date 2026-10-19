import { Stack, Typography } from '@mui/material';
import { AddressSearchForm } from './address-search-form';

export const CtaFinalSection = () => {
  return (
    <Stack className='cta-final'>
      <Typography className='cta-final-title' component='h2'>
        Prêt à essayer ? Il suffit d'une adresse.
      </Typography>
      <Typography className='cta-final-sub'>Vous obtenez votre pré-diagnostic en 2 minutes, sans engagement.</Typography>
      <AddressSearchForm />
    </Stack>
  );
};
