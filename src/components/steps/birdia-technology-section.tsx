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
    title: 'Imagerie aérienne 5 cm/pixel',
    description: 'Une résolution ultra HD couvrant tout votre département, sans déplacement ni drone à mobiliser.',
    tags: [{ label: 'Ultra HD' }, { label: 'Sans drone', variant: 'blue' }],
  },
  {
    Icon: AutoAwesomeIcon,
    title: 'Détection IA des pathologies',
    description: 'Usure, moisissure, humidité, fissures, obstacles : chaque anomalie est localisée et quantifiée.',
    tags: [
      { label: 'Usure', variant: 'green' },
      { label: 'Moisissure', variant: 'orange' },
      { label: 'Humidité', variant: 'blue' },
    ],
  },
  {
    Icon: StraightenIcon,
    title: 'Mesures automatiques',
    description: 'Surface, pente, hauteur, matériaux, obstacles : votre couvreur prépare son intervention avec des données fiables.',
    tags: [{ label: 'Surface m²' }, { label: 'Pente °' }, { label: 'Matériaux' }],
  },
];

const FrenchFlag = () => (
  <span className='fr-flag'>
    <span className='fr-blue' />
    <span className='fr-white' />
    <span className='fr-red' />
  </span>
);

export const BirdiaTechnologySection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-title' component='h2'>
          Votre toiture, pour votre <span className='accent'>entretien, assurance, vente immobilière</span>
        </Typography>
        <Box className='fr-badge'>
          <FrenchFlag />
          <span>
            <strong>Innovation française</strong> · <em>IA issue de la recherche</em>
          </span>
        </Box>
        <Typography className='section-subtitle'>
          Un rapport simple, avec les détails de votre toiture et ses plans, pour obtenir un devis rapide et argumenter face à votre assureur, un futur
          acquéreur ou votre couvreur.
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
