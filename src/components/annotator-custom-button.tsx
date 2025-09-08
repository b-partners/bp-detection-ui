import { ScaleCallbacks } from '@bpartners/annotator-component';
import { ZoomIn, ZoomInMap, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { FC, ReactNode } from 'react';
import { annotatorCustomButtonStyle } from './style';

interface AnnotatorCustomButtonProps extends Record<'callbacks', ScaleCallbacks> {
  customButtons?: ReactNode;
}

export const AnnotatorCustomButton: FC<AnnotatorCustomButtonProps> = ({ callbacks, customButtons }) => {
  const { scaleDown, scaleReste, scaleUp } = callbacks;
  return (
    <Stack sx={annotatorCustomButtonStyle} direction='row' width='100%' alignItems='center' justifyContent='flex-end'>
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
