import { useStep } from '@/hooks';
import { useGeojsonQueryResult, useQueryImageFromUrl } from '@/queries';
import { getCached } from '@/utilities';
import { AnnotatorCanvas } from '@bpartners/annotator-component';
import { Button, Grid2, Paper, Typography } from '@mui/material';
import { DetectionResultStepStyle as style } from './styles';

export const DetectionResultStep = () => {
  const { imageSrc } = useStep(({ params }) => params);
  const { data: base64 } = useQueryImageFromUrl(imageSrc);

  const { data, refetch } = useGeojsonQueryResult();
  return (
    <Grid2 sx={style} container spacing={2}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        {imageSrc && <AnnotatorCanvas width='100%' height='500px' image={base64 || ''} setPolygons={() => {}} polygonList={data?.polygons || []} zoom={20} />}
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Typography className='title' mb={2}>
          Résultats de l'analyse :
        </Typography>
        <Paper>
          <Typography className='label'>Surface total : </Typography>
          <Typography className='result'>{getCached.area().toFixed(2)}m²</Typography>
        </Paper>
        {data?.stats.map(({ label, percentage }) => (
          <Paper key={label}>
            <Typography className='label'>{label.replace('_', ' ')}</Typography>
            <Typography className='result'>{percentage}%</Typography>
          </Paper>
        ))}
        <Button onClick={() => refetch()}>Refresh</Button>
      </Grid2>
    </Grid2>
  );
};
