import { Box, Stack, Typography } from '@mui/material';
import { AddressSearchForm } from './address-search-form';

type Step = { title: string; subtitle: string; description: string };

const steps: Step[] = [
  {
    title: 'Renseignez votre adresse',
    subtitle: 'Saisissez votre adresse',
    description: 'Tapez simplement votre adresse postale — c’est tout ce dont nous avons besoin.',
  },
  {
    title: 'Visualisez votre maison en HD',
    subtitle: 'Haute résolution',
    description: 'Visualisez votre maison en très haute résolution (5 cm/pixel) via imagerie satellite.',
  },
  {
    title: 'Lancez le diagnostic',
    subtitle: 'L’IA analyse votre toit',
    description: 'Surface, matériaux, usure, moisissure, humidité — détectés automatiquement.',
  },
  {
    title: 'Comprenez votre rapport',
    subtitle: 'Rapport détaillé',
    description: 'Score global, catégorie A-E, conseils pédagogiques de votre artisan couvreur.',
  },
  {
    title: 'Un couvreur vous contacte sous 48 h',
    subtitle: 'Suivi personnalisé',
    description: 'L’expert toiture vous rappelle pour parcourir votre pré-diagnostic.',
  },
];

export const HowItWorksSection = () => {
  return (
    <Box className='landing-howto'>
      <Box className='section-head'>
        <Typography className='section-head-title' component='h2'>
          Comment ça marche
        </Typography>
        <Typography className='section-head-sub'>Un parcours pensé pour aller vite, sans jargon.</Typography>
      </Box>

      <Box className='steps'>
        {steps.map(({ title, subtitle, description }, index) => (
          <Box className={`step ${index === 0 ? 'active' : ''}`} key={title}>
            <Box className='step-num'>{index + 1}</Box>
            <Typography className='step-title' component='h3'>
              {title}
            </Typography>
            <Typography className='step-subtitle'>{subtitle}</Typography>
            <Typography className='step-desc'>{description}</Typography>
          </Box>
        ))}
      </Box>

      <Stack className='cta-inline'>
        <Typography className='cta-inline-title' component='h3'>
          Prêt à essayer ? <span className='accent'>Il suffit d'une adresse.</span>
        </Typography>
        <Typography className='cta-inline-sub'>Vous obtenez votre pré-diagnostic en 2 minutes, sans engagement.</Typography>
        <AddressSearchForm />
      </Stack>
    </Box>
  );
};
