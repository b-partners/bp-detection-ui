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
  return (
    <Paper sx={detectionResultItemStyle} key={source}>
      {!isLoading && (
        <Box className='item-label-container'>
          <Typography className='label'>{`${label}: ${value || 0}${unity}`}</Typography>
        </Box>
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
