import { ReferencerGeoJSON } from '@/providers';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { create } from 'zustand';

interface State {
  actualStep: 0 | 1 | 2 | 3;
  params: {
    imageSrc?: string;
    areaPictureDetails?: AreaPictureDetails;
    geojsonBody?: ReferencerGeoJSON;
    geoJsonResultUrl?: any;
  };
}

interface Action {
  setStep(step: State): void;
}

export const useStep = create<State & Action>(set => ({
  params: {},
  setStep(step) {
    set(prev => ({ ...prev, ...step, params: { ...prev.params, ...step.params } }));
  },
  actualStep: 0,
}));
