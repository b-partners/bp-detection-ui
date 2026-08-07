import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const TOTAL_PAGES = 16;
const AUTOPLAY_INTERVAL = 1000;
const RESUME_DELAY = 3000;

const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => `/assets/images/landing/report-${String(i + 1).padStart(2, '0')}.jpg`);

export const ReportCarouselSection = () => {
  const [current, setCurrent] = useState(1);
  // Paused while the pointer is over the viewer (the user is reading a page).
  const [paused, setPaused] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setCurrent(page => (page < TOTAL_PAGES ? page + 1 : 1)), AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => () => clearTimeout(resumeTimeout.current), []);

  // A manual navigation pauses auto-play briefly so the user can read.
  const nudge = (next: number) => {
    setCurrent(next);
    setPaused(true);
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setPaused(false), RESUME_DELAY);
  };

  const handleMouseEnter = () => {
    setPaused(true);
    setCurrent(1);
  };
  const handleMouseLeave = () => setPaused(false);

  return (
    <Box className='landing-carousel'>
      <Box className='section-head'>
        <Typography className='section-head-title' component='h2'>
          Feuilletez le rapport <span className='accent'>complet</span>
        </Typography>
        <Typography className='section-head-sub'>16 pages détaillées : identité du bâtiment, pans, façades, mesures, préconisations d'entretien.</Typography>
      </Box>

      <Box className='pdf-viewer' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Box className='pdf-stage'>
          <img src={pages[current - 1]} alt={`Rapport BIRDIA — page ${current} sur ${TOTAL_PAGES}`} />
        </Box>

        <Box className='pdf-controls'>
          <Button className='pdf-btn' disabled={current === 1} onClick={() => nudge(current - 1)} startIcon={<ChevronLeftIcon />}>
            Précédent
          </Button>
          <Typography className='pdf-counter'>
            Page <strong>{current}</strong> / <strong>{TOTAL_PAGES}</strong>
          </Typography>
          <Button className='pdf-btn' disabled={current === TOTAL_PAGES} onClick={() => nudge(current + 1)} endIcon={<ChevronRightIcon />}>
            Suivant
          </Button>
        </Box>

        <Box className='pdf-dots'>
          {pages.map((_, index) => (
            <button
              key={index}
              type='button'
              aria-label={`Aller à la page ${index + 1}`}
              className={index + 1 === current ? 'active' : ''}
              onClick={() => nudge(index + 1)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
