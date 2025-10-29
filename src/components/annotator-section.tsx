import { useDialog, useSnackbar, useStep } from '@/hooks';
import { annotatorMapper } from '@/mappers';
import { checkPolygonSizeUnder1024 } from '@/utilities';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { addressStyle, AnnotationTutorialDialog, AnnotatorCanvasCustom, DialogTutorialStyle, DomainPolygonType } from '.';
import { useQueryStartDetection, useQueryUpdateAreaPicture } from '../queries';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const {
    setStep,
    params: { prospect },
  } = useStep();
  const [polygons, setPolygons] = useState<DomainPolygonType[]>([]);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog } = useDialog();
  const { open: openSnackbar } = useSnackbar();
  const { data, isPending, isExtended, extendImageToggle, refetchImage: handleGetNewImage } = useQueryUpdateAreaPicture();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCurrentImageSrc(data?.imageAsBase64 || imageSrc);
  }, [data]);

  const handleClearPolygon = () => setPolygons([]);

  const handleExtendImage = () => {
    handleClearPolygon();
    extendImageToggle();
  };

  const handleValidateForm = () => {
    const { email: receiverEmail = '', phone = '', firstName, name: lastName } = prospect || {};
    const detectionParams = { polygons, receiverEmail, phone, firstName, lastName, isExtended, image: currentImageSrc, withoutImage: true };

    startDetection(detectionParams, {
      onSuccess: result =>
        setStep({
          actualStep: 2,
          params: {
            geoJsonResultUrl: result?.result.geoJsonZone?.[0]?.properties?.vgg_file_url || '',
            geojsonBody: result?.geoJson as any,
            useGeoJson: true,
            imageSrc: result?.result?.geoJsonZone?.[0]?.properties?.original_image_url || '',
            roofDelimiter: result?.result?.roofDelimiter,
          },
        }),
    });
  };

  const handleClickDetectionButton = () => {
    const isValidPolygonSize = checkPolygonSizeUnder1024(polygons[0]);
    if (!isValidPolygonSize)
      openSnackbar('La toiture que vous avez sélectionnée est assez grande, la détection sur cette zone prendra un peu plus de temps.', 'warning');
    handleValidateForm();
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
          <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez élargir la zone en cliquant sur le bouton Élargir la zone</Typography>
          <Typography>
            Si l'image reçue ne correspond pas à l'adresse que vous avez demandée, cliquez sur le bouton Actualiser l’image pour obtenir une image correspondant
            à votre adresse.
          </Typography>
        </Stack>
        <IconButton onClick={openTutorialDialog} className='help-button'>
          <HelpCenterOutlined fontSize='large' />
        </IconButton>
      </Paper>
      <Stack direction='row' justifyContent='space-between'>
        <Box sx={addressStyle}>
          <Typography>Adresse: {areaPictureDetails?.address}</Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={2} mb={2}>
          <Button variant='contained' onClick={handleExtendImage} loading={isPending}>
            {isExtended ? 'Rétrécir la zone' : 'Élargir la zone'}
          </Button>
          <Button variant='contained' onClick={handleGetNewImage} disabled={isPending}>
            Actualiser l’image
          </Button>
          <Button variant='contained' onClick={handleClearPolygon} disabled={polygons.length === 0 || isPending}>
            Effacer la sélection
          </Button>
        </Box>
      </Stack>
      <Box minHeight='500px'>
        <AnnotatorCanvasCustom
          isLoading={isPending}
          allowAnnotation={polygons.length === 0}
          setPolygons={setMappedDomainPolygons}
          polygonList={mappedAnnotatorPolygons}
          image={currentImageSrc}
          closeOnNear
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
