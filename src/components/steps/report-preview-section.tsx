import { Box, Divider, Stack, Typography } from '@mui/material';
import { ReportPreviewStyle as style } from './styles';

type IdentityRow = { label: string; value: string; highlight?: boolean };
type HealthBar = { label: string; value: string; ratio: number; alert?: boolean };
type HealthFlag = { label: string; value: string };
type Grade = { letter: string; label: string };
type Advice = { icon: string; title: string; description: string; variant: 'search' | 'broom' | 'pick' | 'calendar' };

const identityRows: IdentityRow[] = [
  { label: 'Surface totale', value: '273,70 m²' },
  { label: 'Hauteur du bâtiment', value: '7,4 m' },
  { label: 'Pente moyenne', value: '16,85 %' },
  { label: 'Revêtement 1', value: 'Tuiles' },
  { label: 'Revêtement 2', value: 'Tôle ondulée' },
  { label: 'Obstacle / Velux', value: 'Oui', highlight: true },
];

const healthBars: HealthBar[] = [
  { label: "Taux d'usure", value: '0 %', ratio: 0 },
  { label: 'Taux de moisissure', value: '28,6 %', ratio: 0.286, alert: true },
  { label: "Taux d'humidité", value: '0 %', ratio: 0 },
];

const healthFlags: HealthFlag[] = [
  { label: 'Mutation', value: 'néant' },
  { label: 'Fissure / Cassure', value: 'néant' },
  { label: 'Risque de feu', value: 'néant' },
];

const grades: Grade[] = [
  { letter: 'A', label: 'Excellent' },
  { letter: 'B', label: 'Bon' },
  { letter: 'C', label: 'Moyen' },
  { letter: 'D', label: 'Réparation' },
  { letter: 'E', label: 'Critique' },
];

const selectedGrade = 'D';

const advices: Advice[] = [
  {
    icon: '🔍',
    title: 'Inspection ciblée',
    description: "Vérifier les zones autour des obstacles (cheminées, fenêtres de toit), les rives et les noues pour prévenir tout risque d'infiltration.",
    variant: 'search',
  },
  {
    icon: '🧹',
    title: 'Entretien recommandé',
    description: 'Procéder à un démoussage doux pour retirer les moisissures. Nettoyer les gouttières pour prévenir tout blocage.',
    variant: 'broom',
  },
  {
    icon: '⛏️',
    title: 'Travaux à envisager',
    description: "Envisager le remplacement des tuiles atteintes par la moisissure et surveiller l'étanchéité autour des obstacles.",
    variant: 'pick',
  },
  {
    icon: '📅',
    title: 'Suivi annuel',
    description: 'Étant donnée la présence de moisissure, un suivi annuel est conseillé, particulièrement après des épisodes climatiques intenses.',
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
        <Typography className='section-subtitle'>Exemple réel — toiture en tuiles, 273,70 m², analysée à Toulouse.</Typography>
      </Stack>

      <Box className='report-cards'>
        <Box className='report-card'>
          <Stack direction='row' className='card-header'>
            <Box className='card-icon'>🏠</Box>
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
            <Box className='card-icon'>📊</Box>
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
            <Box className='card-icon'>🎯</Box>
            <Typography className='card-title'>Note de dégradation</Typography>
          </Stack>
          <Divider className='card-divider' />
          <Stack className='degradation'>
            <Typography className='degradation-rate'>
              22,88<span className='degradation-unit'>%</span>
            </Typography>
            <Typography className='degradation-caption'>Dégradation globale</Typography>
            <Stack direction='row' className='grade-scale'>
              {grades.map(({ letter, label }) => (
                <Box className={`grade-box grade-box-${letter.toLowerCase()} ${letter === selectedGrade ? 'grade-box-selected' : ''}`} key={letter}>
                  <Typography className='grade-letter'>{letter}</Typography>
                  <Typography className='grade-label'>{label}</Typography>
                </Box>
              ))}
            </Stack>
            <Divider className='card-divider card-divider-dashed' />
            <Typography className='degradation-verdict'>Catégorie D — Réparation nécessaire.</Typography>
            <Typography className='degradation-detail'>
              Moisissure significative, vigilance autour des cheminées et velux. Pas de fissure ni d'usure visible.
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box className='advice-panel'>
        <Stack direction='row' className='advice-header'>
          <Box className='advice-header-icon'>👷</Box>
          <Typography className='advice-header-title'>Conseils de votre artisan couvreur</Typography>
        </Stack>
        <Box className='advice-grid'>
          {advices.map(({ icon, title, description, variant }) => (
            <Stack direction='row' className='advice-item' key={title}>
              <Box className={`advice-icon advice-icon-${variant}`}>{icon}</Box>
              <Box>
                <Typography className='advice-title'>{title}</Typography>
                <Typography className='advice-desc'>{description}</Typography>
              </Box>
            </Stack>
          ))}
        </Box>
        <Box className='advice-disclaimer'>⚠️ Rapport généré par IA statistique nécessitant confirmation par votre expert toiture.</Box>
      </Box>
    </Stack>
  );
};
