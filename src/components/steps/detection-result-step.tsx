import { useStep } from '@/hooks';
import { detectionResultColors } from '@/mappers/geojson-mapper';
import { useGeojsonQueryResult, useQueryImageFromUrl } from '@/queries';
import { getCached } from '@/utilities';
import { AnnotatorCanvas } from '@bpartners/annotator-component';
import { Box, Button, Grid2, Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';
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

export const DetectionResultStep = () => {
  const { imageSrc } = useStep(({ params }) => params);
  const { data: base64 } = useQueryImageFromUrl(imageSrc);

  const { data, refetch } = useGeojsonQueryResult();

  return (
    <Grid2 sx={style} container spacing={2}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        {imageSrc && (
          <AnnotatorCanvas
            pointRadius={0}
            width='100%'
            height='500px'
            image={base64 || ''}
            setPolygons={() => {}}
            polygonList={data?.polygons || []}
            zoom={20}
          />
        )}
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Typography className='title' mb={2}>
          Résultats de l'analyse :
        </Typography>
        <Paper>
          <Typography className='label'>Surface total : </Typography>
          <Typography className='result'>{getCached.area().toFixed(2)}m²</Typography>
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
        <Button onClick={() => refetch()}>Refresh</Button>
      </Grid2>
    </Grid2>
  );
};
