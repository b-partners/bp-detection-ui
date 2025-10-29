import { useAddressFrom } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useLocationQuery } from '@/queries';
import { clearCached } from '@/utilities';
import { LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, debounce, IconButton, InputBase, MenuItem, Paper, Stack } from '@mui/material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { DetectionForm } from '../detection-form';
import { DialogFormStyle } from '../style';
import { GetAddressStepStyle as style } from './styles';

export const GetAddressStep = () => {
  const { open: openDialog, isOpen } = useDialog();
  const {
    params: { sessionId },
  } = useStep();

  const { mutate: findLocation, data } = useLocationQuery(sessionId || '');

  const searchAddressDebounceTimeout = 200;
  const search = useMemo(() => debounce(findLocation, searchAddressDebounceTimeout), []);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => openDialog(<DetectionForm address={data.address} />, { style: DialogFormStyle }),
    error => alert(error.address)
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
        <InputBase onChange={handleChange} data-cy='address-search-input' placeholder='Adresse à analyser' error={!!errors['address']} />
        <Stack>
          <IconButton onClick={onSubmit}>
            <SearchIcon />
          </IconButton>
        </Stack>
      </Paper>
      {!isOpen && data && data.length > 0 && (
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
