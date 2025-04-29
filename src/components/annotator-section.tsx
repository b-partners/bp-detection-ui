import { useDialog, useStep } from '@/hooks';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { AnnotatorCanvasCustom, DetectionForm, DialogFormStyle } from '.';
import { useQueryStartDetection, useQueryUpdateAreaPicture } from '../queries';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog, close: closeDialog } = useDialog();
  const { data, mutate: updateAreaPicture, isPending } = useQueryUpdateAreaPicture();

  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  useEffect(() => {
    setCurrentImageSrc(data?.imageAsBase64 || '');
  }, [data]);

  const handleUpdateAreaPicture = () => {
    updateAreaPicture({ isExtended: true });
  };

  const setStep = useStep(({ setStep }) => setStep);

  const handleClickDetectionButton = () => {
    openDialog(
      <DetectionForm
        onValid={({ email, lastName, firstName, phone }) => {
          closeDialog();
          startDetection(
            { polygons, receiverEmail: email, phone, firstName, lastName },
            { onSuccess: result => setStep({ actualStep: 2, params: { geojsonBody: result?.geoJson as any } }) }
          );
        }}
      />,
      { style: DialogFormStyle }
    );
  };

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
          Recentrer l'image
        </Button>
      </Box>
      <Box minHeight='500px'>
        {!isPending && <AnnotatorCanvasCustom allowAnnotation setPolygons={setPolygons} polygonList={polygons} image={currentImageSrc} />}
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
