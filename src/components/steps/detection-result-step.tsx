import { useAnnotationFrom } from '@/forms';
import { useStep } from '@/hooks';
import { ANNOTATION_COVERING, degradationLevels, detectionResultColors } from '@/mappers';
import { AnnotationCoveringFromAnalyse, useGeojsonQueryResult, usePostDetectionQueries, useQueryImageFromUrl } from '@/queries';
import { cache, getCached } from '@/utilities';
import { Box, Button, Chip, Grid2, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
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

const fromAnalyseResultToDomain = (covering: AnnotationCoveringFromAnalyse) => {
  switch (covering) {
    case 'BATI_ARDOISE':
      return ANNOTATION_COVERING[2];
    case 'BATI_BETON':
      return ANNOTATION_COVERING[5];
    case 'BATI_TUILES':
      return ANNOTATION_COVERING[0];
    default:
      return ANNOTATION_COVERING[10];
  }
};

export const DetectionResultStep = () => {
  const { imageSrc, useGeoJson, roofDelimiter } = useStep(({ params }) => params);
  const stepResultRef = useRef<HTMLDivElement>(null);
  const { sendInfoToRoofer, isPending: sendInfoToRooferPending } = usePostDetectionQueries();
  const form = useAnnotationFrom();
  const { register, watch, setValue: setFormValue } = form;
  const [isEmailSent, setIsEmailSent] = useState(getCached.isEmailSent());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [annotatorCanvasState, setAnnotatorCanvasState] = useState<{ image: string; polygons: any[] }>({ image: '', polygons: [] });

  const handleSendPdf = () => {
    if (!isEmailSent) {
      sendInfoToRoofer(stepResultRef);
      cache.isEmailSent();
      setIsEmailSent(!isEmailSent);
    }
  };

  const { data: image, isLoading: isImageLoading } = useQueryImageFromUrl(annotatorCanvasState.image);
  const { data, isLoading: isGeoJsonResultLoading } = useGeojsonQueryResult(image);

  useEffect(() => {
    if (data?.properties) {
      setFormValue('cover1', fromAnalyseResultToDomain(data.properties.revetement_1)?.value);
      setFormValue('cover2', fromAnalyseResultToDomain(data.properties.revetement_2)?.value);
    }
  }, [data]);

  useEffect(() => {
    setAnnotatorCanvasState({ image: imageSrc || '', polygons: data?.polygons || [] });
  }, [useGeoJson, imageSrc]);

  const canSendPdf = !isEmailSent && watch().cover1 && watch().cover2 && watch().slope !== undefined && !isImageLoading;

  return (
    <FormProvider {...form}>
      <Grid2 ref={stepResultRef} id='result-step-container' sx={style} container spacing={2}>
        <Paper elevation={0} className='info-section' sx={{ width: '100%' }}>
          <Stack>
            <Typography>Veuillez remplir les champs Revêtement 1, Revêtement 2 et Pente pour nous permettre de mieux comprendre vos besoins.</Typography>
          </Stack>
        </Paper>
        <Grid2 size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
          <AnnotatorCanvasCustom
            height='513px'
            setPolygons={() => {}}
            pointRadius={0}
            polygonList={data?.polygons || []}
            isLoading={isImageLoading || isGeoJsonResultLoading}
            image={data?.createdImage || ''}
          />
          <Box ref={canvasRef} component='canvas' display='none'></Box>
          <Paper className='degratation-rate-title'>
            <Typography>
              Note de dégradation globale : <strong>{data?.properties?.global_rate_value}%</strong>
            </Typography>
          </Paper>
          <Stack direction='row' justifyContent='center' m={1} gap={1}>
            {degradationLevels.map(({ color, label }) => (
              <Chip
                key={label}
                label={label}
                sx={{ px: 1, bgcolor: color, border: `5px solid ${data?.properties?.global_rate_type === label ? 'black' : 'transparent'}` }}
              />
            ))}
          </Stack>
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
            <TextField disabled={isEmailSent} {...register('cover1')} value={watch()?.cover1 || ''} fullWidth label='Revêtement 1' select>
              {ANNOTATION_COVERING.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
          <Paper>
            <TextField disabled={isEmailSent} {...register('cover2')} value={watch()?.cover2 || ''} fullWidth label='Revêtement 2' select>
              {ANNOTATION_COVERING.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
          <Paper>
            <SlopeSelect disabled={isEmailSent} />
          </Paper>
          <Paper>
            <Stack direction='row' gap={1}>
              <Box className='color-legend' sx={{ bgcolor: detectionResultColors['HAUTEUR' as keyof typeof detectionResultColors] }}></Box>
              <Typography className='label'>Hauteur</Typography>
            </Stack>
            <Typography className='result'>{roofDelimiter?.roofHeightInMeter || 0}m</Typography>
          </Paper>
          <ResultItem label="Taux d'usure" source='USURE' percentage={data?.properties?.['usure_rate'] || 0} />
          <ResultItem label='Taux de moisissure' source='MOISISSURE' percentage={data?.properties?.['moisissure_rate'] || 0} />
          <ResultItem label="Taux d'humidité" source='HUMIDITE' percentage={data?.properties?.['humidite_rate'] || 0} />
          <Paper>
            <Stack direction='row' gap={1}>
              <Box className='color-legend' sx={{ bgcolor: detectionResultColors['OBSTACLE' as keyof typeof detectionResultColors] }}></Box>
              <Typography className='label'>Obstacle / Velux</Typography>
            </Stack>
            <Typography className='result'>{data?.properties?.obstacle ? 'OUI' : 'NON'}</Typography>
          </Paper>
          <Button data-cy='send-roofer-mail-button' loading={sendInfoToRooferPending} disabled={!canSendPdf} onClick={handleSendPdf}>
            Envoyer
          </Button>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
};
