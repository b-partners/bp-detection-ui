import type { SvgIconComponent } from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PublicIcon from '@mui/icons-material/Public';
import StraightenIcon from '@mui/icons-material/Straighten';
import { Box, Stack, Typography } from '@mui/material';
import { BirdiaTechnologyStyle as style } from './styles';

type FeatureTag = { label: string; variant?: 'blue' | 'green' | 'orange' };

type Feature = {
  Icon: SvgIconComponent;
  title: string;
  description: string;
  tags: FeatureTag[];
};

const features: Feature[] = [
  {
    Icon: PublicIcon,
    title: 'Imagerie satellite 5 cm/pixel',
    description: 'Une résolution équivalente à une photo aérienne professionnelle, sans déplacement ni drone.',
    tags: [{ label: 'Haute définition' }, { label: 'Sans drone', variant: 'blue' }],
  },
  {
    Icon: AutoAwesomeIcon,
    title: 'Détection IA des pathologies',
    description: 'Usure, moisissure, humidité, obstacles : chaque anomalie est localisée et quantifiée.',
    tags: [
      { label: 'Usure', variant: 'green' },
      { label: 'Moisissure', variant: 'orange' },
      { label: 'Humidité', variant: 'blue' },
    ],
  },
  {
    Icon: StraightenIcon,
    title: 'Mesures automatiques',
    description: 'Surface, matériaux, obstacles : votre couvreur prépare son intervention avec des données fiables.',
    tags: [{ label: 'Surface m²' }, { label: 'Matériaux' }, { label: 'Obstacles' }],
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
          Imagerie haute résolution + intelligence artificielle : nous détectons en quelques secondes les pathologies de votre toit, sans qu'un humain ne monte
          sur l'échelle.
        </Typography>
      </Stack>

      <Stack className='section-content'>
        <Box className='preview-card'>
          <Box className='preview-label preview-label-usure'>
            <Box className='dot' sx={{ bgcolor: '#2E9E52' }} />
            <span>Usure détectée</span>
          </Box>
          <Box className='preview-label preview-label-moisissure'>
            <Box className='dot' sx={{ bgcolor: '#FF521B' }} />
            <span>Moisissure</span>
          </Box>
          <Box className='preview-label preview-label-humide'>
            <Box className='dot' sx={{ bgcolor: '#3B82F6' }} />
            <span>Zone humide</span>
          </Box>
        </Box>

        <Stack className='feature-list'>
          {features.map(({ Icon, title, description, tags }) => (
            <Box className='feature-card' key={title}>
              <Box className='feature-icon'>
                <Icon fontSize='inherit' />
              </Box>
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
      </Stack>
    </Stack>
  );
};
