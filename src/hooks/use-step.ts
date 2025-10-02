import { DomainPolygonType } from '@/components';
import { ReferencerGeoJSON } from '@/providers';
import { AreaPictureDetails, Prospect } from '@bpartners/typescript-client';
import { create } from 'zustand';

interface State {
  actualStep: 0 | 1 | 2;
  params: {
    imageSrc?: string;
    areaPictureDetails?: AreaPictureDetails;
    geojsonBody?: ReferencerGeoJSON;
    geoJsonResultUrl?: any;
    sessionId?: string;
    prospect?: Prospect;
    polygons?: DomainPolygonType[];
    useGeoJson?: boolean;
    detection?: any;
    roofDelimiter?: {
      roofSlopeInDegree?: number;
      roofHeightInMeter?: number;
      polygon?: any;
    };
  };
}

interface Action {
  setStep(step: State): void;
  setSession(session: string): void;
  reset(): void;
}

const defaultState: any = {
  params: {},
  actualStep: 0,
};

export const useStep = create<State & Action>(set => ({
  ...defaultState,
  reset() {
    set(defaultState);
  },
  setStep(step) {
    set(prev => ({ ...prev, ...step, params: { ...prev.params, ...step.params } }));
  },
  setSession(session) {
    set(prev => ({ ...prev, params: { ...prev.params, sessionId: session } }));
  },
}));
