import '@/App.css';
import { GlobalDialog, GlobalSnackbar } from '@/components';
import { AnnotateImageStep, DetectionResultStep, GetAddressStep } from '@/components/steps';
import { useStep } from '@/hooks';
import { MainStyle as style } from '@/style';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { useGetRooferLogoQuery } from './queries';
import { clearCached, ParamsUtilities } from './utilities';

const steps = [
  {
    label: 'Renseignez votre adresse',
    content: <GetAddressStep />,
  },
  {
    label: 'Visualisez et délimitez votre toiture',
    content: <AnnotateImageStep />,
  },
  {
    label: 'Analysez l’état via BIRDIA',
    content: <DetectionResultStep />,
  },
];

function App() {
  const { actualStep, setSession } = useStep();

  const navigate = useNavigate();

  useEffect(() => {
    setSession(v4());
    clearCached.isEmailSent();
    clearCached.notificationAlreadySent();
    clearCached.isAnnotationAlreadySaved();
    const { apiKey } = ParamsUtilities.getQueryParams();
    if (!apiKey) navigate('/api-key');
  }, []);

  const { data } = useGetRooferLogoQuery();

  return (
    <Box sx={style}>
      <Box className={`img-container ${actualStep === 0 ? 'img-full' : 'img-min'}`}>
        <img alt='bird-ia-logo' src={data || '/assets/images/bird-ia-lg-logo.png'} />
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
