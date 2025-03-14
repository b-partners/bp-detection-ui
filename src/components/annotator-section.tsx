import { useDialog } from '@/hooks';
import { AnnotatorCanvas, Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useQueryStartDetection } from '../queries';
import { DetectionForm } from './detection-form';
import { DialogFormStyle } from './style';

export const AnnotatorSection: FC<{ imageSrc: string; areaPictureDetails: AreaPictureDetails }> = ({ imageSrc, areaPictureDetails }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const { isDetectionPending, geoJsonResult, startDetection } = useQueryStartDetection(imageSrc, areaPictureDetails);
  const { open: openDialog, close: closeDialog } = useDialog();

  const handleClickDetectionButton = () => {
    openDialog(
      <DetectionForm
        onValid={() => {
          closeDialog();
          startDetection(polygons);
        }}
      />,
      { style: DialogFormStyle }
    );
  };

  return (
    <Box id='annotator-section'>
      <Paper elevation={0}>
        <Typography>Veuillez sélectionner sur l'image suivante votre toiture</Typography>
      </Paper>
      <Box minHeight='500px'>
        <AnnotatorCanvas allowAnnotation width='100%' height='500px' image={imageSrc} setPolygons={setPolygons} polygonList={polygons} zoom={20} />
      </Box>
      <Button onClick={handleClickDetectionButton} disabled={polygons.length === 0} loading={isDetectionPending} variant='contained'>
        Valider ma toiture
      </Button>
      {!!geoJsonResult && (
        <Stack className='progress-bar-detection'>
          <Paper>
            <Typography>L'analyse de la toiture en cours</Typography>
          </Paper>
          <LinearProgress />
        </Stack>
      )}
    </Box>
  );
};
