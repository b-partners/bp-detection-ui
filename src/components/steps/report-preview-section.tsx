import { useAccountInfoStore } from '@/queries';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { ReportPreviewStyle as style } from './styles';

type IdentityRow = { label: string; value: string; highlight?: boolean };
type HealthBar = { label: string; value: string; ratio: number };
type HealthFlag = { label: string; value: string; tone: 'alert' | 'good' };
type Grade = { letter: string; variant: string; label: string };

const identityRows: IdentityRow[] = [
  { label: 'Surface totale', value: '252,51 m²' },
  { label: 'Surface rampante', value: '247,16 m²' },
  { label: 'Pente dominante', value: '23 °' },
  { label: 'Nombre de pans', value: '4' },
  { label: 'Revêtement principal', value: 'Tuiles' },
  { label: 'Obstacle / Velux', value: 'Oui', highlight: true },
];

const healthBars: HealthBar[] = [
  { label: "Taux d'usure", value: '20 %', ratio: 0.2 },
  { label: 'Taux de moisissure', value: '60 %', ratio: 0.6 },
  { label: "Taux d'humidité", value: '10 %', ratio: 0.1 },
];

const healthFlags: HealthFlag[] = [
  { label: 'Mutation', value: 'Dégradation', tone: 'alert' },
  { label: 'Fissure / Cassure', value: 'Non', tone: 'good' },
  { label: 'Risque végétation / feu', value: 'Oui', tone: 'alert' },
];

const grades: Grade[] = [
  { letter: 'A', variant: 'good', label: 'Bon état' },
  { letter: 'B', variant: 'preventive', label: 'Préventif' },
  { letter: 'C', variant: 'maintenance', label: 'Nécessaire' },
  { letter: 'D', variant: 'repair', label: 'Prioritaire' },
  { letter: 'E', variant: 'critical', label: 'Critique' },
];

const selectedGrade = 'E';

export const ReportPreviewSection = () => {
  const { name } = useAccountInfoStore();
  const partnerName = name || 'votre couvreur';

  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-title' component='h2'>
          Voici ce que vous recevez après l'analyse
        </Typography>
        <Typography className='section-subtitle'>Exemple réel — toiture en tuiles, 252,51 m², analysée à Toulouse.</Typography>
      </Stack>

      <Box className='report-cards'>
        <Box className='report-card'>
          <Stack direction='row' className='card-header'>
            <Box className='card-icon'>
              <HomeOutlinedIcon fontSize='inherit' />
            </Box>
            <Typography className='card-title'>Identité du bâtiment</Typography>
          </Stack>
          <Divider className='card-divider' />
          <Stack className='identity-rows'>
            {identityRows.map(({ label, value, highlight }) => (
              <Stack direction='row' className='identity-row' key={label}>
                <Typography className='identity-label'>{label}</Typography>
                <Typography className={`identity-value ${highlight ? 'identity-value-highlight' : ''}`}>{value}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box className='report-card'>
          <Stack direction='row' className='card-header'>
            <Box className='card-icon'>
              <MonitorHeartOutlinedIcon fontSize='inherit' />
            </Box>
            <Typography className='card-title'>Indicateurs santé</Typography>
          </Stack>
          <Divider className='card-divider' />
          <Stack className='health-bars'>
            {healthBars.map(({ label, value, ratio }) => (
              <Box className='health-bar' key={label}>
                <Stack direction='row' className='health-bar-head'>
                  <Typography className='health-label'>{label}</Typography>
                  <Typography className='health-value'>{value}</Typography>
                </Stack>
                <Box className='health-track'>
                  <Box className='health-fill' sx={{ width: `${ratio * 100}%` }} />
                </Box>
              </Box>
            ))}
          </Stack>
          <Divider className='card-divider card-divider-dashed' />
          <Stack className='health-flags'>
            {healthFlags.map(({ label, value, tone }) => (
              <Stack direction='row' className='health-flag' key={label}>
                <Typography className='flag-label'>{label}</Typography>
                <Typography className={`flag-value flag-value-${tone}`}>{value}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box className='report-card'>
          <Stack direction='row' className='card-header'>
            <Box className='card-icon'>
              <TrackChangesOutlinedIcon fontSize='inherit' />
            </Box>
            <Typography className='card-title'>Note de dégradation</Typography>
          </Stack>
          <Divider className='card-divider' />
          <Stack className='degradation'>
            <Typography className='degradation-rate'>
              66,0<span className='degradation-unit'>%</span>
            </Typography>
            <Typography className='degradation-caption'>Dégradation globale</Typography>
            <Box className='grade-cats'>
              {grades.map(({ letter, label }) => (
                <Box className={`grade-cat ${letter === selectedGrade ? 'grade-cat-active' : ''}`} key={letter}>
                  <small>{label}</small>
                </Box>
              ))}
            </Box>
            <Box className='grade-meter'>
              {grades.map(({ letter, variant }) => (
                <Box className={`grade-meter-bar grade-meter-bar-${variant}`} key={letter} />
              ))}
            </Box>
            <Divider className='card-divider card-divider-dashed' />
            <Typography className='degradation-verdict'>Risque critique — intervention urgente à prévoir</Typography>
          </Stack>
        </Box>
      </Box>

      <Stack direction='row' className='report-disclaimer'>
        <WarningAmberOutlinedIcon fontSize='inherit' />
        <span>
          Disclaimer : rapport généré par IA statistique nécessitant confirmation par votre expert toiture. Votre couvreur {partnerName} valide toujours les
          données avant devis.
        </span>
      </Stack>
    </Stack>
  );
};
