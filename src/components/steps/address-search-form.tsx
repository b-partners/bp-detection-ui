import { useAddressFrom } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useLocationQuery } from '@/queries';
import { ArrowForward as ArrowForwardIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import { Autocomplete, Box, Button, CircularProgress, debounce, Paper, TextField } from '@mui/material';
import { BaseSyntheticEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
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

// Secondary forms (e.g. the final CTA) hand their address over to the primary hero form, so both buttons run the exact same flow.
const HERO_SUBMIT_EVENT = 'hero-address-submit';

export const AddressSearchForm = ({ primary = false }: AddressSearchFormProps) => {
  const { open: openDialog } = useDialog();
  const {
    params: { sessionId },
  } = useStep();

  const { mutate: findLocation, data = [], isPending } = useLocationQuery(sessionId || '');
  const options = useMemo(() => (data || []).map(({ description }: any) => description).filter(Boolean), [data]);
  const search = useMemo(() => debounce(findLocation, searchAddressDebounceTimeout), [findLocation]);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useAddressFrom();

  const { onBlur, ref } = register('address');
  const [inputValue, setInputValue] = useState('');

  const submitAddress = handleSubmit(
    data => openDialog(<QcmForm address={data.address} />, { style: QcmDialogStyle }),
    error => alert(error.address)
  );

  const onSubmit = primary
    ? submitAddress
    : (event?: BaseSyntheticEvent) => {
        event?.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent(HERO_SUBMIT_EVENT, { detail: inputValue }));
      };

  useEffect(() => {
    if (!primary) return;
    const onHeroSubmit = (event: Event) => {
      const address = (event as CustomEvent<string>).detail ?? '';
      setInputValue(address);
      setValue('address', address);
      submitAddress();
    };
    window.addEventListener(HERO_SUBMIT_EVENT, onHeroSubmit);
    return () => window.removeEventListener(HERO_SUBMIT_EVENT, onHeroSubmit);
  });

  const handleInputChange = (_event: SyntheticEvent, newInputValue: string, reason: string) => {
    setInputValue(newInputValue);
    setValue('address', newInputValue);
    if (reason === 'input') search(newInputValue);
  };

  const handleChange = (_event: SyntheticEvent, newValue: string | null) => {
    if (!newValue) return;
    setInputValue(newValue);
    setValue('address', newValue);
    findLocation('');
    onSubmit();
  };

  return (
    <Box className='address-search'>
      <Paper onSubmit={onSubmit} component='form' className='address-form' elevation={0}>
        <LocationOnIcon className='address-form-pin' />
        <Autocomplete
          freeSolo
          fullWidth
          className='address-form-input'
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          options={isPending ? [] : options}
          filterOptions={allOptions => allOptions}
          noOptionsText={isPending ? 'Recherche en cours' : 'Aucun résultat'}
          renderInput={params => (
            <TextField
              {...params}
              variant='standard'
              placeholder="Saisissez l'adresse de votre logement"
              error={!!errors['address']}
              inputRef={ref}
              onBlur={onBlur}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                endAdornment: isPending ? <CircularProgress size={18} /> : params.InputProps.endAdornment,
              }}
              inputProps={{
                ...params.inputProps,
                ...(primary ? { 'data-cy': 'address-search-input' } : {}),
              }}
            />
          )}
        />
        <Button type='submit' onClick={onSubmit} className='btn-primary' endIcon={<ArrowForwardIcon />}>
          Analyser
        </Button>
      </Paper>
    </Box>
  );
};
