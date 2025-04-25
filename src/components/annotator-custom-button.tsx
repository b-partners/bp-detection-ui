import { useStep } from '@/hooks';
import { ScaleCallbacks } from '@bpartners/annotator-component';
import { ZoomIn, ZoomInMap, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { FC } from 'react';

export const AnnotatorCustomButton: FC<Record<'callbacks', ScaleCallbacks>> = ({ callbacks }) => {
  const { scaleDown, scaleReste, scaleUp } = callbacks;
  const {
    params: { areaPictureDetails },
  } = useStep();
  return (
    <Stack direction='row' width='100%' justifyContent='space-between'>
      <Stack flexGrow={1} textAlign='center'>
        <Typography>{areaPictureDetails?.address}</Typography>
        <Typography>
          (GPS {areaPictureDetails?.geoPositions?.[0]?.latitude}, {areaPictureDetails?.geoPositions?.[0]?.latitude})
        </Typography>
      </Stack>
      <Stack direction='row'>
        <IconButton onClick={scaleUp}>
          <ZoomIn />
        </IconButton>
        <IconButton onClick={scaleReste}>
          <ZoomInMap />
        </IconButton>
        <IconButton onClick={scaleDown}>
          <ZoomOut />
        </IconButton>
      </Stack>
    </Stack>
  );
};
