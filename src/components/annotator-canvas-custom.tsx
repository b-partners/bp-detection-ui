import { useStep } from '@/hooks';
import { AnnotatorCanvas, AnnotatorCanvasProps } from '@bpartners/annotator-component';
import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { AnnotatorCustomButton } from './annotator-custom-button';

export const AnnotatorCanvasCustom: FC<Omit<AnnotatorCanvasProps, 'buttonsComponent' | 'width' | 'height' | 'zoom'>> = props => {
  const {
    params: { areaPictureDetails },
  } = useStep();
  return (
    <>
      <AnnotatorCanvas
        {...props}
        buttonsComponent={callbacks => <AnnotatorCustomButton callbacks={callbacks} />}
        pointRadius={0}
        width='100%'
        height='500px'
        zoom={20}
      />
      <Stack textAlign='center'>
        <Typography>Source: {areaPictureDetails?.actualLayer?.source}</Typography>
      </Stack>
    </>
  );
};
