import { clearCached } from '@/utilities';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { CtaFinalSection } from './cta-final-section';
import { HeroSection } from './hero-section';
import { HowItWorksSection } from './how-it-works-section';
import { LandingFooter } from './landing-footer';
import { GetAddressStepStyle as style } from './styles';

// Minimalist landing: demo video, technology, report preview/carousel and testimonials are kept as components but unwired.
export const GetAddressStep = () => {
  useEffect(() => {
    clearCached.all();
  }, []);

  return (
    <Stack sx={style} alignItems='center'>
      <HeroSection />
      <HowItWorksSection />
      <LandingFooter />
    </Stack>
  );
};
