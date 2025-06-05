import { useDialog, useStep } from '@/hooks';
import { annotatorMapper } from '@/mappers';
import { checkPolygonSizeUnder1024, createImageFromPolygon } from '@/utilities';
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
  const { data, isPending, isExtended, extendImageToggle, refetchImage: handleGetNewImage } = useQueryUpdateAreaPicture();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGetCroppedImage = () =>
    new Promise<{ image?: ArrayBuffer; polygons?: DomainPolygonType[] }>(resolve => {
      const isValidPoligonSize = checkPolygonSizeUnder1024(polygons[0]);
      const canvas = canvasRef.current;
      if (canvas) {
        const image = new Image();
        image.src = data?.imageAsBase64 || '';

        image.onload = async () => {
          const { toArrayBuffer, boundingBox } = createImageFromPolygon(polygons[0], canvas, image);

          const mappedPolygons = polygons.map(({ points, ...polygon }) => ({
            ...polygon,
            points: points.map(({ x, y }) => ({ x: x - (isValidPoligonSize ? boundingBox.x : 0), y: y - (isValidPoligonSize ? boundingBox.y : 0) })),
          }));

          resolve({ image: await toArrayBuffer(), polygons: mappedPolygons });
        };
      } else {
        resolve({ image: undefined, polygons: undefined });
      }
    });

  useEffect(() => {
    setCurrentImageSrc(data?.imageAsBase64 || imageSrc);
  }, [data]);

  const handleClearPolygon = () => setPolygons([]);

  const handleExtendImage = () => {
    handleClearPolygon();
    extendImageToggle();
  };

  const handleValidateForm = ({ email, lastName, firstName, phone }: DetectionFormInfo) => {
    const isValidPoligonSize = checkPolygonSizeUnder1024(polygons[0]);
    const croppedImage = isExtended ? handleGetCroppedImage() : Promise.resolve({ image: undefined, polygons: undefined });
    closeDialog();
    startDetection(
      {
        polygons,
        receiverEmail: email,
        phone,
        firstName,
        lastName,
        isExtended,
        isExtendedImage: croppedImage,
        image: currentImageSrc,
        withoutImage: !isValidPoligonSize,
      },
      {
        onSuccess: result =>
          setStep({ actualStep: 2, params: { geojsonBody: result?.geoJson as any, imageSrc: currentImageSrc, useGeoJson: !isValidPoligonSize } }),
      }
    );
  };

  const handleClickDetectionButton = () => {
    const isValidPoligonSize = checkPolygonSizeUnder1024(polygons[0]);

    openDialog(<DetectionForm onValid={handleValidateForm} withoutImage={!isValidPoligonSize} />, { style: DialogFormStyle });
  };

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
          <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez elargir la zone en cliquant sur le bouton Elargir la zone</Typography>
          <Typography>
            Si l'image reçue ne correspond pas à l'adresse que vous avez demandée, cliquez sur le bouton Actualiser l’image pour obtenir une image correspondant
            à votre adresse.
          </Typography>
        </Stack>
        <IconButton onClick={openTutorialDialog} className='help-button'>
          <HelpCenterOutlined fontSize='large' />
        </IconButton>
      </Paper>
      <Box display='flex' alignItems='center' gap={2} mb={2}>
        <Button variant='contained' onClick={handleExtendImage} loading={isPending}>
          {isExtended ? 'Rétrécir la zone' : 'Elargir la zone'}
        </Button>
        <Button variant='contained' onClick={handleGetNewImage} disabled={isPending}>
          Actualiser l’image
        </Button>
        <Button variant='contained' onClick={handleClearPolygon} disabled={polygons.length === 0 || isPending}>
          Effacer la sélection
        </Button>
      </Box>
      <Box minHeight='500px'>
        <AnnotatorCanvasCustom
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
