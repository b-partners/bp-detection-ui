import { FormControl, InputLabel, MenuItem, Select, SelectProps, TextField, Tooltip } from '@mui/material';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

const PENTES = [
  { url: '/assets/images/pentes/pente0.png', value: 0, title: 'Toit Plat' },
  { url: '/assets/images/pentes/pente1.png', value: 1, title: 'Pente 1/12' },
  { url: '/assets/images/pentes/pente2.png', value: 2, title: 'Pente 2/12' },
  { url: '/assets/images/pentes/pente3.png', value: 3, title: 'Pente 3/12' },
  { url: '/assets/images/pentes/pente4.png', value: 4, title: 'Pente 4/12' },
  { url: '/assets/images/pentes/pente5.png', value: 5, title: 'Pente 5/12' },
  { url: '/assets/images/pentes/pente6.png', value: 6, title: 'Pente 6/12' },
  { url: '/assets/images/pentes/pente7.png', value: 7, title: 'Pente 7/12' },
  { url: '/assets/images/pentes/pente8.png', value: 8, title: 'Pente 8/12' },
  { url: '/assets/images/pentes/pente9.png', value: 9, title: 'Pente 9/12' },
  { url: '/assets/images/pentes/pente10.png', value: 10, title: 'Pente 10/12' },
  { url: '/assets/images/pentes/pente11.png', value: 11, title: 'Pente 11/12' },
  { url: '/assets/images/pentes/pente12.png', value: 12, title: 'Pente 12/12' },
  { url: '/assets/images/pentes/pente13.png', value: 13, title: 'Pente 13/12' },
  { url: '/assets/images/pentes/pente14.png', value: 14, title: 'Pente 14/12' },
  { url: '/assets/images/pentes/pente15.png', value: 15, title: 'Pente 15/12' },
  { url: '/assets/images/pentes/pente16.png', value: 16, title: 'Pente 16/12' },
  { url: '/assets/images/pentes/pente17.png', value: 17, title: 'Pente 17/12' },
  { url: '/assets/images/pentes/pente18.png', value: 18, title: 'Pente 18/12' },
];

export const SlopeSelect: FC<SelectProps> = () => {
  const { register } = useFormContext();
  return <TextField type='number' {...register('slope')} label='Pente (%)' id='demo-simple-select' fullWidth />;
};
