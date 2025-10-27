import { AnnotatorCanvas, AnnotatorCanvasProps } from '@bpartners/annotator-component';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { AnnotatorCustomButton } from './annotator-custom-button';

interface AnnotatorCanvasCustomProps extends Omit<AnnotatorCanvasProps, 'buttonsComponent' | 'width' | 'height' | 'zoom'> {
  isLoading?: boolean;
  customButtons?: ReactNode;
  height?: string;
}

export const AnnotatorCanvasCustom: FC<AnnotatorCanvasCustomProps> = ({ isLoading, customButtons, height, ...props }) => {
  return (
    <>
      <Box position='relative' sx={{ minHeight: '500px' }}>
        {(isLoading || props.image.length === 0) && (
          <Box width='100%' height='600px' display='flex' justifyContent='center' alignItems='center' bgcolor={theme => theme.palette.grey[100]}></Box>
        )}
        {!isLoading && (
          <AnnotatorCanvas
            {...props}
            buttonsComponent={callbacks => <AnnotatorCustomButton customButtons={customButtons} callbacks={callbacks} />}
            width='100%'
            height={height || '500px'}
            zoom={20}
            measurementMapper={p => {
              if (p.polygonId?.includes('roofPolygon')) return p;
              return { ...p, isInvisible: true };
            }}
          />
        )}
      </Box>
    </>
  );
};
