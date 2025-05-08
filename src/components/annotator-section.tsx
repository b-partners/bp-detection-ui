import { useDialog, useStep } from '@/hooks';
import { annotatorMapper } from '@/mappers';
import { createImageFromPolygon } from '@/utilities';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { AnnotationTutorialDialog, AnnotatorCanvasCustom, DetectionForm, DetectionFormInfo, DialogFormStyle, DialogTutorialStyle, DomainPolygonType } from '.';
import { useQueryStartDetection, useQueryUpdateAreaPicture } from '../queries';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const { setStep } = useStep();
  const [polygons, setPolygons] = useState<DomainPolygonType[]>([]);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog, close: closeDialog } = useDialog();
  const { data, isPending, isExtended, extendImageToggle } = useQueryUpdateAreaPicture();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGetCroppedImage = () => {
    return new Promise<{ image?: ArrayBuffer; polygons?: DomainPolygonType[] }>(resolve => {
      const canvas = canvasRef.current;
      if (canvas) {
        const image = new Image();
        image.src = data?.imageAsBase64 || '';

        image.onload = async () => {
          const { toArrayBuffer, boundingBox } = createImageFromPolygon(polygons[0], canvas, image);

          const mappedPolygons = polygons.map(({ points, ...polygon }) => ({
            ...polygon,
            points: points.map(({ x, y }) => ({ x: x - boundingBox.x, y: y - boundingBox.y })),
          }));

          resolve({ image: await toArrayBuffer(), polygons: mappedPolygons });
        };
      } else {
        resolve({ image: undefined, polygons: undefined });
      }
    });
  };

  useEffect(() => {
    setCurrentImageSrc(data?.imageAsBase64 || '');
  }, [data]);

  const handleUpdateAreaPicture = () => extendImageToggle();

  const handleValidateForm = ({ email, lastName, firstName, phone }: DetectionFormInfo) => {
    const croppedImage = isExtended ? handleGetCroppedImage() : Promise.resolve({ image: undefined, polygons: undefined });
    closeDialog();
    startDetection(
      { polygons, receiverEmail: email, phone, firstName, lastName, isExtended, isExtendedImage: croppedImage, image: currentImageSrc },
      { onSuccess: result => setStep({ actualStep: 2, params: { geojsonBody: result?.geoJson as any } }) }
    );
  };
  const handleClickDetectionButton = () => openDialog(<DetectionForm onValid={handleValidateForm} />, { style: DialogFormStyle });

  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons
  const currentShiftNumber = { x: areaPictureDetails.shiftNb || 0, y: 0 };
  const setMappedDomainPolygons = (polygons: Polygon[]) => setPolygons(polygons.map(polygon => annotatorMapper.toDomainPolygon(polygon, currentShiftNumber)));
  const mappedAnnotatorPolygons = polygons.map(polygon => annotatorMapper.toPolygonRest(polygon, currentShiftNumber));
  // always follow polygons image by storing the shift number in their id in the annotator component polygons and in the shiftNb property in domain polygons

  const openTutorialDialog = () => openDialog(<AnnotationTutorialDialog />, { style: DialogTutorialStyle });

  return (
    <Box id='annotator-section'>
      <Paper elevation={0} className='info-section'>
        <Stack>
          <Typography>Veuillez délimiter votre toiture sur l'image suivante.</Typography>
          <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez recentrer l'image en cliquant sur le bouton Recentrer l'image</Typography>
        </Stack>
        <IconButton onClick={openTutorialDialog} className='help-button'>
          <HelpCenterOutlined fontSize='large' />
        </IconButton>
      </Paper>
      <Box mb={2}>
        <Button variant='contained' onClick={handleUpdateAreaPicture} loading={isPending}>
          {isExtended ? "Restaurer l'image" : "Recentrer l'image"}
        </Button>
      </Box>
      <Box minHeight='500px'>
        <AnnotatorCanvasCustom
          // customButtons={<AnnotatorShiftButtons prevXShift={prevXShift} nextXShift={nextXShift} />}
          isLoading={isPending}
          allowAnnotation={polygons.length === 0}
          setPolygons={setMappedDomainPolygons}
          polygonList={mappedAnnotatorPolygons}
          image={currentImageSrc}
        />
        <Box ref={canvasRef} component='canvas' display='none'></Box>
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
