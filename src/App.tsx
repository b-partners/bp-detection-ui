import '@/App.css';
import { AppHeader } from '@/components';
import { AcknowledgementsStep, AnnotateImageStep, GetAddressStep } from '@/components/steps';
import { useStep } from '@/hooks';
import { MainStyle as style } from '@/style';
import { useGeoAnnotatorStore } from '@bpartners/roof-analyser';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { clearCached, ParamsUtilities } from './utilities';

const steps = [
  {
    label: 'Renseignez votre adresse',
    subtitle: 'Saisissez votre adresse',
    description: 'Tapez simplement votre adresse postale - c’est tout ce dont nous avons besoin.',
    content: <GetAddressStep />,
  },
  {
    label: 'Visualisez et délimitez votre toiture',
    subtitle: 'Haute résolution',
    description: 'Visualisez votre maison en très haute résolution (5 cm/pixel) via imagerie satellite.',
    content: <AnnotateImageStep />,
  },
  {
    label: 'Analysez l’état via BIRDIA',
    subtitle: 'L’IA analyse votre toit',
    description: 'Surface, pente, matériaux, fissures, mousses, humidité - détectés automatiquement.',
    // The roof analyser runs the analysis inside the previous step: this one is only shown as reached.
    content: <AnnotateImageStep />,
  },
  {
    label: 'Notre couvreur vous téléphone',
    subtitle: 'Suivi personnalisé',
    description: 'L’expert toiture vous rappelle pour parcourir votre pré-diagnostic sous 48 h.',
    content: <AcknowledgementsStep />,
  },
];

function App() {
  const { actualStep, setSession } = useStep();
  const geoScreen = useGeoAnnotatorStore(({ screen }) => screen);
  const isAnalysing = actualStep === 1 && (geoScreen === 'analyse' || geoScreen === 'report');
  const headerStep = isAnalysing ? 2 : actualStep;

  const navigate = useNavigate();

  useEffect(() => {
    setSession(v4());
    clearCached.isEmailSent();
    clearCached.notificationAlreadySent();
    clearCached.isAnnotationAlreadySaved();
    const { apiKey } = ParamsUtilities.getQueryParams();
    if (!apiKey) navigate('/api-key');
  }, []);

  return (
    <Box sx={style}>
      {/* The first step is a self-contained landing page, so the app header
          (branding banner + wizard steps strip) is hidden there. */}
      {actualStep !== 0 && <AppHeader activeStep={headerStep} steps={steps} />}
      {steps[actualStep].content}
    </Box>
  );
}

export default App;
