import { Box, Stack, Typography } from '@mui/material';
import { HeaderStyle } from './style';

interface StepInfo {
  label: string;
  subtitle: string;
  description: string;
}

interface AppHeaderProps {
  activeStep: number;
  steps: StepInfo[];
}

const FrenchFlag = () => (
  <span className='fr-flag'>
    <span className='fr-blue' />
    <span className='fr-white' />
    <span className='fr-red' />
  </span>
);

export const AppHeader = ({ activeStep, steps }: AppHeaderProps) => {
  return (
    <Box sx={HeaderStyle}>
      <Box className='hero-split'>
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
        </Stack>
      </Box>

      {/* Steps strip (wired to wizard progress) */}
      <Box className='hero-steps'>
        {steps.map(({ label, subtitle, description }, index) => (
          <Box key={label} className={`step-item ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'done' : ''}`}>
            <Box className='step-index'>{index + 1}</Box>
            <Typography className='step-label'>{label}</Typography>
            <Typography className='step-subtitle'>{subtitle}</Typography>
            <Typography className='step-desc'>{description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
