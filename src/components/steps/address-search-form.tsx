import { useAddressFrom } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useLocationQuery } from '@/queries';
import { ArrowForward as ArrowForwardIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import { Box, Button, debounce, InputBase, MenuItem, Paper } from '@mui/material';
import { ChangeEvent, useMemo } from 'react';
import { QcmForm } from '../qcm-form';
import { QcmDialogStyle } from '../style';

interface AddressSearchFormProps {
  /**
   * The page renders several address forms (hero, mid-page CTA, final CTA). Only the
   * primary one carries the `address-search-input` data-cy so Cypress keeps matching a
   * single element.
   */
  primary?: boolean;
}

const searchAddressDebounceTimeout = 200;

export const AddressSearchForm = ({ primary = false }: AddressSearchFormProps) => {
  const { open: openDialog, isOpen } = useDialog();
  const {
    params: { sessionId },
  } = useStep();

  const { mutate: findLocation, data } = useLocationQuery(sessionId || '');
  const search = useMemo(() => debounce(findLocation, searchAddressDebounceTimeout), []);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => openDialog(<QcmForm address={data.address} />, { style: QcmDialogStyle }),
    error => alert(error.address)
  );

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
    <Box className='address-search'>
      <Paper onSubmit={onSubmit} {...others} component='form' className='address-form' elevation={0}>
        <LocationOnIcon className='address-form-pin' />
        <InputBase
          onChange={handleChange}
          {...(primary ? { 'data-cy': 'address-search-input' } : {})}
          className='address-form-input'
          placeholder="Saisissez l'adresse de votre logement"
          error={!!errors['address']}
        />
        <Button type='submit' onClick={onSubmit} className='btn-primary' endIcon={<ArrowForwardIcon />}>
          Analyser
        </Button>
      </Paper>
      {!isOpen && data && data.length > 0 && (
        <Box className='address-list'>
          <Paper>
            {data.map(({ description }: any) => (
              <MenuItem onClick={handleClickComplete(description)} key={description}>
                {description}
              </MenuItem>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
};
