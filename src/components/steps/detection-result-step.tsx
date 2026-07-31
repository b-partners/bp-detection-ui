import { useAnnotationFrom } from '@/forms';
import { useStep, useToggle } from '@/hooks';
import { coveringTypeMap, exportPdfMapper, saveAnnotationsMapper } from '@/mappers';
import {
  AnnotationCoveringFromAnalyse,
  useGeojsonQueryResult,
  useLlmResultQuery,
  useNotifyPdfQuery,
  useQueryHeightAndSlope,
  useQueryImageFromUrl,
  useSaveAnnotationQuery,
} from '@/queries';
import { getCached } from '@/utilities';
import type { SvgIconComponent } from '@mui/icons-material';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Alert, Box, Button, Divider, Grid2, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { AnnotationSlopeHeightAlert, AnnotatorCanvasCustom, DomainPolygonResultType, LlmResult, LlmSwitchButton } from '..';
import { DetectionResultItem } from './detection-result-item';
import { DetectionResultStepStyle as style } from './styles';

export const fromAnalyseResultToDomain = (covering: AnnotationCoveringFromAnalyse) => coveringTypeMap[covering] || covering || 'Autres';

type RoofStateGrade = { level: string; variant: string; title: string; description: string; Icon: SvgIconComponent };

const ROOF_STATE_GRADES: RoofStateGrade[] = [
  { level: 'A', variant: 'good', title: 'Toiture en bon état', description: 'Aucune intervention visible nécessaire', Icon: GppGoodOutlinedIcon },
  { level: 'B', variant: 'preventive', title: 'Entretien préventif', description: 'Pour garder la toiture en bonne santé', Icon: BlockOutlinedIcon },
  { level: 'C', variant: 'maintenance', title: 'Intervention nécessaire', description: 'Pour ralentir le vieillissement', Icon: BuildOutlinedIcon },
  { level: 'D', variant: 'repair', title: 'Réparation prioritaire', description: 'Dégradation visible, risque à traiter', Icon: TrendingUpOutlinedIcon },
  { level: 'E', variant: 'critical', title: 'Risque critique', description: 'Intervention urgente à prévoir', Icon: WarningAmberRoundedIcon },
];

const CONVERTER_BASE_URL = process.env.REACT_APP_ANNOTATOR_GEO_CONVERTER_API_URL || '';
export const DetectionResultStep = () => {
  const { imageSrc, useGeoJson, areaPictureDetails } = useStep(({ params }) => params);
  const setStep = useStep(p => p.setStep);
  const stepResultRef = useRef<HTMLDivElement>(null);
  const form = useAnnotationFrom();
  const { watch, setValue: setFormValue } = form;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleValue: tootleLLMResultView, value: showLLMResult } = useToggle(false);
  const [endLoading, setEndLoading] = useState(false);

  const acknowledgementsRedirect = () => {
    setStep({ actualStep: 3, params: {} });
    setEndLoading(true);
  };

  const { data: heightAndSlope, isPending: isHeightAndSlopePending } = useQueryHeightAndSlope();

  const [annotatorCanvasState, setAnnotatorCanvasState] = useState<{ image: string; polygons: any[] }>({ image: '', polygons: [] });

  const { data: image, isLoading: isImageLoading } = useQueryImageFromUrl(annotatorCanvasState.image);
  const { data, isLoading: isGeoJsonResultLoading } = useGeojsonQueryResult(image);

  useEffect(() => {
    if (data?.properties) {
      setFormValue('cover1', fromAnalyseResultToDomain(data.properties.revetement_1));
      setFormValue('cover2', fromAnalyseResultToDomain(data.properties.revetement_2));
    }
  }, [data]);

  useEffect(() => {
    if (heightAndSlope?.slope) setFormValue('slope', heightAndSlope?.slope);
  }, [heightAndSlope]);

  useEffect(() => {
    setAnnotatorCanvasState({ image: imageSrc || '', polygons: data?.polygons || [] });
  }, [useGeoJson, imageSrc]);

  const { data: llmHtmlData, isPending: isLlmHtmlDataPending, isLoading: isLlmHtmlDataLoading } = useLlmResultQuery(data?.properties as any);

  const { notifyRoofer, isEmailSent, isPending: isEmailSentPending } = useNotifyPdfQuery();

  const canSendPdf =
    !isEmailSent && watch().cover1 && watch().cover2 && watch().slope !== undefined && !isImageLoading && llmHtmlData && !isHeightAndSlopePending;

  const { mutate: saveAreaPictureAnnotations } = useSaveAnnotationQuery();

  const selectedLevel = data?.properties?.global_rate_type;
  const selectedGrade = ROOF_STATE_GRADES.find(({ level }) => level === selectedLevel);
  const SelectedIcon = selectedGrade?.Icon;

  useEffect(() => {
    if (!getCached.notificationAlreadySent() && canSendPdf && areaPictureDetails && llmHtmlData && data?.polygons && data?.properties) {
      const annotationToSave = saveAnnotationsMapper(
        areaPictureDetails,
        data.polygons as DomainPolygonResultType[],
        {
          ...data.properties,
          obstacle: data.properties.obstacle ? 'OUI' : 'NON',
          roof_height_in_meters: heightAndSlope?.height || 0,
          roof_slope_in_degrees: heightAndSlope?.slope || 0,
        },
        llmHtmlData
      );
      if (!getCached.isAnnotationAlreadySaved()) saveAreaPictureAnnotations(annotationToSave);

      const exportAreaPictureAnnotation = exportPdfMapper({
        areaPictureDetails,
        height: heightAndSlope?.height || 0,
        slope: heightAndSlope?.slope || 0,
        llm: llmHtmlData,
        polygons: data.polygons as DomainPolygonResultType[],
        properties: { ...data.properties, obstacle: data.properties.obstacle ? 'OUI' : 'NON' },
        measurements: data.measurements,
      });

      notifyRoofer(exportAreaPictureAnnotation);
    }
  }, [canSendPdf]);

  return (
    <FormProvider {...form}>
      <Grid2 ref={stepResultRef} id='result-step-container' sx={style} container spacing={2}>
        <Grid2 size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
          <Box position='relative'>
            {!showLLMResult && (
              <AnnotatorCanvasCustom
                height='513px'
                setPolygons={() => {}}
                pointRadius={0}
                polygonList={data?.polygons || []}
                isLoading={isImageLoading || isGeoJsonResultLoading}
                image={data?.createdImage || ''}
                polygonLineSizeProps={
                  areaPictureDetails && {
                    imageName: `${areaPictureDetails.filename}.jpg`,
                    showLineSize: true,
                    converterApiUrl: `${CONVERTER_BASE_URL}`,
                  }
                }
              />
            )}
            {data?.properties && showLLMResult && (
              <LlmResult width='90%' height='513px' htmlData={llmHtmlData || ''} isLoading={isLlmHtmlDataPending || isLlmHtmlDataLoading} />
            )}
          </Box>
          <Box ref={canvasRef} component='canvas' display='none'></Box>
          <Box className='degradation-switch'>
            <LlmSwitchButton showLlm={showLLMResult} onClick={tootleLLMResultView} />
          </Box>
          <Box className={`roof-state roof-state-${selectedGrade?.variant || 'good'}`}>
            <Typography className='roof-state-title' component='h3'>
              État apparent de la toiture
            </Typography>
            <Divider className='roof-state-divider' />
            <Box className='roof-state-cards'>
              {ROOF_STATE_GRADES.map(({ level, variant, title, description, Icon }) => (
                <Box className={`roof-state-card roof-state-card-${variant} ${level === selectedLevel ? 'roof-state-card-selected' : ''}`} key={level}>
                  <Box className='roof-state-icon'>
                    <Icon fontSize='inherit' />
                  </Box>
                  <Typography className='roof-state-card-title'>{title}</Typography>
                  <Typography className='roof-state-card-desc'>{description}</Typography>
                </Box>
              ))}
            </Box>
            <Box className='roof-state-meter'>
              {ROOF_STATE_GRADES.map(({ level, variant }) => (
                <Box className='roof-state-meter-col' key={level}>
                  <Box className={`roof-state-meter-bar roof-state-meter-bar-${variant}`} />
                  {level === selectedLevel ? <Box className='roof-state-meter-pointer' /> : <Box className='roof-state-meter-dot' />}
                </Box>
              ))}
            </Box>
            <Box className='roof-state-summary'>
              <Box className='roof-state-summary-level'>
                <Box className='roof-state-summary-icon'>{SelectedIcon && <SelectedIcon fontSize='inherit' />}</Box>
                <Box>
                  <Typography className='roof-state-summary-label'>Niveau détecté</Typography>
                  <Typography className='roof-state-summary-verdict'>{selectedGrade?.description || 'Analyse en cours…'}</Typography>
                </Box>
              </Box>
              <Divider orientation='vertical' flexItem className='roof-state-summary-divider' />
              <Box className='roof-state-summary-score'>
                <Typography className='roof-state-summary-label'>Score de dégradation visible</Typography>
                <Typography className='roof-state-summary-value'>{data?.properties?.global_rate_value ?? 0}%</Typography>
              </Box>
            </Box>
            <Typography className='roof-state-footnote'>Analyse issue d'images aériennes. Ne remplace pas une expertise terrain.</Typography>
          </Box>
          <Box className='disclaimer-container'>
            <Alert variant='filled' color='warning'>
              Disclaimer : rapport généré par IA statistique nécessitant confirmation par votre expert toiture.
            </Alert>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack className='analyse-result-info'>
            <Typography className='title' mb={2}>
              Résultats de l'analyse :
            </Typography>
            {heightAndSlope?.heightStatus && <AnnotationSlopeHeightAlert status={heightAndSlope.heightStatus} />}
            <DetectionResultItem label='Surface totale' source='surface' unity='m²' value={getCached.area().toFixed(2)} />
            <DetectionResultItem label='Revêtement 1' source='revetement1' value={watch()?.cover1} unity='' />
            <DetectionResultItem label='Revêtement 2' source='revetement2' value={watch()?.cover2} unity='' />
            {(!heightAndSlope?.heightStatus || heightAndSlope?.heightStatus === 'AVAILABLE') && (
              <DetectionResultItem
                label='Hauteur du bâtiment'
                loadingMessage='Calcule de la hauteur du bâtiment en cours...'
                source='HAUTEUR'
                unity='m'
                isLoading={isHeightAndSlopePending}
                value={heightAndSlope?.height}
              />
            )}
            {(!heightAndSlope?.slopeStatus || heightAndSlope?.slopeStatus === 'AVAILABLE') && (
              <DetectionResultItem
                label='Pente'
                isLoading={isHeightAndSlopePending}
                loadingMessage='Calcule de la pente en cours...'
                source='pente'
                value={heightAndSlope?.slope}
              />
            )}
            <DetectionResultItem label="Taux d'usure" source='USURE' value={data?.properties?.['usure_rate'] || 0} />
            <DetectionResultItem label='Taux de moisissure' source='MOISISSURE' value={data?.properties?.['moisissure_rate'] || 0} />
            <DetectionResultItem label="Taux d'humidité" source='HUMIDITE' value={data?.properties?.['humidite_rate'] || 0} />
            <DetectionResultItem label='Mutation' source='mutation' value='neant' unity='' />
            <DetectionResultItem label='Obstacle / Velux' source='OBSTACLE' value={data?.properties?.obstacle ? 'OUI' : 'NON'} unity='' />
            <DetectionResultItem label='Fissure / Cassure' source='fissure/cassure' value='neant' unity='' />
            <DetectionResultItem label='Risque de feu' source='risqueDeFeux' value='neant' unity='' />
            <Button
              data-cy='send-roofer-mail-button'
              fullWidth
              loading={isEmailSentPending || endLoading}
              disabled={!isEmailSent}
              onClick={acknowledgementsRedirect}
            >
              Terminer
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
};
