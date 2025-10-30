import '@/App.css';
import { GlobalDialog, GlobalSnackbar } from '@/components';
import { AnnotateImageStep, DetectionResultStep, GetAddressStep } from '@/components/steps';
import { useCheckApiKey, useStep } from '@/hooks';
import { MainStyle as style } from '@/style';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import { clearCached, ParamsUtilities } from './utilities';

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
    label: "Résultat de l'analyse",
    content: <DetectionResultStep />,
  },
];

function App() {
  const { actualStep, setSession } = useStep();
  const checkApiKey = useCheckApiKey();

  useEffect(() => {
    setSession(v4());
    clearCached.isEmailSent();
    const { apiKey } = ParamsUtilities.getQueryParams();
    if (!apiKey) checkApiKey();
  }, []);

  return (
    <Box sx={style}>
      <Box className={`img-container ${actualStep === 0 ? 'img-full' : 'img-min'}`}>
        <img alt='bird-ia-logo' src='/assets/images/bird-ia-lg-logo.png' />
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
      <GlobalSnackbar />
    </Box>
  );
}

export default App;
