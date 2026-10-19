import { Box, Typography } from '@mui/material';

type Step = { title: string; description: string };

const steps: Step[] = [
  {
    title: "Renseignez l'adresse",
    description: 'Une adresse postale suffit — rien à installer.',
  },
  {
    title: 'Visualisez votre toit',
    description: 'Imagerie aérienne ultra HD (5 cm/pixel) de votre département.',
  },
  {
    title: 'Analyse par IA',
    description: 'Surface, pente, matériaux, usure, humidité détectés automatiquement.',
  },
  {
    title: 'Recevez votre rapport',
    description: 'Votre pré-diagnostic complet, généré dès la fin de l’analyse.',
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
        {steps.map(({ title, description }, index) => (
          <Box className='step' key={title}>
            <Box className='step-num'>{index + 1}</Box>
            <Typography className='step-title' component='h3'>
              {title}
            </Typography>
            <Typography className='step-desc'>{description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
