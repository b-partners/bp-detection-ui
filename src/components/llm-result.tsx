import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef } from 'react';
import { llmResultStyle } from './style';

interface LlmResultProps {
  htmlData: string;
  width: string | number;
  height: string | number;
  isLoading: boolean;
}

export const LlmResult: FC<LlmResultProps> = ({ height, htmlData, width, isLoading }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && htmlData) {
      ref.current.innerHTML = htmlData;
    }
  }, [htmlData, ref]);

  return (
    <Box component='div' ref={ref} sx={llmResultStyle} marginTop={height === '100%' ? 15 : undefined} height={height || '100%'} width={width || '100%'}>
      {isLoading && (
        <Box className='loading-container'>
          <Stack className='loading-element-container'>
            <CircularProgress />
            <Typography>Chargement des explications du rapport...</Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
