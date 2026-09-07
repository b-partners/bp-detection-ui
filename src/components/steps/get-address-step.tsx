import { clearCached } from '@/utilities';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { BirdiaTechnologySection } from './birdia-technology-section';
import { CtaFinalSection } from './cta-final-section';
import { DemoVideoSection } from './demo-video-section';
import { HeroSection } from './hero-section';
import { HowItWorksSection } from './how-it-works-section';
import { LandingFooter } from './landing-footer';
import { ReportPreviewSection } from './report-preview-section';
import { GetAddressStepStyle as style } from './styles';
import { TrustStripSection } from './trust-strip-section';

// The testimonials section is held back pending a call on whether to ship
// fabricated reviews/ratings, or real ones sourced later.
export const GetAddressStep = () => {
  useEffect(() => {
    clearCached.all();
  }, []);

  return (
    <Stack sx={style} alignItems='center'>
      <HeroSection />
      <TrustStripSection />
      <HowItWorksSection />
      <DemoVideoSection />
      <BirdiaTechnologySection />
      <ReportPreviewSection />
      <CtaFinalSection />
      <LandingFooter />
    </Stack>
  );
};
