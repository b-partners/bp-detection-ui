import '@/App.css';
import { GlobalDialog } from '@/components';
import { AnnotateImageStep, DetectionLoadingStep, DetectionResultStep, GetAddressStep } from '@/components/steps';
import { useStep } from '@/hooks';
import { MainStyle as style } from '@/style';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect } from 'react';
import { v4 } from 'uuid';

const steps = [
  {
    label: 'Récupération de votre adresse',
    content: <GetAddressStep />,
  },
  {
    label: 'Délimitation de votre toiture',
    content: <AnnotateImageStep />,
  },
  {
    label: 'Analyse de votre toiture',
    content: <DetectionLoadingStep />,
  },
  {
    label: "Résulta de l'analyse",
    content: <DetectionResultStep />,
  },
];

function App() {
  const { actualStep, setSession } = useStep();

  useEffect(() => {
    setSession(v4());
  }, []);

  return (
    <Box sx={style}>
      <Box className={`img-container ${actualStep === 0 ? 'img-full' : 'img-min'}`}>
        <img alt='bp-ia-logo' src='/assets/images/bp-ia-logo.png' />
      </Box>
      <Stepper activeStep={actualStep} alternativeLabel>
        {steps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {steps[actualStep].content}
      <GlobalDialog />
    </Box>
  );
}

export default App;
