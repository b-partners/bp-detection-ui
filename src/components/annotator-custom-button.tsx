import { useStep } from '@/hooks';
import { ScaleCallbacks } from '@bpartners/annotator-component';
import { ZoomIn, ZoomInMap, ZoomOut } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import { annotatorCustomButtonStyle } from './style';

interface AnnotatorCustomButtonProps extends Record<'callbacks', ScaleCallbacks> {
  customButtons?: ReactNode;
}

export const AnnotatorCustomButton: FC<AnnotatorCustomButtonProps> = ({ callbacks, customButtons }) => {
  const { scaleDown, scaleReste, scaleUp, xRef, yRef } = callbacks;
  const {
    params: { areaPictureDetails },
  } = useStep();
  return (
    <Stack sx={annotatorCustomButtonStyle} direction='row' width='100%' alignItems='center' justifyContent='space-between' gap={1}>
      <Stack className='annotator-info' gap={0.2}>
        <Stack direction='row' gap={0.2}>
          <Box>
            <p ref={xRef}>x: 0</p>
          </Box>
          <Box>
            <p ref={yRef}>y: 0</p>
          </Box>
        </Stack>
      </Stack>
      <Stack className='image-info' direction='row' gap={1}>
        <Box>
          <Typography>
            (GPS {areaPictureDetails?.geoPositions?.[0]?.latitude}, {areaPictureDetails?.geoPositions?.[0]?.latitude})
          </Typography>
        </Box>
        <Box>
          <Typography>Source : {areaPictureDetails?.actualLayer?.name}</Typography>
        </Box>
      </Stack>
      <Stack direction='row'>
        {customButtons}
        <IconButton data-cy='zoom-in' onClick={scaleUp}>
          <ZoomIn />
        </IconButton>
        <IconButton data-cy='zoom-reset' onClick={scaleReste}>
          <ZoomInMap />
        </IconButton>
        <IconButton data-cy='zoom-out' onClick={scaleDown}>
          <ZoomOut />
        </IconButton>
      </Stack>
    </Stack>
  );
};
