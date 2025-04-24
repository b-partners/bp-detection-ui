import { useAddressFrom } from '@/forms';
import { useStep } from '@/hooks';
import { useLocationQuery, useQueryImageFromAddress } from '@/queries';
import { clearCached } from '@/utilities';
import { Error as ErrorIcon, LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, CircularProgress, debounce, IconButton, InputBase, MenuItem, Paper, Stack } from '@mui/material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { GetAddressStepStyle as style } from './styles';

export const GetAddressStep = () => {
  const { isQueryImagePending, queryImage, imageSrc, areaPictureDetails, prospect } = useQueryImageFromAddress();

  const {
    setStep,
    params: { sessionId },
  } = useStep();

  const { mutate: findLocation, data } = useLocationQuery(sessionId || '');

  const search = useMemo(() => debounce(findLocation, 300), []);

  useEffect(() => {
    if (imageSrc && areaPictureDetails && prospect) {
      setStep({ actualStep: 1, params: { imageSrc, areaPictureDetails, prospect } });
    }
  }, [imageSrc, areaPictureDetails, setStep, prospect]);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => {
      queryImage(data.address);
    },
    error => {
      alert(error.address);
    }
  );

  useEffect(() => {
    clearCached.detectionId();
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
    search(text);
  };

  return (
    <Stack sx={style} alignItems='center'>
      <Paper onSubmit={onSubmit} {...others} component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
        </Stack>
        <InputBase
          onChange={handleChange}
          data-cy='address-search-input'
          disabled={isQueryImagePending}
          placeholder='Adresse à analysé'
          error={!!errors['address']}
        />
        <Stack>
          <IconButton onClick={onSubmit}>
            {isQueryImagePending && <CircularProgress size={25} />}
            {!isQueryImagePending && errors['address'] && <ErrorIcon />}
            {!isQueryImagePending && !errors['address'] && <SearchIcon />}
          </IconButton>
        </Stack>
      </Paper>
      {data && data.length > 0 && (
        <Box className='location-list'>
          <Paper>
            {data.map(({ description }: any) => (
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
