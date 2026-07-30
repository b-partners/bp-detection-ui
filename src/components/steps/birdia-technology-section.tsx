import { Box, Stack, Typography } from '@mui/material';
import { BirdiaTechnologyStyle as style } from './styles';

type FeatureTag = { label: string; variant?: 'blue' | 'green' | 'orange' };

type Feature = {
  icon: string;
  title: string;
  description: string;
  tags: FeatureTag[];
};

const features: Feature[] = [
  {
    icon: '🛰️',
    title: 'Imagerie satellite 5 cm/pixel',
    description: 'Une résolution équivalente à une photo aérienne professionnelle, sans déplacement ni drone.',
    tags: [{ label: 'Haute définition' }, { label: 'Sans drone', variant: 'blue' }],
  },
  {
    icon: '🧠',
    title: 'Détection IA des pathologies',
    description: 'Usure, moisissure, humidité, fissures, obstacles : chaque anomalie est localisée et quantifiée.',
    tags: [
      { label: 'Usure', variant: 'green' },
      { label: 'Moisissure', variant: 'orange' },
      { label: 'Humidité', variant: 'blue' },
    ],
  },
  {
    icon: '📐',
    title: 'Mesures automatiques',
    description: 'Surface, pente, hauteur, matériaux, obstacles : votre couvreur prépare son intervention avec des données fiables.',
    tags: [{ label: 'Surface m²' }, { label: 'Pente °' }, { label: 'Matériaux' }],
  },
];

export const BirdiaTechnologySection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-eyebrow'>Technologie Birdia</Typography>
        <Typography className='section-title' component='h2'>
          Votre toiture, vue par notre <span className='accent'>IA satellite</span>
        </Typography>
        <Typography className='section-subtitle'>
          Imagerie haute résolution + intelligence artificielle : nous détectons en quelques secondes les pathologies de votre toit, sans qu'un
          humain ne monte sur l'échelle.
        </Typography>
      </Stack>

      <Box className='section-content'>
        <Box className='preview-card'>
          <Box className='corner corner-tr' />
          <Box className='corner corner-bl' />

          <Box className='preview-label preview-label-usure'>
            <Box className='dot' sx={{ bgcolor: '#2E9E52' }} />
            <span>Usure détectée</span>
          </Box>
          <Box className='preview-label preview-label-moisissure'>
            <Box className='dot' sx={{ bgcolor: '#FF521B' }} />
            <span>Moisissure 28,6 %</span>
          </Box>
          <Box className='preview-label preview-label-humide'>
            <Box className='dot' sx={{ bgcolor: '#3B82F6' }} />
            <span>Zone humide</span>
          </Box>

          <Box className='preview-stats'>
            <Box className='preview-stat'>
              <Typography className='stat-value'>273,70 m²</Typography>
              <Typography className='stat-label'>Surface</Typography>
            </Box>
            <Box className='preview-stat'>
              <Typography className='stat-value'>16,85 %</Typography>
              <Typography className='stat-label'>Pente</Typography>
            </Box>
            <Box className='preview-stat'>
              <Typography className='stat-value'>Cat. D</Typography>
              <Typography className='stat-label'>Note IA</Typography>
            </Box>
          </Box>
        </Box>

        <Stack className='feature-list'>
          {features.map(({ icon, title, description, tags }) => (
            <Box className='feature-card' key={title}>
              <Box className='feature-icon'>{icon}</Box>
              <Box>
                <Typography className='feature-title'>{title}</Typography>
                <Typography className='feature-desc'>{description}</Typography>
                <Stack direction='row' className='feature-tags'>
                  {tags.map(({ label, variant }) => (
                    <Box className={`feature-tag ${variant ? `feature-tag-${variant}` : ''}`} key={label}>
                      {label}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
