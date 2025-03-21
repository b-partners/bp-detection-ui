import { useAddressFrom } from '@/forms';
import { useStep } from '@/hooks';
import { useQueryImageFromAddress } from '@/queries';
import { Error as ErrorIcon, LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, InputBase, Paper, Stack } from '@mui/material';
import { useEffect } from 'react';
import { GetAddressStepStyle as style } from './styles';

export const GetAddressStep = () => {
  const { isQueryImagePending, queryImage, imageSrc, areaPictureDetails } = useQueryImageFromAddress();

  const setStep = useStep(e => e.setStep);

  useEffect(() => {
    if (imageSrc && areaPictureDetails) {
      setStep({ actualStep: 1, params: { imageSrc, areaPictureDetails } });
    }
  }, [imageSrc, areaPictureDetails, setStep]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => {
      queryImage(data.address);
    },
    error => {
      alert(error.address);
    }
  );

  return (
    <Box sx={style}>
      <Paper onSubmit={onSubmit} component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
        </Stack>
        <InputBase {...register('address')} disabled={isQueryImagePending} placeholder='Adresse à analysé' error={!!errors['address']} />
        <Stack>
          <IconButton onClick={onSubmit}>
            {isQueryImagePending && <CircularProgress size={25} />}
            {!isQueryImagePending && errors['address'] && <ErrorIcon />}
            {!isQueryImagePending && !errors['address'] && <SearchIcon />}
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};
