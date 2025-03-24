import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const phoneNumberValidator = (phone: string) => {
  const regex = /^(?:\+?\d{1,3})?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
  return regex.test(phone);
};

const schema = z.object({
  firstName: z.custom(() => true),
  lastName: z.custom(() => true),
  phone: z
    .string({ required_error: 'Le numéro de téléphone est requis.', message: 'Le numéro de téléphone est requis.' })
    .refine(value => phoneNumberValidator(value), { message: 'Numéro de téléphone non valide' }),
  email: z.string({ required_error: 'Ce champs est requis.', message: 'Adresse email non valide.' }).email({ message: 'Adresse email non valide.' }),
});

const resolver = zodResolver(schema);

export const useDetectionForm = () => useForm({ mode: 'all', resolver });
