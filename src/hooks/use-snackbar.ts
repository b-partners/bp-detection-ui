// store/snackbarStore.ts
import { create } from 'zustand';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
  open: boolean;
  message: string;
  type: SnackbarType;
  showSnackbar: (message: string, type?: SnackbarType) => void;
  closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>(set => ({
  open: false,
  message: '',
  type: 'info',
  showSnackbar: (message, type = 'info') => set({ open: true, message, type }),
  closeSnackbar: () => set({ open: false, message: '', type: 'info' }),
}));

export const useSnackbar = () => {
  const { showSnackbar, closeSnackbar } = useSnackbarStore();
  return { open: showSnackbar, close: closeSnackbar };
};
