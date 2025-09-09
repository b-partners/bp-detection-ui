import { useStep } from '@/hooks';
import { getSlopeValue } from '@/utilities';
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

export type TAnnotationForm = zod.infer<typeof schema>;
export const useAnnotationFrom = () => {
  const {
    params: { roofDelimiter },
  } = useStep();

  const form = useForm({ mode: 'all', resolver });

  useEffect(() => {
    const slope = getSlopeValue({ roofHeightInMeter: roofDelimiter?.roofHeightInMeter || 1, roofSlopeInDegree: roofDelimiter?.roofSlopeInDegree || 1 });
    form.setValue('slope', slope);
  }, [roofDelimiter]);

  return form;
};
