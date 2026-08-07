import { clearCached } from '@/utilities';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { BirdiaTechnologySection } from './birdia-technology-section';
import { CtaFinalSection } from './cta-final-section';
import { DemoVideoSection } from './demo-video-section';
import { HeroSection } from './hero-section';
import { HowItWorksSection } from './how-it-works-section';
import { LandingFooter } from './landing-footer';
import { ReportCarouselSection } from './report-carousel-section';
import { ReportPreviewSection } from './report-preview-section';
import { GetAddressStepStyle as style } from './styles';
import { TestimonialsSection } from './testimonials-section';

export const GetAddressStep = () => {
  useEffect(() => {
    clearCached.all();
  }, []);

  return (
    <Stack sx={style} alignItems='center'>
      <HeroSection />
      <HowItWorksSection />
      <DemoVideoSection />
      <BirdiaTechnologySection />
      <ReportPreviewSection />
      <ReportCarouselSection />
      <TestimonialsSection />
      <CtaFinalSection />
      <LandingFooter />
    </Stack>
  );
};
