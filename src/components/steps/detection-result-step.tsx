import { useAnnotationFrom } from '@/forms';
import { useStep, useToggle } from '@/hooks';
import { ANNOTATION_COVERING, degradationLevels, detectionResultColors } from '@/mappers';
import { AnnotationCoveringFromAnalyse, useGeojsonQueryResult, usePostDetectionQueries, useQueryHeightAndSlope, useQueryImageFromUrl } from '@/queries';
import { cache, getCached } from '@/utilities';
import { Box, Button, Grid2, Paper, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { AnnotatorCanvasCustom, LlmResult, LlmSwitchButton } from '..';
import { DetectionResultStepStyle as style } from './styles';

interface ResultItemProps {
  label: string;
  value: number | string;
  source: string;
  unity?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const ResultItem: FC<ResultItemProps> = ({ label, value, source, unity = '%', isLoading, loadingMessage }) => {
  const bgcolor = detectionResultColors[source as keyof typeof detectionResultColors];
  return (
    <Paper key={source}>
      {!isLoading && (
        <>
          <Stack direction='row' gap={1}>
            {bgcolor && <Box className='color-legend' sx={{ bgcolor }}></Box>}
            <Typography className='label'>{label}</Typography>
          </Stack>
          <Typography className='result'>{`${value || 0}${unity}`}</Typography>
        </>
      )}
      {isLoading && <Typography>{loadingMessage}</Typography>}
    </Paper>
  );
};

export const fromAnalyseResultToDomain = (covering: AnnotationCoveringFromAnalyse) => {
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
  const { imageSrc, useGeoJson } = useStep(({ params }) => params);
  const stepResultRef = useRef<HTMLDivElement>(null);
  const { sendInfoToRoofer, isPending: sendInfoToRooferPending } = usePostDetectionQueries();
  const form = useAnnotationFrom();
  const { watch, setValue: setFormValue } = form;
  const [isEmailSent, setIsEmailSent] = useState(getCached.isEmailSent());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleValue: tootleLLMResultView, value: showLLMResult } = useToggle(false);

  const { data: heightAndSlope, isPending: isHeightAndSlopePending } = useQueryHeightAndSlope();

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
    if (heightAndSlope?.slope) setFormValue('slope', heightAndSlope?.slope);
  }, [heightAndSlope]);

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
          <Box position='relative'>
            {(!showLLMResult || sendInfoToRooferPending) && (
              <AnnotatorCanvasCustom
                height='513px'
                setPolygons={() => {}}
                pointRadius={0}
                polygonList={data?.polygons || []}
                isLoading={isImageLoading || isGeoJsonResultLoading}
                image={data?.createdImage || ''}
              />
            )}
            {data?.properties && (showLLMResult || sendInfoToRooferPending) && (
              <LlmResult width='90%' height='513px' roofAnalyseProperties={data?.properties} />
            )}
          </Box>
          <Box ref={canvasRef} component='canvas' display='none'></Box>
          <Box className='degratation-rate-title'>
            <LlmSwitchButton showLlm={showLLMResult} onClick={tootleLLMResultView} />
            <Typography>
              Note de dégradation globale : <strong>{data?.properties?.global_rate_value}%</strong>
            </Typography>
          </Box>
          <Stack className='degratation-levels' direction='row' justifyContent='center' m={1} gap={1}>
            {degradationLevels.map(({ color, label }) => (
              <Box
                key={label}
                className={`degratation-levels-box ${data?.properties?.global_rate_type === label ? 'degratation-levels-box-selected' : ''}`}
                sx={{ bgcolor: color, border: `5px solid ${data?.properties?.global_rate_type === label ? 'black' : 'transparent'}` }}
              >
                {label}
              </Box>
            ))}
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack className='analyse-result-info'>
            <Typography className='title' mb={2}>
              Résultats de l'analyse :
            </Typography>
            <ResultItem label='Surface totale' source='surface' unity='m²' value={getCached.area().toFixed(2)} />
            <ResultItem label='Revêtement 1' source='revetement1' value={watch()?.cover1} unity='' />
            <ResultItem label='Revêtement 2' source='revetement2' value={watch()?.cover2} unity='' />
            <ResultItem
              label='Hauteur du bâtiment'
              loadingMessage='Chargement de la hauteur du bâtiment en cours...'
              source='HAUTEUR'
              unity='m'
              isLoading={isHeightAndSlopePending}
              value={heightAndSlope?.height}
            />
            <ResultItem
              label='Pente'
              isLoading={isHeightAndSlopePending}
              loadingMessage='Chargement de la pente en cours... '
              source='pente'
              value={heightAndSlope?.slope}
            />
            <ResultItem label="Taux d'usure" source='USURE' value={data?.properties?.['usure_rate'] || 0} />
            <ResultItem label='Taux de moisissure' source='MOISISSURE' value={data?.properties?.['moisissure_rate'] || 0} />
            <ResultItem label="Taux d'humidité" source='HUMIDITE' value={data?.properties?.['humidite_rate'] || 0} />
            <ResultItem label='Mutation' source='mutation' value='neant' unity='' />
            <ResultItem label='Obstacle / Velux' source='OBSTACLE' value={data?.properties?.obstacle ? 'OUI' : 'NON'} unity='' />
            <ResultItem label='Fissure / Cassure' source='fissure/cassure' value='neant' unity='' />
            <ResultItem label='Risque de feu' source='risqueDeFeux' value='neant' unity='' />
            <Button data-cy='send-roofer-mail-button' fullWidth loading={sendInfoToRooferPending} disabled={!canSendPdf} onClick={handleSendPdf}>
              Envoyer ces informations à mon couvreur
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
};
