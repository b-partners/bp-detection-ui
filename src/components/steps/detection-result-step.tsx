import { useAnnotationFrom } from '@/forms';
import { useStep } from '@/hooks';
import { detectionResultColors } from '@/mappers';
import { useGeojsonQueryResult, usePostDetectionQueries, useQueryImageFromUrl } from '@/queries';
import { cache, getCached } from '@/utilities';
import { Box, Button, Grid2, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { FC, useRef, useState } from 'react';
import { AnnotatorCanvasCustom, SlopeSelect } from '..';
import { DetectionResultStepStyle as style } from './styles';

interface ResultItemProps {
  label: string;
  percentage: number | string;
  source: string;
}

const ResultItem: FC<ResultItemProps> = ({ label, percentage, source }) => (
  <Paper key={source}>
    <Stack direction='row' gap={1}>
      <Box className='color-legend' sx={{ bgcolor: detectionResultColors[source as keyof typeof detectionResultColors] }}></Box>
      <Typography className='label'>{label}</Typography>
    </Stack>
    <Typography className='result'>{percentage || 0}%</Typography>
  </Paper>
);

export const ANNOTATION_COVERING = [
  { value: 'tuiles-canal', label: 'Tuiles canal' },
  { value: 'tuiles-plates', label: 'Tuiles plates' },
  { value: 'ardoise', label: 'Ardoise' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'shingle', label: 'Shingle' },
  { value: 'beton', label: 'Béton' },
  { value: 'bac-acier', label: 'Bac acier' },
  { value: 'bardeaux-bitumineux', label: 'Bardeaux bitumineux' },
  { value: 'fibro-ciment', label: 'Fibro-ciment' },
  { value: 'membrane-elastomere', label: 'Membrane élastomère' },
  { value: 'autres', label: 'Autres' },
];

export const DetectionResultStep = () => {
  const { imageSrc } = useStep(({ params }) => params);
  const { data: base64 } = useQueryImageFromUrl(imageSrc);
  const stepResultRef = useRef<HTMLDivElement>(null);
  const { data } = useGeojsonQueryResult();
  const { sendInfoToRoofer, isPending: sendInfoToRooferPending } = usePostDetectionQueries();
  const { register, watch } = useAnnotationFrom();
  const [isEmailSent, setIsEmailSent] = useState(getCached.isEmailSent());

  const handleSendPdf = () => {
    if (!isEmailSent) {
      sendInfoToRoofer(stepResultRef);
      cache.isEmailSent();
      setIsEmailSent(!isEmailSent);
    }
  };

  const canSendPdf = isEmailSent || !(watch().cover1 && watch().cover2 && watch().slope);

  return (
    <Grid2 ref={stepResultRef} id='result-step-container' sx={style} container spacing={2}>
      <Paper elevation={0} className='info-section' sx={{ width: '100%' }}>
        <Stack>
          <Typography>Veuillez remplir les champs Revêtement 1, Revêtement 2 et Pente pour nous permettre de mieux comprendre vos besoins.</Typography>
        </Stack>
      </Paper>
      <Grid2 size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
        {imageSrc && <AnnotatorCanvasCustom height='513px' setPolygons={() => {}} pointRadius={0} polygonList={data?.polygons || []} image={base64 || ''} />}
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Typography className='title' mb={2}>
          Résultats de l'analyse :
        </Typography>
        <Paper>
          <Typography className='label'>Surface totale : </Typography>
          <Typography className='result'>{getCached.area().toFixed(2)}m²</Typography>
        </Paper>
        <Paper>
          <TextField disabled={isEmailSent} {...register('cover1')} fullWidth label='Revêtement 1' select>
            {ANNOTATION_COVERING.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Paper>
        <Paper>
          <TextField disabled={isEmailSent} {...register('cover2')} fullWidth label='Revêtement 2' select>
            {ANNOTATION_COVERING.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Paper>
        <Paper>
          <SlopeSelect disabled={isEmailSent} {...register('slope')} />
        </Paper>
        <ResultItem label="Taux d'usure" source='USURE' percentage={data?.stats?.['USURE']} />
        <ResultItem label='Taux de moisissure' source='MOISISSURE' percentage={data?.stats?.['MOISISSURE']} />
        <ResultItem label="Taux d'humidité" source='HUMIDITE' percentage={data?.stats?.['HUMIDITE']} />
        <Paper>
          <Stack direction='row' gap={1}>
            <Box className='color-legend' sx={{ bgcolor: detectionResultColors['OBSTACLE' as keyof typeof detectionResultColors] }}></Box>
            <Typography className='label'>Obstacle / Velux</Typography>
          </Stack>
          <Typography className='result'>{data?.stats?.['OBSTACLE'] || data?.stats?.['VELUX'] ? 'OUI' : 'NON'}</Typography>
        </Paper>
        <Button data-cy='send-roofer-mail-button' loading={sendInfoToRooferPending} disabled={canSendPdf} onClick={handleSendPdf}>
          Envoyer
        </Button>
      </Grid2>
    </Grid2>
  );
};
