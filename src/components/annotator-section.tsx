import { AnnotatorCanvas, Polygon } from '@bpartners/annotator-component';
import { Box, Button, Paper, Typography } from '@mui/material';
import { FC, useState } from 'react';

export const AnnotatorSection: FC<{ imageSrc: string }> = ({ imageSrc }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <Box id='annotator-section'>
      <Paper elevation={0}>
        <Typography>Veuillez sélectionner sur l'image suivante votre toiture</Typography>
      </Paper>
      <AnnotatorCanvas allowAnnotation width='100%' height='500px' image={imageSrc} setPolygons={setPolygons} polygonList={polygons} zoom={20} />
      <Button disabled={polygons.length === 0} variant='contained'>
        Valider ma toiture
      </Button>
    </Box>
  );
};
