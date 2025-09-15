import { detectionResultColors } from '@/mappers';
import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { detectionResultItemStyle } from './styles';

interface ResultItemProps {
  label: string;
  value: number | string;
  source: string;
  unity?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

export const DetectionResultItem: FC<ResultItemProps> = ({ label, value, source, unity = '%', loadingMessage, isLoading }) => {
  const bgcolor = detectionResultColors[source as keyof typeof detectionResultColors];
  return (
    <Paper sx={detectionResultItemStyle} key={source}>
      {!isLoading && (
        <>
          <Stack direction='row' gap={1}>
            {bgcolor && <Box className='color-legend' sx={{ bgcolor }}></Box>}
            <Typography className='label'>{label}</Typography>
          </Stack>
          <Typography className='result'>{`${value || 0}${unity}`}</Typography>
        </>
      )}
      {isLoading && (
        <Stack gap={1} direction='row' className='detection-result-item-loading'>
          <Typography>{loadingMessage}</Typography>
          <CircularProgress size={20} />
        </Stack>
      )}
    </Paper>
  );
};
