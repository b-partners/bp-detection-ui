import { useAnnotationFrom } from '@/forms';
import { useStep, useToggle } from '@/hooks';
import { coveringTypeMap, exportPdfMapper, saveAnnotationsMapper } from '@/mappers';
import {
  AnnotationCoveringFromAnalyse,
  useGeojsonQueryResult,
  useLlmResultQuery,
  useNotifyPdfQuery,
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
import { AnnotatorCanvasCustom, DomainPolygonResultType, LlmResult, LlmSwitchButton } from '..';
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
  const roofStateRef = useRef<HTMLDivElement>(null);
  const hasScrolledToRoofState = useRef(false);
  const form = useAnnotationFrom();
  const { watch, setValue: setFormValue } = form;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleValue: tootleLLMResultView, value: showLLMResult } = useToggle(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const acknowledgementsRedirect = () => {
    setStep({ actualStep: 3, params: {} });
  };

  const [annotatorCanvasState, setAnnotatorCanvasState] = useState<{ image: string; polygons: any[] }>({ image: '', polygons: [] });

  const { data: image, isLoading: isImageLoading } = useQueryImageFromUrl(annotatorCanvasState.image);
  const { data, isLoading: isGeoJsonResultLoading } = useGeojsonQueryResult(image);

  useEffect(() => {
    if (data?.properties) {
      setFormValue('cover1', fromAnalyseResultToDomain(data.properties.revetement_1));
    }
  }, [data]);

  // Bring the "État apparent de la toiture" section into view once, the first time
  // its content is ready — a one-off nudge, not a persistent scroll-snap that would
  // fight the user's own scrolling afterwards.
  useEffect(() => {
    if (data?.properties && !hasScrolledToRoofState.current) {
      hasScrolledToRoofState.current = true;
      roofStateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  useEffect(() => {
    setAnnotatorCanvasState({ image: imageSrc || '', polygons: data?.polygons || [] });
  }, [useGeoJson, imageSrc]);

  const { data: llmHtmlData, isPending: isLlmHtmlDataPending, isLoading: isLlmHtmlDataLoading } = useLlmResultQuery(data?.properties as any);

  const { notifyRoofer, isEmailSent, isPending: isEmailSentPending } = useNotifyPdfQuery();

  const canSendPdf = !isEmailSent && watch().cover1 && !isImageLoading && llmHtmlData;

  // "Terminer" stays clickable even while the report is still being generated/sent in
  // the background — clicking it early just shows a spinner and waits, instead of
  // silently doing nothing (which looked like a broken button).
  const handleTerminerClick = () => {
    if (isEmailSent) {
      acknowledgementsRedirect();
      return;
    }
    setIsFinishing(true);
  };

  useEffect(() => {
    if (!isFinishing) return;
    if (isEmailSent) {
      acknowledgementsRedirect();
      return;
    }
    // Safety net: never leave the user stuck on a spinner if the background
    // send fails or silently stalls.
    const timeout = setTimeout(acknowledgementsRedirect, 20000);
    return () => clearTimeout(timeout);
  }, [isFinishing, isEmailSent]);

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
        },
        llmHtmlData
      );
      if (!getCached.isAnnotationAlreadySaved()) saveAreaPictureAnnotations(annotationToSave);

      const exportAreaPictureAnnotation = exportPdfMapper({
        areaPictureDetails,
        llm: llmHtmlData,
        polygons: data.polygons as DomainPolygonResultType[],
        properties: { ...data.properties, obstacle: data.properties.obstacle ? 'OUI' : 'NON' },
        measurements: data.measurements,
      });

      notifyRoofer(exportAreaPictureAnnotation).then(pdfFile => setStep({ actualStep: 2, params: { pdfFile } }));
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
          <Box ref={roofStateRef} className={`roof-state roof-state-${selectedGrade?.variant || 'good'}`}>
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
            <DetectionResultItem label='Surface totale' source='surface' unity='m²' value={getCached.area().toFixed(2)} />
            <DetectionResultItem label='Revêtement' source='revetement1' value={watch()?.cover1} unity='' />
            <DetectionResultItem label="Taux d'usure" source='USURE' value={data?.properties?.['usure_rate'] || 0} />
            <DetectionResultItem label='Taux de moisissure' source='MOISISSURE' value={data?.properties?.['moisissure_rate'] || 0} />
            <DetectionResultItem label="Taux d'humidité" source='HUMIDITE' value={data?.properties?.['humidite_rate'] || 0} />
            <DetectionResultItem label='Obstacle / Velux' source='OBSTACLE' value={data?.properties?.obstacle ? 'OUI' : 'NON'} unity='' />
            <Button data-cy='send-roofer-mail-button' fullWidth loading={isEmailSentPending || isFinishing} onClick={handleTerminerClick}>
              Terminer
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </FormProvider>
  );
};
