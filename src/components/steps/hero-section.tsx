import { Box, Stack, Typography } from '@mui/material';
import { AddressSearchForm } from './address-search-form';

const FrenchFlag = () => (
  <span className='fr-flag'>
    <span className='fr-blue' />
    <span className='fr-white' />
    <span className='fr-red' />
  </span>
);

export const HeroSection = () => {
  return (
    <Box className='landing-hero'>
      <Stack className='hero-content'>
        <Box className='fr-badge'>
          <FrenchFlag />
          <span>
            <strong>IA 100% française</strong> · <em>issue de la recherche</em>
          </span>
        </Box>
        <Typography className='hero-title' component='h1'>
          Pré-diagnostiquez votre toiture <span className='accent'>sans monter dessus.</span>
        </Typography>
        <Typography className='hero-lead'>
          Notre IA analyse votre toit depuis l'imagerie aérienne ultra HD de votre département, en 2 minutes. Vous recevez votre rapport complet.
        </Typography>

        <AddressSearchForm primary />

        <Typography className='hero-note'>
          Gratuit · sans engagement · <strong>2 min</strong>
        </Typography>
      </Stack>

      <Box className='hero-banner'>
        <img src='/assets/images/landing/hero-banner.jpg' alt='Analyse BIRDIA de toitures par imagerie aérienne' />
        <span className='hero-banner-caption'>🛰️ Imagerie aérienne très haute résolution · 5 cm/pixel</span>
      </Box>
    </Box>
  );
};
