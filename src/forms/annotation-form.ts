import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import zod from 'zod';

const schema = zod.object({
  cover1: zod.custom(() => true),
  cover2: zod.custom(() => true),
  slope: zod.custom(() => true),
});

const resolver = zodResolver(schema);

export type TAnnotationForm = zod.infer<typeof schema>;
export const useAnnotationFrom = () => useForm({ mode: 'all', resolver });
