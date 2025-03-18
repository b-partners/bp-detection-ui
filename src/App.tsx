import '@/App.css';
import { GlobalDialog } from '@/components';
import { AnnotateImageStep, DetectionLoadingStep, DetectionResultStep, GetAddressStep } from '@/components/steps';
import { useStep } from '@/hooks';
import { MainStyle as style } from '@/style';
import { Stack, Step, StepContent, StepLabel, Stepper } from '@mui/material';

function App() {
  const { actualStep } = useStep();

  return (
    <Stack sx={style}>
      <img alt='bp-ia-logo' src='/assets/images/bp-ia-logo.png' />
      <Stepper activeStep={actualStep} orientation='vertical'>
        <Step>
          <StepLabel>Récupération de votre adresse</StepLabel>
          <StepContent>
            <GetAddressStep />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Délimitation de votre toiture</StepLabel>
          <StepContent>
            <AnnotateImageStep />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Analyse de votre toiture</StepLabel>
          <StepContent>
            <DetectionLoadingStep />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Résulta de l'analyse</StepLabel>
          <StepContent>
            <DetectionResultStep />
          </StepContent>
        </Step>
        <GlobalDialog />
      </Stepper>
    </Stack>
  );
}

export default App;
