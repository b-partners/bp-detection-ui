import { AlertProps } from '@mui/material';
import { v4 } from 'uuid';
import { create } from 'zustand';

export interface Notification {
  id: string;
  text: string;
  type: AlertProps['severity'];
  duration: number;
}

interface NotifyState {
  notifications: Notification[];
}
interface NotifyAction {
  open(notification: Omit<Notification, 'id' | 'duration'>, duration?: number): void;
  remove(id: string): void;
}

export const useNotify = create<NotifyState & NotifyAction>(set => ({
  notifications: [],
  open(notification, duration = 5000) {
    set(prev => ({ notifications: [...prev.notifications, { ...notification, id: v4(), duration }] }));
  },
  remove(id) {
    set(prev => ({ notifications: prev.notifications.filter(n => n.id !== id) }));
  },
}));
