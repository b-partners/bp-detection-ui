import { useDialog, useStep } from '@/hooks';
import { annotatorMapper } from '@/mappers';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { AnnotatorCanvasCustom, AnnotatorShiftButtons, DetectionForm, DetectionFormInfo, DialogFormStyle, DomainPolygonType } from '.';
import { useQueryStartDetection, useQueryUpdateAreaPicture } from '../queries';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const { setStep } = useStep();
  const [polygons, setPolygons] = useState<DomainPolygonType[]>([]);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog, close: closeDialog } = useDialog();
  const { data, extendImageToggle, isPending, isExtended, nextXShift, prevXShift } = useQueryUpdateAreaPicture();

  useEffect(() => {
    setCurrentImageSrc(data?.imageAsBase64 || '');
  }, [data]);

  const handleUpdateAreaPicture = () => extendImageToggle();

  const handleValidateForm = ({ email, lastName, firstName, phone }: DetectionFormInfo) => {
    closeDialog();
    startDetection(
      { polygons, receiverEmail: email, phone, firstName, lastName },
      { onSuccess: result => setStep({ actualStep: 2, params: { geojsonBody: result?.geoJson as any } }) }
    );
  };
  const handleClickDetectionButton = () => openDialog(<DetectionForm onValid={handleValidateForm} />, { style: DialogFormStyle });

  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons
  const currentShiftNumber = { x: areaPictureDetails.shiftNb || 0, y: 0 };
  const setMappedDomainPolygons = (polygons: Polygon[]) => setPolygons(polygons.map(polygon => annotatorMapper.toDomainPolygon(polygon, currentShiftNumber)));
  const mappedAnnotatorPolygons = polygons.map(polygon => annotatorMapper.toPolygonRest(polygon, currentShiftNumber));
  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons

  return (
    <Box id='annotator-section'>
      <Paper elevation={0}>
        <Stack>
          <Typography>Veuillez sélectionner votre toiture sur l'image suivante.</Typography>
          <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez recentrer l'image en cliquant sur le bouton Recentrer l'image</Typography>
        </Stack>
        <IconButton>
          <HelpCenterOutlined />
        </IconButton>
      </Paper>
      <Box mb={2}>
        <Button variant='contained' onClick={handleUpdateAreaPicture} loading={isPending}>
          {isExtended ? "Restaurer l'image" : "Recentrer l'image"}
        </Button>
      </Box>
      <Box minHeight='500px'>
        <AnnotatorCanvasCustom
          customButtons={isExtended && <AnnotatorShiftButtons prevXShift={prevXShift} nextXShift={nextXShift} />}
          isLoading={isPending}
          allowAnnotation
          setPolygons={setMappedDomainPolygons}
          polygonList={mappedAnnotatorPolygons}
          image={currentImageSrc}
        />
      </Box>
      <Button
        onClick={handleClickDetectionButton}
        disabled={polygons.length === 0 || (!isDetectionPending && geoJsonResult?.result)}
        loading={isDetectionPending}
        variant='contained'
        data-cy='process-detection-button'
      >
        Analyser ma toiture
      </Button>
    </Box>
  );
};
