import { Notification, useNotify } from '@/hooks';
import { Alert, AlertProps, Stack } from '@mui/material';
import { FC, useEffect, useRef } from 'react';

interface NofificationProps {
  notification: Notification;
}

const NofificationAlert: FC<NofificationProps> = ({ notification }) => {
  const { duration, id, text, type } = notification;
  const { remove } = useNotify();
  const timeoutId = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      remove(id);
      clearTimeout(timeoutId.current);
    }, duration);
  }, []);

  const handleClose = () => {
    clearTimeout(timeoutId.current);
    remove(id);
  };

  return (
    <Alert sx={{ minWidth: 400, maxWidth: 700 }} variant='filled' onClose={handleClose} key={id} severity={type as AlertProps['severity']}>
      {text}
    </Alert>
  );
};

export const GlobalNotification = () => {
  const { notifications } = useNotify();

  return (
    <Stack id='notification-container' position='absolute' top={20} right={20}>
      {notifications.map(notification => (
        <NofificationAlert notification={notification} />
      ))}
    </Stack>
  );
};
