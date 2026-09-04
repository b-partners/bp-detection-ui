import type { SvgIconComponent } from '@mui/icons-material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { ReportPreviewStyle as style } from './styles';

type IdentityRow = { label: string; value: string; highlight?: boolean; placeholder?: boolean };
type HealthBar = { label: string; value: string; ratio: number; alert?: boolean };
type HealthFlag = { label: string; value: string };
type Grade = { letter: string; variant: string; title: string; description: string; Icon: SvgIconComponent };
type Advice = { Icon: SvgIconComponent; title: string; description: string; variant: 'search' | 'broom' | 'pick' | 'calendar' };

const identityRows: IdentityRow[] = [
  { label: 'Surface totale', value: '201,73 m²' },
  { label: 'Hauteur du bâtiment', value: 'Non renseigné', placeholder: true },
  { label: 'Pente moyenne', value: 'Non renseigné', placeholder: true },
  { label: 'Revêtement', value: 'Tuiles' },
  { label: 'Obstacle / Velux', value: 'Oui', highlight: true },
];

const healthBars: HealthBar[] = [
  { label: "Taux d'usure", value: '0 %', ratio: 0 },
  { label: 'Taux de moisissure', value: '68,59 %', ratio: 0.6859, alert: true },
  { label: "Taux d'humidité", value: '0 %', ratio: 0 },
];

const healthFlags: HealthFlag[] = [
  { label: 'Mutation', value: 'Néant' },
  { label: 'Fissure / Cassure', value: 'Néant' },
  { label: 'Risque de feu', value: 'Non' },
];

const grades: Grade[] = [
  { letter: 'A', variant: 'good', title: 'Toiture en bon état', description: 'Aucune intervention visible nécessaire', Icon: GppGoodOutlinedIcon },
  { letter: 'B', variant: 'preventive', title: 'Entretien préventif', description: 'Pour garder la toiture en bonne santé', Icon: BlockOutlinedIcon },
  { letter: 'C', variant: 'maintenance', title: 'Intervention nécessaire', description: 'Pour ralentir le vieillissement', Icon: BuildOutlinedIcon },
  { letter: 'D', variant: 'repair', title: 'Réparation prioritaire', description: 'Dégradation visible, risque à traiter', Icon: TrendingUpOutlinedIcon },
  { letter: 'E', variant: 'critical', title: 'Risque critique', description: 'Intervention urgente à prévoir', Icon: WarningAmberRoundedIcon },
];

const selectedGrade = 'E';

const advices: Advice[] = [
  {
    Icon: SearchOutlinedIcon,
    title: 'Inspection ciblée',
    description: 'Vérifier les zones de moisissure étendue relevées sur plusieurs pans de la toiture, en particulier autour des cheminées.',
    variant: 'search',
  },
  {
    Icon: CleaningServicesOutlinedIcon,
    title: 'Entretien recommandé',
    description: 'Procéder à un démoussage complet pour traiter la moisissure détectée sur une large partie de la toiture.',
    variant: 'broom',
  },
  {
    Icon: ConstructionOutlinedIcon,
    title: 'Travaux à envisager',
    description: "Envisager le remplacement des tuiles les plus atteintes et vérifier l'étanchéité autour des cheminées et obstacles.",
    variant: 'pick',
  },
  {
    Icon: EventRepeatOutlinedIcon,
    title: 'Suivi annuel',
    description: "Le niveau de dégradation détecté justifie une expertise terrain rapide pour confirmer l'étendue des travaux à prévoir.",
    variant: 'calendar',
  },
];

export const ReportPreviewSection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-eyebrow'>Aperçu d'un rapport Birdia</Typography>
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
              54,87<span className='degradation-unit'>%</span>
            </Typography>
            <Typography className='degradation-caption'>Dégradation globale</Typography>
            <Stack className='grade-scale'>
              <Box className='grade-cards'>
                {grades.map(({ letter, variant, title, description, Icon }) => (
                  <Box className={`grade-card grade-card-${variant} ${letter === selectedGrade ? 'grade-card-selected' : ''}`} key={letter}>
                    <Box className='grade-icon'>
                      <Icon fontSize='inherit' />
                    </Box>
                    <Typography className='grade-title'>{title}</Typography>
                    <Typography className='grade-desc'>{description}</Typography>
                  </Box>
                ))}
              </Box>
              <Box className='grade-meter'>
                {grades.map(({ letter, variant }) => (
                  <Box className='grade-meter-col' key={letter}>
                    <Box className={`grade-meter-bar grade-meter-bar-${variant}`} />
                    {letter === selectedGrade ? <Box className='grade-meter-pointer' /> : <Box className='grade-meter-dot' />}
                  </Box>
                ))}
              </Box>
            </Stack>
            <Divider className='card-divider card-divider-dashed' />
            <Typography className='degradation-verdict'>Risque critique.</Typography>
            <Typography className='degradation-detail'>
              Moisissure très étendue sur plusieurs pans et autour des cheminées. Taux d'usure et d'humidité non mesurés sur cette zone.
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box className='advice-panel'>
        <Stack direction='row' className='advice-header'>
          <Box className='advice-header-icon'>
            <AutoAwesomeOutlinedIcon fontSize='inherit' />
          </Box>
          <Typography className='advice-header-title'>Conseiller IA personnalisé</Typography>
        </Stack>
        <Box className='advice-grid'>
          {advices.map(({ Icon, title, description, variant }) => (
            <Stack direction='row' className='advice-item' key={title}>
              <Box className={`advice-icon advice-icon-${variant}`}>
                <Icon fontSize='inherit' />
              </Box>
              <Box>
                <Typography className='advice-title'>{title}</Typography>
                <Typography className='advice-desc'>{description}</Typography>
              </Box>
            </Stack>
          ))}
        </Box>
        <Stack direction='row' className='advice-disclaimer'>
          <WarningAmberOutlinedIcon fontSize='inherit' />
          <span>Rapport généré par IA statistique nécessitant confirmation par votre expert toiture.</span>
        </Stack>
      </Box>
    </Stack>
  );
};
