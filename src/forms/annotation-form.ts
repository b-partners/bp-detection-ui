import { useStep } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import zod from 'zod';

const schema = zod.object({
  cover1: zod.custom(() => true),
  cover2: zod.custom(() => true),
  slope: zod.custom(() => true),
});

const resolver = zodResolver(schema);

const degToRad = (degrees: number) => degrees * (Math.PI / 180);

interface RoofDelimiter {
  roofSlopeInDegree: number;
  roofHeightInMeter: number;
  polygon?: any;
}

const getSlopeValue = (roofDelimiter: RoofDelimiter) => {
  const roofHalfWidth = roofDelimiter.roofHeightInMeter / Math.tan(degToRad(roofDelimiter.roofSlopeInDegree));
  const result = roofDelimiter.roofHeightInMeter * (12 / roofHalfWidth);
  return Math.round(result);
};

export type TAnnotationForm = zod.infer<typeof schema>;
export const useAnnotationFrom = () => {
  const {
    params: { roofDelimiter },
  } = useStep();

  const form = useForm({ mode: 'all', resolver });

  useEffect(() => {
    form.setValue('slope', roofDelimiter?.roofSlopeInDegree);
  }, [roofDelimiter]);

  return form;
};
