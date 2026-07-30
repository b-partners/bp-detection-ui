import { Box, Divider, Stack, Typography } from '@mui/material';
import { TestimonialsStyle as style } from './styles';

type Review = {
  rating: number; // out of 5
  quote: string;
  initials: string;
  name: string;
  role: string;
};

type TrustBadge = { icon: string; title: string; subtitle: string; variant: 'rgpd' | 'ssl' | 'rge' | 'ia' };

// Edit these to change the testimonials displayed on the address step.
const reviews: Review[] = [
  {
    rating: 5,
    quote: "Rapport clair de l'état de ma toiture. L'artisan m'a rappelée le lendemain avec un devis adapté — sans monter sur le toit.",
    initials: 'CM',
    name: 'Claire M.',
    role: 'Propriétaire · Seyssinet',
  },
  {
    rating: 5,
    quote: "Super outil pour préparer la visite. J'ai gagné un temps fou : je suis arrivé chez le client avec le diagnostic déjà en main.",
    initials: 'JL',
    name: 'Julien L.',
    role: 'Artisan couvreur · Grenoble',
  },
  {
    rating: 5,
    quote: 'Le rapport est très pédagogique : on comprend la note, les pathologies détectées, et les conseils sont concrets. Aucune mauvaise surprise.',
    initials: 'SD',
    name: 'Sophie D.',
    role: 'Propriétaire · Échirolles',
  },
  {
    rating: 4,
    quote: "Diagnostic rapide et fidèle. J'ai fait un démoussage avant l'hiver. Le couvreur recommandé est passé dans la semaine.",
    initials: 'PB',
    name: 'Pierre B.',
    role: 'Propriétaire · Eybens',
  },
];

const averageRating = '4,9/5';
const reviewsCount = 'sur 200+ avis vérifiés';

const trustBadges: TrustBadge[] = [
  { icon: '✔️', title: 'Conforme RGPD', subtitle: 'Données hébergées en France', variant: 'rgpd' },
  { icon: '🔒', title: 'Chiffrement SSL', subtitle: 'Transferts sécurisés', variant: 'ssl' },
  { icon: '🏆', title: 'Couvreur RGE', subtitle: 'Artisan certifié Qualibat', variant: 'rge' },
  { icon: '🛰️', title: 'IA satellite', subtitle: 'Précision 5 cm/pixel', variant: 'ia' },
];

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span className={`star ${i < rating ? 'star-filled' : 'star-empty'}`} key={i}>
      {i < rating ? '★' : '☆'}
    </span>
  ));

export const TestimonialsSection = () => {
  return (
    <Stack sx={style}>
      <Stack direction='row' className='section-header'>
        <Stack className='section-heading'>
          <Typography className='section-eyebrow'>Ils nous ont fait confiance</Typography>
          <Typography className='section-title' component='h2'>
            Plus de 200 propriétaires accompagnés
          </Typography>
        </Stack>
        <Stack direction='row' className='rating-summary'>
          <Box className='rating-stars'>{renderStars(5)}</Box>
          <Typography className='rating-score'>{averageRating}</Typography>
          <Typography className='rating-count'>{reviewsCount}</Typography>
        </Stack>
      </Stack>

      <Box className='review-cards'>
        {reviews.map(({ rating, quote, initials, name, role }) => (
          <Box className='review-card' key={name}>
            <Typography className='review-mark'>“</Typography>
            <Box className='review-stars'>{renderStars(rating)}</Box>
            <Typography className='review-quote'>{quote}</Typography>
            <Divider className='review-divider' />
            <Stack direction='row' className='review-author'>
              <Box className='review-avatar'>{initials}</Box>
              <Box>
                <Typography className='review-name'>{name}</Typography>
                <Typography className='review-role'>{role}</Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      <Divider className='trust-divider' />

      <Box className='trust-badges'>
        {trustBadges.map(({ icon, title, subtitle, variant }) => (
          <Stack direction='row' className='trust-badge' key={title}>
            <Box className={`trust-icon trust-icon-${variant}`}>{icon}</Box>
            <Box>
              <Typography className='trust-title'>{title}</Typography>
              <Typography className='trust-subtitle'>{subtitle}</Typography>
            </Box>
          </Stack>
        ))}
      </Box>

      <Divider className='trust-divider' />

      <Typography className='trust-footer'>🛡️ Données 100% sécurisées · Conforme RGPD · Aucun engagement</Typography>
    </Stack>
  );
};
