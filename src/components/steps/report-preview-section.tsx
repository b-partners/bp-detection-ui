import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { ReportPreviewStyle as style } from './styles';

type IdentityRow = { label: string; value: string; highlight?: boolean; placeholder?: boolean };
type HealthBar = { label: string; value: string; ratio: number; alert?: boolean };
type HealthFlag = { label: string; value: string };
type Grade = { letter: string; variant: string; label: string };

const identityRows: IdentityRow[] = [
  { label: 'Surface totale', value: '201,73 m²' },
  { label: 'Hauteur du bâtiment', value: 'Non renseigné', placeholder: true },
  { label: 'Pente moyenne', value: 'Non renseigné', placeholder: true },
  { label: 'Revêtement 1', value: 'Tuiles' },
  { label: 'Revêtement 2', value: 'Non renseigné', placeholder: true },
  { label: 'Obstacle / Velux', value: 'Oui', highlight: true },
];

const healthBars: HealthBar[] = [
  { label: "Taux d'usure", value: '0 %', ratio: 0 },
  { label: 'Taux de moisissure', value: '28,6 %', ratio: 0.286, alert: true },
  { label: "Taux d'humidité", value: '0 %', ratio: 0 },
];

const healthFlags: HealthFlag[] = [
  { label: 'Mutation', value: 'Néant' },
  { label: 'Fissure / Cassure', value: 'Néant' },
  { label: 'Risque de feu', value: 'Non' },
];

const grades: Grade[] = [
  { letter: 'A', variant: 'good', label: 'Excellent' },
  { letter: 'B', variant: 'preventive', label: 'Bon' },
  { letter: 'C', variant: 'maintenance', label: 'Moyen' },
  { letter: 'D', variant: 'repair', label: 'Réparation' },
  { letter: 'E', variant: 'critical', label: 'Critique' },
];

const selectedGrade = 'D';

export const ReportPreviewSection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-title' component='h2'>
          Voici ce que vous recevez après l'analyse
        </Typography>
        <Typography className='section-subtitle'>Exemple réel - toiture en tuiles, 201,73 m², analysée à Toulouse.</Typography>
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
            {identityRows.map(({ label, value, highlight, placeholder }) => (
              <Stack direction='row' className='identity-row' key={label}>
                <Typography className='identity-label'>{label}</Typography>
                <Typography className={`identity-value ${highlight ? 'identity-value-highlight' : ''} ${placeholder ? 'identity-value-unavailable' : ''}`}>
                  {value}
                </Typography>
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
            {healthBars.map(({ label, value, ratio, alert }) => (
              <Box className='health-bar' key={label}>
                <Stack direction='row' className='health-bar-head'>
                  <Typography className='health-label'>{label}</Typography>
                  <Typography className={`health-value ${alert ? 'health-value-alert' : ''}`}>{value}</Typography>
                </Stack>
                <Box className='health-track'>
                  <Box className={`health-fill ${alert ? 'health-fill-alert' : ''}`} sx={{ width: `${Math.max(ratio * 100, 3)}%` }} />
                </Box>
              </Box>
            ))}
          </Stack>
          <Divider className='card-divider card-divider-dashed' />
          <Stack className='health-flags'>
            {healthFlags.map(({ label, value }) => (
              <Stack direction='row' className='health-flag' key={label}>
                <Typography className='flag-label'>{label}</Typography>
                <Typography className='flag-value'>{value}</Typography>
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
              22,88<span className='degradation-unit'>%</span>
            </Typography>
            <Typography className='degradation-caption'>Dégradation globale</Typography>
            <Box className='grade-cats'>
              {grades.map(({ letter, variant, label }) => (
                <Box className={`grade-cat grade-cat-${variant} ${letter === selectedGrade ? 'grade-cat-active' : ''}`} key={letter}>
                  <span>{letter}</span>
                  <small>{label}</small>
                </Box>
              ))}
            </Box>
            <Divider className='card-divider card-divider-dashed' />
            <Typography className='degradation-verdict'>Réparation nécessaire.</Typography>
            <Typography className='degradation-detail'>
              Moisissure significative, vigilance autour des cheminées et velux. Pas de fissure ni d'usure visible.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};
