import { TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface BpInputProps extends TextFieldProps<'standard'> {
  name: string;
}

export const BpInput: FC<BpInputProps> = ({ name, ...others }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return <TextField {...others} {...register(name)} name={name} error={!!error} helperText={error ? (error.message as string) : false} />;
};
