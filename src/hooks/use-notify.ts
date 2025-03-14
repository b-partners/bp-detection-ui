import { create } from 'zustand';

interface Notification {
  id: string;
  text: string;
  type: string;
  duration: number;
}

interface NotifyState {
  notifications: Notification[];
}
interface NotifyAction {
  open(notification: Notification): void;
  remove(id: string): void;
}

export const useNotify = create<NotifyState & NotifyAction>(set => ({
  notifications: [],
  open(notification) {
    set(prev => ({ notifications: [...prev.notifications, notification] }));
  },
  remove(id) {
    set(prev => ({ notifications: prev.notifications.filter(n => n.id !== id) }));
  },
}));
