import { AnnotatorSection, GlobalDialog } from '@/components';
import { useQueryImageFromAddress } from '@/queries';
import { MainStyle as style } from '@/style';
import { Error, LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import './App.css';
import { useAddressFrom } from './forms';
import { scrollToBottom } from './utilities';

function App() {
  const { imageSrc, isQueryImagePending, queryImage } = useQueryImageFromAddress();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useAddressFrom();

  const onSubmit = handleSubmit(
    data => {
      queryImage(data.address, { onSuccess: scrollToBottom });
    },
    error => {
      alert(error.address);
    }
  );

  return (
    <Stack sx={style}>
      <img alt='bp-ia-logo' src='/assets/images/bp-ia-logo.png' />
      <Paper onSubmit={onSubmit} component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
        </Stack>
        <InputBase {...register('address')} disabled={isQueryImagePending} placeholder='Adresse à analysé' error={!!errors['address']} />
        <Stack>
          <IconButton loading={isQueryImagePending}>{errors['address'] ? <Error /> : <SearchIcon />}</IconButton>
        </Stack>
      </Paper>
      {(imageSrc || isQueryImagePending) && <AnnotatorSection imageSrc={imageSrc} />}
      <GlobalDialog />
    </Stack>
  );
}

export default App;
