import { AreaPictureDetails } from '@bpartners/typescript-client';
import { create } from 'zustand';

interface State {
  actualStep: 0 | 1 | 2 | 3;
  params: {
    imageSrc?: string;
    areaPictureDetails?: AreaPictureDetails;
  };
}

interface Action {
  setStep(step: State): void;
}

export const useStep = create<State & Action>(set => ({
  params: {},
  setStep(step) {
    set(() => ({ ...step }));
  },
  actualStep: 0,
}));
