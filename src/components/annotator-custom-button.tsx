import { useStep } from '@/hooks';
import { ScaleCallbacks } from '@bpartners/annotator-component';
import { ZoomIn, ZoomInMap, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AnnotatorCustomButtonProps extends Record<'callbacks', ScaleCallbacks> {
  customButtons?: ReactNode;
}

export const AnnotatorCustomButton: FC<AnnotatorCustomButtonProps> = ({ callbacks, customButtons }) => {
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
