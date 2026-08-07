import { Box, Stack, Typography } from '@mui/material';
import { AddressSearchForm } from './address-search-form';

const PARTNER_LOGO = '/assets/images/landing/partner-logo.png';
const HERO_BANNER = '/assets/images/landing/hero-banner.jpg';

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
      <Box className='top-nav'>
        <Box className='header-birdia'>
          <span className='dot' />
          Propulsé par <strong>BIRDIA</strong>
        </Box>
      </Box>

      <Box className='hero-split'>
        <Box className='partner-card' component='aside'>
          <Box className='partner-card-logo'>
            <img src={PARTNER_LOGO} alt='Toiture9 — Couvreur à Toulouse' />
          </Box>
          <Typography className='partner-name'>Toiture9</Typography>
          <Typography className='partner-addr'>
            28 rue Veillon
            <br />
            31500 Toulouse
          </Typography>
          <Box className='partner-contact'>
            <a href='tel:+33643020340'>
              <strong>06 43 02 03 40</strong>
            </a>
            <br />
            <a href='https://www.toiture9.fr' target='_blank' rel='noopener'>
              www.toiture9.fr
            </a>
          </Box>
        </Box>

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
            Notre IA analyse votre toit depuis l'imagerie aérienne ultra HD de votre département, en 2 minutes. Votre couvreur local vous recontacte sous 24 h.
          </Typography>

          <AddressSearchForm primary />

          <Typography className='hero-note'>
            Gratuit · sans engagement · <strong>2 min</strong>
          </Typography>
        </Stack>
      </Box>

      <Box className='hd-banner' sx={{ backgroundImage: `url(${HERO_BANNER})` }}>
        <Box className='hd-banner-caption'>
          <span className='hd-tag'>Image aérienne très haute résolution · 5 cm/pixel</span>
        </Box>
      </Box>
    </Box>
  );
};
