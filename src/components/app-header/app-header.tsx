import { useAccountInfoQuery, useAccountInfoStore } from '@/queries';
import { Box, Skeleton, Typography } from '@mui/material';
import { HeaderStyle } from './style';

interface StepInfo {
  label: string;
  subtitle: string;
  description: string;
}

interface AppHeaderProps {
  activeStep: number;
  steps: StepInfo[];
}

interface StatInfo {
  value: string;
  unit: string;
  label: string;
}

const stats: StatInfo[] = [
  { value: '<2', unit: 'min', label: 'Pour votre pré-diagnostic' },
  { value: '5', unit: 'cm/px', label: 'Précision image satellite' },
  { value: '48', unit: 'h', label: 'Recontact par votre couvreur' },
  { value: '100', unit: '%', label: 'Gratuit · sans engagement' },
];

export const AppHeader = ({ activeStep, steps }: AppHeaderProps) => {
  const isAccountLoading = useAccountInfoQuery();
  const { image, name, address, city, postalCode, email, phone, website } = useAccountInfoStore();

  const websiteLabel = website?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <Box sx={HeaderStyle}>
      <Box className='hero-card'>
        {/* Brand + contact */}
        <Box className='hero-brand'>
          <Box className='hero-logo-card'>
            {isAccountLoading ? <Skeleton variant='rectangular' width='100%' height='100%' /> : <img alt='roofer-logo' src={image} />}
          </Box>
          {isAccountLoading ? (
            <Box className='hero-contact'>
              <Skeleton className='company-name' variant='text' width='60%' />
              <Skeleton className='contact-line' variant='text' width='85%' />
              <Skeleton className='contact-line' variant='text' width='70%' />
              <Skeleton className='contact-line' variant='text' width='45%' />
            </Box>
          ) : (
            <Box className='hero-contact'>
              {name && <Typography className='company-name'>{name}</Typography>}
              {(address || postalCode || city) && (
                <Typography className='contact-line strong'>{[address, [postalCode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</Typography>
              )}
              {(email || phone) && <Typography className='contact-line'>{[email, phone].filter(Boolean).join(' · ')}</Typography>}
              {websiteLabel && <Typography className='contact-line'>{websiteLabel}</Typography>}
            </Box>
          )}
        </Box>

        {/* Headline */}
        <Box className='hero-headline'>
          <Box className='hero-badge'>
            <Box component='span' className='dot' />
            <Box component='span'>★ Nouveau · Diagnostic IA par satellite</Box>
          </Box>
          <Typography className='hero-title' component='h1'>
            Pré-diagnostiquez votre toiture sans monter dessus{' '}
            <Box component='span' className='accent'>
              en moins de 2 min
            </Box>
          </Typography>
        </Box>

        {/* Aside */}
        <Box className='hero-aside'>
          <Typography className='aside-title'>Diagnostic instantané et vous êtes recontactés dans les 48 h.</Typography>
          <Typography className='aside-text'>
            Notre outil d'analyse par satellite et intelligence artificielle vous donne un pré-diagnostic complet sur l'état de votre toiture — accompagné des
            conseils de votre couvreur de confiance.
          </Typography>
        </Box>
      </Box>

      {/* Stats bar */}
      <Box className='hero-stats'>
        {stats.map(({ value, unit, label }) => (
          <Box key={label} className='stat'>
            <Typography className='stat-value'>
              {value}
              <Box component='span' className='unit'>
                {unit}
              </Box>
            </Typography>
            <Typography className='stat-label'>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Steps strip (wired to wizard progress) */}
      <Box className='hero-steps'>
        {steps.map(({ label, subtitle, description }, index) => (
          <Box key={label} className={`step-item ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'done' : ''}`}>
            <Box className='step-index'>{index + 1}</Box>
            <Typography className='step-label'>{label}</Typography>
            <Typography className='step-subtitle'>{subtitle}</Typography>
            <Typography className='step-desc'>{description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
