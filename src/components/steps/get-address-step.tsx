import { useAddressFrom } from '@/forms';
import { useGetImageFromAddress, useLocationQuery } from '@/queries';
import { clearCached } from '@/utilities';
import { Error as ErrorIcon, LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, CircularProgress, debounce, IconButton, InputBase, MenuItem, Paper, Stack } from '@mui/material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { GetAddressStepStyle as style } from './styles';

export const GetAddressStep = () => {
  const { isGetImagePending, getImageFromAddress } = useGetImageFromAddress();

  const { findLocation, isFindLocationPending, locationData } = useLocationQuery();

  const searchAddressDebounceTimeout = 200;
  const search = useMemo(() => debounce(findLocation, searchAddressDebounceTimeout), []);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => {
      getImageFromAddress(data.address);
    },
    error => {
      alert(error.address);
    }
  );

  useEffect(() => {
    clearCached.all();
  }, []);

  const { onChange, ...others } = register('address');

  const handleClickComplete = (text: string) => () => {
    setValue('address', text);
    findLocation('');
    onSubmit();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = event.target.value;
    setValue('address', text);
    if (!isGetImagePending) {
      search(text);
    }
  };

  return (
    <Stack sx={style} alignItems='center'>
      <Paper onSubmit={onSubmit} {...others} component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            {isFindLocationPending && <CircularProgress size={25} />}
            {!isFindLocationPending && <LocationOnIcon />}
          </IconButton>
        </Stack>
        <InputBase
          onChange={handleChange}
          data-cy='address-search-input'
          disabled={isGetImagePending}
          placeholder='Adresse à analyser'
          error={!!errors['address']}
        />
        <Stack>
          <IconButton onClick={onSubmit}>
            {isGetImagePending && <CircularProgress size={25} />}
            {!isGetImagePending && errors['address'] && <ErrorIcon />}
            {!isGetImagePending && !errors['address'] && <SearchIcon />}
          </IconButton>
        </Stack>
      </Paper>
      {!isGetImagePending && locationData && locationData.length > 0 && (
        <Box className='location-list'>
          <Paper>
            {locationData.map(({ description }: any) => (
              <MenuItem onClick={handleClickComplete(description)} key={description}>
                {description}
              </MenuItem>
            ))}
          </Paper>
        </Box>
      )}
    </Stack>
  );
};
