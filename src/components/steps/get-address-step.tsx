import { clearCached } from '@/utilities';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { HeroSection } from './hero-section';
import { GetAddressStepStyle as style } from './styles';

// Sections beyond the hero (how-it-works, demo video, technology showcase, report
// preview/carousel, testimonials, final CTA, footer) are temporarily removed while
// we get this first section working end to end; they'll be reintroduced gradually.
export const GetAddressStep = () => {
  useEffect(() => {
    clearCached.all();
  }, []);

  return (
    <Stack sx={style} alignItems='center'>
      <HeroSection />
    </Stack>
  );
};
