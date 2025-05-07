import { useDialog, useStep } from '@/hooks';
import { annotatorMapper } from '@/mappers';
import { Polygon } from '@bpartners/annotator-component';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import {
  AnnotationTutorialDialog,
  AnnotatorCanvasCustom,
  AnnotatorShiftButtons,
  DetectionForm,
  DetectionFormInfo,
  DialogFormStyle,
  DialogTutorialStyle,
  DomainPolygonType,
} from '..';
import { useQueryStartDetection, useQueryUpdateAreaPicture } from '../../queries';

export const AnnotateImageStep = () => {
  const {
    setStep,
    params: { imageSrc },
  } = useStep();

  const { open: openDialog, close: closeDialog } = useDialog();

  const [polygons, setPolygons] = useState<DomainPolygonType[]>([]);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection();
  const { isPending, isExtended, nextXShift, prevXShift } = useQueryUpdateAreaPicture();

  // const handleUpdateAreaPicture = () => extendImageToggle();

  const handleValidateForm = ({ email, lastName, firstName, phone }: DetectionFormInfo) => {
    closeDialog();
    startDetection(
      { polygons, receiverEmail: email, phone, firstName, lastName },
      { onSuccess: result => setStep({ actualStep: 2, params: { geojsonBody: result as any, geoJsonResultUrl: result.vggUrl } }) }
    );
  };
  const handleClickDetectionButton = () => openDialog(<DetectionForm onValid={handleValidateForm} />, { style: DialogFormStyle });

  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons
  const currentShiftNumber = { x: 0, y: 0 };
  const setMappedDomainPolygons = (polygons: Polygon[]) => setPolygons(polygons.map(polygon => annotatorMapper.toDomainPolygon(polygon, currentShiftNumber)));
  const mappedAnnotatorPolygons = polygons.map(polygon => annotatorMapper.toPolygonRest(polygon, currentShiftNumber));
  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons

  const openTutorialDialog = () => openDialog(<AnnotationTutorialDialog />, { style: DialogTutorialStyle });

  return (
    <Box id='annotator-section'>
      <Paper elevation={0} className='info-section'>
        <Stack>
          <Typography>Veuillez délimiter votre toiture sur l'image suivante.</Typography>
          {/* <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez recentrer l'image en cliquant sur le bouton Recentrer l'image</Typography> */}
        </Stack>
        <IconButton onClick={openTutorialDialog} className='help-button'>
          <HelpCenterOutlined fontSize='large' />
        </IconButton>
      </Paper>
      {/* <Box mb={2}>
        <Button variant='contained' onClick={handleUpdateAreaPicture} loading={isPending}>
          {isExtended ? "Restaurer l'image" : "Recentrer l'image"}
        </Button>
      </Box> */}
      <Box minHeight='500px'>
        <AnnotatorCanvasCustom
          customButtons={isExtended && <AnnotatorShiftButtons prevXShift={prevXShift} nextXShift={nextXShift} />}
          isLoading={isPending}
          allowAnnotation
          setPolygons={setMappedDomainPolygons}
          polygonList={mappedAnnotatorPolygons}
          image={imageSrc || ''}
        />
      </Box>
      <Button
        onClick={handleClickDetectionButton}
        disabled={polygons.length === 0 || (!isDetectionPending && !!geoJsonResult)}
        loading={isDetectionPending}
        variant='contained'
        data-cy='process-detection-button'
      >
        Analyser ma toiture
      </Button>
    </Box>
  );
};
