import { useStep } from '@/hooks';
import { detectionResultColors } from '@/mappers';
import { useGeojsonQueryResult, usePostDetectionQueries, useQueryImageFromUrl } from '@/queries';
import { getCached } from '@/utilities';
import { Box, Grid2, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { FC, useEffect, useRef } from 'react';
import { AnnotatorCanvasCustom } from '..';
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

const cover_types = ['ARDOISE', 'ASPHALT'];

export const DetectionResultStep = () => {
  const { imageSrc } = useStep(({ params }) => params);
  const { data: base64 } = useQueryImageFromUrl(imageSrc);
  const stepResultRef = useRef<HTMLDivElement>(null);
  const { data } = useGeojsonQueryResult();
  const sendRooferInfo = usePostDetectionQueries();

  useEffect(() => {
    if (data?.stats && !getCached.isEmailSent()) {
      sendRooferInfo(stepResultRef);
    }
  }, [data, stepResultRef]);

  return (
    <Grid2 ref={stepResultRef} id='result-step-container' sx={style} container spacing={2}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        {imageSrc && <AnnotatorCanvasCustom setPolygons={() => {}} polygonList={data?.polygons || []} image={base64 || ''} />}
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Typography className='title' mb={2}>
          Résultats de l'analyse :
        </Typography>
        <Paper>
          <Typography className='label'>Surface total : </Typography>
          <Typography className='result'>{getCached.area().toFixed(2)}m²</Typography>
        </Paper>
        <Paper>
          <TextField fullWidth label='Revêtement' select>
            {cover_types.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
      </Grid2>
    </Grid2>
  );
};
