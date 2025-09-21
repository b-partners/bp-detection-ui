import { useAnnotationFrom } from '@/forms';
import { useStep, useToggle } from '@/hooks';
import { ANNOTATION_COVERING, degradationLevels } from '@/mappers';
import {
  AnnotationCoveringFromAnalyse,
  useGeojsonQueryResult,
  useLlmResultQuery,
  usePostDetectionQueries,
  useQueryHeightAndSlope,
  useQueryImageFromUrl,
} from '@/queries';
import { cache, getCached } from '@/utilities';
import { Box, Button, Grid2, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { AnnotatorCanvasCustom, LlmResult, LlmSwitchButton } from '..';
import { DetectionResultItem } from './detection-result-item';
import { DetectionResultStepStyle as style } from './styles';

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

  const { data: llmHtmlData, isPending: isLlmHtmlData } = useLlmResultQuery(data?.properties as any);
  const canSendPdf =
    !isEmailSent && watch().cover1 && watch().cover2 && watch().slope !== undefined && !isImageLoading && llmHtmlData && !isHeightAndSlopePending;

  return (
    <FormProvider {...form}>
      <Grid2 ref={stepResultRef} id='result-step-container' sx={style} container spacing={2}>
        <Grid2 size={{ xs: 12, md: 8 }} sx={{ mt: sendInfoToRooferPending ? 10 : 1 }}>
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
            {data?.properties && llmHtmlData && showLLMResult && !sendInfoToRooferPending && (
              <LlmResult width='90%' height='513px' htmlData={llmHtmlData} isLoading={isLlmHtmlData} />
            )}
          </Box>
          <Box ref={canvasRef} component='canvas' display='none'></Box>
          <Box className='degratation-rate-title'>
            <LlmSwitchButton showLlm={showLLMResult} onClick={tootleLLMResultView} />
            <Typography>Note de dégradation globale : {data?.properties?.global_rate_value}%</Typography>
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
          {llmHtmlData && sendInfoToRooferPending && <LlmResult width='90%' height='100%' htmlData={llmHtmlData} isLoading={isLlmHtmlData} />}
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack className='analyse-result-info'>
            <Typography className='title' mb={2}>
              Résultats de l'analyse :
            </Typography>
            <DetectionResultItem label='Surface totale' source='surface' unity='m²' value={getCached.area().toFixed(2)} />
            <DetectionResultItem label='Revêtement 1' source='revetement1' value={watch()?.cover1} unity='' />
            <DetectionResultItem label='Revêtement 2' source='revetement2' value={watch()?.cover2} unity='' />
            <DetectionResultItem
              label='Hauteur du bâtiment'
              loadingMessage='Calcule de la hauteur du bâtiment en cours...'
              source='HAUTEUR'
              unity='m'
              isLoading={isHeightAndSlopePending}
              value={heightAndSlope?.height}
            />
            <DetectionResultItem
              label='Pente'
              isLoading={isHeightAndSlopePending}
              loadingMessage='Calcule de la pente en cours... '
              source='pente'
              value={heightAndSlope?.slope}
            />
            <DetectionResultItem label="Taux d'usure" source='USURE' value={data?.properties?.['usure_rate'] || 0} />
            <DetectionResultItem label='Taux de moisissure' source='MOISISSURE' value={data?.properties?.['moisissure_rate'] || 0} />
            <DetectionResultItem label="Taux d'humidité" source='HUMIDITE' value={data?.properties?.['humidite_rate'] || 0} />
            <DetectionResultItem label='Mutation' source='mutation' value='neant' unity='' />
            <DetectionResultItem label='Obstacle / Velux' source='OBSTACLE' value={data?.properties?.obstacle ? 'OUI' : 'NON'} unity='' />
            <DetectionResultItem label='Fissure / Cassure' source='fissure/cassure' value='neant' unity='' />
            <DetectionResultItem label='Risque de feu' source='risqueDeFeux' value='neant' unity='' />
            <Button data-cy='send-roofer-mail-button' fullWidth loading={sendInfoToRooferPending} disabled={!canSendPdf} onClick={handleSendPdf}>
              Envoyer ces informations à mon couvreur
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
};
