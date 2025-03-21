import { useDialog, useStep } from '@/hooks';
import { AnnotatorCanvas, Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { HelpCenterOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { DetectionForm, DialogFormStyle } from '.';
import { useQueryStartDetection } from '../queries';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog, close: closeDialog } = useDialog();

  const setStep = useStep(({ setStep }) => setStep);

  const handleClickDetectionButton = () => {
    openDialog(
      <DetectionForm
        onValid={(receiverEmail: string) => {
          closeDialog();
          startDetection({ polygons, receiverEmail }, { onSuccess: () => setStep({ actualStep: 2, params: {} }) });
        }}
      />,
      { style: DialogFormStyle }
    );
  };

  return (
    <Box id='annotator-section'>
      <Paper elevation={0}>
        <Typography>Veuillez sélectionner votre toiture sur l'image suivante.</Typography>
        <IconButton>
          <HelpCenterOutlined />
        </IconButton>
      </Paper>
      <Box minHeight='500px'>
        <AnnotatorCanvas allowAnnotation width='100%' height='500px' image={imageSrc} setPolygons={setPolygons} polygonList={polygons} zoom={20} />
      </Box>
      <Button
        onClick={handleClickDetectionButton}
        disabled={polygons.length === 0 || (!isDetectionPending && geoJsonResult)}
        loading={isDetectionPending}
        variant='contained'
      >
        Analyser ma toiture
      </Button>
    </Box>
  );
};
