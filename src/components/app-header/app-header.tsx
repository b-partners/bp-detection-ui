import { useAccountInfoQuery, useAccountInfoStore } from '@/queries';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
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

const FrenchFlag = () => (
  <span className='fr-flag'>
    <span className='fr-blue' />
    <span className='fr-white' />
    <span className='fr-red' />
  </span>
);

export const AppHeader = ({ activeStep, steps }: AppHeaderProps) => {
  const isAccountLoading = useAccountInfoQuery();
  const { image, name, address, city, postalCode, email, phone, website } = useAccountInfoStore();

  const websiteLabel = website?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const websiteUrl = website && (/^https?:\/\//.test(website) ? website : `https://${website}`);
  const cityLine = [postalCode, city].filter(Boolean).join(' ');

  // Try the native mailto first; if no mail client handles it (the window never
  // loses focus), fall back to Gmail's web compose in a new tab.
  const handleEmailClick = () => {
    if (!email) return;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    const timer = window.setTimeout(() => {
      if (!document.hidden && document.hasFocus()) window.open(gmailHref, '_blank', 'noopener,noreferrer');
    }, 600);
    window.addEventListener('blur', () => window.clearTimeout(timer), { once: true });
  };

  return (
    <Box sx={HeaderStyle}>
      <Box className='hero-split'>
        <Box className='partner-card' component='aside'>
          <Box className='partner-card-logo'>
            {isAccountLoading ? <Skeleton variant='rectangular' width='100%' height='100%' /> : <img src={image} alt={name || 'Logo du couvreur'} />}
          </Box>
          <Box className='partner-body'>
            {isAccountLoading ? (
              <>
                <Skeleton className='partner-name' variant='text' width='70%' />
                <Skeleton className='partner-addr' variant='text' width='90%' />
                <Skeleton className='partner-contact' variant='text' width='60%' />
              </>
            ) : (
              <>
                {name && <Typography className='partner-name'>{name}</Typography>}
                {(address || cityLine) && (
                  <Typography className='partner-addr'>
                    {address}
                    {address && cityLine && <br />}
                    {cityLine}
                  </Typography>
                )}
                {(phone || email || websiteLabel) && (
                  <Box className='partner-contact'>
                    {phone && (
                      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                        <strong>{phone}</strong>
                      </a>
                    )}
                    {phone && (email || websiteLabel) && <br />}
                    {email && (
                      <a href={`mailto:${email}`} onClick={handleEmailClick}>
                        {email}
                      </a>
                    )}
                    {email && websiteLabel && <br />}
                    {websiteLabel && (
                      <a href={websiteUrl} target='_blank' rel='noopener noreferrer'>
                        {websiteLabel}
                      </a>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        <Stack className='hero-content'>
          <Box className='fr-badge'>
            <FrenchFlag />
            <span>
              <strong>IA 100% française</strong> · <em>issue de la recherche</em>
            </span>
          </Box>
          <Typography className='hero-title' component='h1'>
            Pré-diagnostiquez votre toiture <span className='accent'>sans monter dessus.</span>
          </Typography>
          <Typography className='hero-lead'>
            Notre IA analyse votre toit depuis l'imagerie aérienne ultra HD de votre département, en 2 minutes. Votre couvreur local vous recontacte sous 24 h.
          </Typography>
        </Stack>
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
