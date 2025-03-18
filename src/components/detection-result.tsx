import { useQueryDetectionResult } from '@/queries';
import { messageBeforeClose, scrollToBottom } from '@/utilities';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { DetectionResultItem } from './detection-result-items';

export const DetectionResult = () => {
  const { isPending, data } = useQueryDetectionResult();

  useEffect(() => {
    messageBeforeClose();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [isPending]);

  return (
    <Stack>
      {isPending && (
        <Stack className='progress-bar-detection'>
          <Paper>
            <Typography>L'analyse de la toiture en cours</Typography>
          </Paper>
          <LinearProgress />
        </Stack>
      )}
      {data && !isPending && <DetectionResultItem />}
    </Stack>
  );
};
