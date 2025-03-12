import { SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { create } from 'zustand';

interface DialogOptions {
  closeOnBlur?: boolean;
  style?: SxProps;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  content: ReactNode;
}
interface DialogAction {
  open: (content: ReactNode, options?: DialogOptions) => void;
  close: () => void;
}

export const useDialog = create<DialogState & DialogAction>(set => ({
  close: () => set({ isOpen: false }),
  content: undefined,
  isOpen: false,
  open(content, options) {
    set({ content: content, ...options });
  },
}));
