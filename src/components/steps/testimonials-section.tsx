import { Box, Divider, Stack, Typography } from '@mui/material';
import { TestimonialsStyle as style } from './styles';

type Review = {
  rating: number; // out of 5
  tag: string;
  quote: string;
  initials: string;
  name: string;
  role: string;
};

// Edit these to change the testimonials displayed on the address step.
const reviews: Review[] = [
  {
    rating: 5,
    tag: 'Entretien préventif',
    quote:
      "J'ai fait un démoussage juste avant l'hiver, exactement ce qui était recommandé dans le rapport. Le couvreur est passé la semaine suivante, ma toiture est repartie pour dix ans.",
    initials: 'PB',
    name: 'Pierre B.',
    role: 'Propriétaire · Toulouse',
  },
  {
    rating: 5,
    tag: 'Négociation assurance',
    quote:
      "Après la tempête, mon assureur voulait revoir la franchise à la baisse. Le rapport BIRDIA a servi de preuve de l'état antérieur — dossier bouclé en 3 jours au lieu de 3 mois.",
    initials: 'CM',
    name: 'Claire M.',
    role: 'Propriétaire · Balma',
  },
  {
    rating: 5,
    tag: 'Vente immobilière',
    quote:
      "Vendeur d'une maison de 1978, j'ai joint le rapport à l'annonce. Les acheteurs sont arrivés informés, sans négociation sur la toiture. Signature en 5 semaines.",
    initials: 'SD',
    name: 'Sophie D.',
    role: 'Propriétaire · Colomiers',
  },
  {
    rating: 5,
    tag: 'Achat immobilier',
    quote:
      'On a analysé la toiture avant de signer un compromis. Résultat : catégorie D. On a renégocié 8 000 € sur le prix pour refaire l’étanchéité. Merci Toiture9 pour la visite !',
    initials: 'TL',
    name: 'Thomas L.',
    role: 'Acquéreur · Blagnac',
  },
  {
    rating: 5,
    tag: 'Devis chantier',
    quote:
      "Rapport très clair. Le couvreur m'a rappelée le lendemain avec un devis chiffré, sans avoir eu à monter sur le toit. Fini les estimations à la louche.",
    initials: 'JL',
    name: 'Julie L.',
    role: 'Propriétaire · Muret',
  },
  {
    rating: 4,
    tag: 'Suivi patrimonial',
    quote:
      'Deux immeubles locatifs, deux rapports. Je sais maintenant lequel doit passer en priorité au budget travaux. C’est devenu mon tableau de bord toiture.',
    initials: 'MP',
    name: 'Marc P.',
    role: 'Bailleur · Toulouse',
  },
];

const averageRating = '4,9/5';
const reviewsCount = 'sur plus de 2 000 avis vérifiés';

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
          <Typography className='section-title' component='h2'>
            Ce que disent nos utilisateurs
          </Typography>
        </Stack>
        <Stack direction='row' className='rating-summary'>
          <Box className='rating-stars'>{renderStars(5)}</Box>
          <Typography className='rating-score'>{averageRating}</Typography>
          <Typography className='rating-count'>{reviewsCount}</Typography>
        </Stack>
      </Stack>

      <Box className='review-carousel'>
        <Box className='review-track'>
          {/* Duplicated once so the marquee loops seamlessly. */}
          {[...reviews, ...reviews].map(({ rating, tag, quote, initials, name, role }, index) => (
            <Box className='review-card' key={`${name}-${index}`}>
              <Box className='review-tag'>{tag}</Box>
              <Box className='review-stars'>{renderStars(rating)}</Box>
              <Typography className='review-quote'>« {quote} »</Typography>
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
      </Box>
    </Stack>
  );
};
