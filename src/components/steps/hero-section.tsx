import { defaultLogo, useAccountInfoQuery, useAccountInfoStore } from '@/queries';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
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
      <Box className='hero-split'>
        <Box className='partner-card' component='aside'>
          <Box className='partner-card-logo'>
            {isAccountLoading ? (
              <Skeleton variant='rectangular' width='100%' height='100%' />
            ) : (
              <img src={image} alt={name || 'Logo du couvreur'} onError={e => (e.currentTarget.src = defaultLogo)} />
            )}
          </Box>
          {isAccountLoading ? (
            <>
              <Skeleton className='partner-name' variant='text' width='55%' />
              <Typography className='partner-addr'>
                <Skeleton variant='text' width='80%' />
              </Typography>
              <Box className='partner-contact'>
                <Skeleton variant='text' width='50%' />
                <Skeleton variant='text' width='70%' />
              </Box>
            </>
          ) : (
            <>
              {name && <Typography className='partner-name'>{name}</Typography>}
              {addressLine && (
                <Typography className='partner-addr'>
                  <a href={mapsUrl} target='_blank' rel='noopener noreferrer'>
                    {addressLine}
                  </a>
                </Typography>
              )}
              {(phone || email || websiteLabel) && (
                <Box className='partner-contact'>
                  {phone && (
                    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                      <strong>{phone}</strong>
                    </a>
                  )}
                  {phone && (email || websiteLabel) && <br />}
                  {email && (
                    <a href={`mailto:${email}`} onClick={handleEmailClick}>
                      {email}
                    </a>
                  )}
                  {email && websiteLabel && <br />}
                  {websiteLabel && (
                    <a href={websiteUrl} target='_blank' rel='noopener noreferrer'>
                      {websiteLabel}
                    </a>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
        <Typography className='hero-title' component='h1'>
          Pré-diagnostiquez votre toiture <span className='accent'>sans monter dessus.</span>
        </Typography>
        <Typography className='hero-lead'>
          Notre IA analyse votre toit depuis l'imagerie aérienne ultra HD de votre département, en 2 minutes. Vous recevez votre rapport complet.
        </Typography>

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
