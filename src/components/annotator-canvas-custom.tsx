import { useStep } from '@/hooks';
import { AnnotatorCanvas, AnnotatorCanvasProps } from '@bpartners/annotator-component';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { AnnotatorCustomButton } from './annotator-custom-button';

interface AnnotatorCanvasCustomProps extends Omit<AnnotatorCanvasProps, 'buttonsComponent' | 'width' | 'height' | 'zoom'> {
  isLoading?: boolean;
}

export const AnnotatorCanvasCustom: FC<AnnotatorCanvasCustomProps> = ({ isLoading, ...props }) => {
  const {
    params: { areaPictureDetails },
  } = useStep();
  return (
    <Box position='relative'>
      {isLoading && (
        <Box width='100%' height='600px' display='flex' justifyContent='center' alignItems='center' bgcolor={theme => theme.palette.grey[100]}>
          <CircularProgress size={25} />
        </Box>
      )}
      {!isLoading && (
        <AnnotatorCanvas {...props} buttonsComponent={callbacks => <AnnotatorCustomButton callbacks={callbacks} />} width='100%' height='500px' zoom={20} />
      )}
      <Stack textAlign='center'>
        <Typography>Source: {areaPictureDetails?.actualLayer?.source}</Typography>
      </Stack>
    </Box>
  );
};
