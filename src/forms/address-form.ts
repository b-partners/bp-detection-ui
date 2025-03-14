import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import zod from 'zod';

const schema = zod.object({
  address: zod.string({ required_error: 'Ce champ est requis', message: 'Adresse non valide' }).min(4, { message: 'Adresse non valide' }),
});

const resolver = zodResolver(schema);

export const useAddressFrom = () => useForm({ mode: 'all', resolver });
