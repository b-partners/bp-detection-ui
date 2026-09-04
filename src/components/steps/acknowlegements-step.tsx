import { useStep } from '@/hooks';
import { useAccountInfoStore } from '@/queries';
import { PALETTE_COLORS } from '@/utilities/theme';
import { FileDownloadOutlined } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';

const endPagePaperStyle = {
  p: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: {
    xs: '97vw',
    md: '94vw',
    lg: '92vw',
  },
};

const titleStyle = { mb: 3, color: '#455a64', textAlign: 'center', width: { xs: '50%', md: '60%' } };

const backButtonStyle = {
  borderRadius: 2,
  textTransform: 'none',
  backgroundColor: PALETTE_COLORS.pine,
  '&:hover': { backgroundColor: PALETTE_COLORS.forest },
};

const cta = {
  ...backButtonStyle,
  backgroundColor: PALETTE_COLORS.neon_orange,
  '&:hover': { backgroundColor: PALETTE_COLORS.neon_orange + '80' },
};

// Parked while the underlying notify/export pipeline is debugged — flip back on once fixed.
const SHOW_PDF_DOWNLOAD = false;

export const AcknowledgementsStep = () => {
  const { website, feedbackLink } = useAccountInfoStore();
  const pdfFile = useStep(({ params }) => params.pdfFile);
  const [isDownloading, setIsDownloading] = useState(false);

  const pdfUrl = useMemo(() => (pdfFile ? URL.createObjectURL(pdfFile) : undefined), [pdfFile]);

  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    },
    [pdfUrl]
  );

  const handleDownloadClick = () => {
    setIsDownloading(true);
    window.setTimeout(() => setIsDownloading(false), 1200);
  };

  return (
    <Stack sx={endPagePaperStyle}>
      <Typography variant='h5' sx={titleStyle}>
        Merci d’avoir analysé votre toiture, notre expert toiture va vous contacter dans les plus bref délais.
      </Typography>
      {SHOW_PDF_DOWNLOAD && pdfUrl && (
        <Button
          component='a'
          href={pdfUrl}
          download={pdfFile?.name || 'rapport-birdia.pdf'}
          onClick={handleDownloadClick}
          variant='outlined'
          size='large'
          loading={isDownloading}
          startIcon={<FileDownloadOutlined />}
          sx={{ mb: 2, borderRadius: 2, textTransform: 'none', borderColor: PALETTE_COLORS.pine, color: PALETTE_COLORS.pine }}
        >
          Télécharger le PDF
        </Button>
      )}
      <Stack direction='row' spacing={2} mt={2}>
        <Button variant='contained' size='large' onClick={() => window.location.replace(website)} sx={cta}>
          Laisser un commentaire
        </Button>
        <Button variant='contained' size='large' onClick={() => window.location.replace(feedbackLink)} sx={backButtonStyle}>
          Retourner à l'accueil
        </Button>
      </Stack>
    </Stack>
  );
};
