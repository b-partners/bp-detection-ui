import { AnnotatorSection, GlobalDialog } from '@/components';
import { useQueryImageFromAddress } from '@/queries';
import { MainStyle as style } from '@/style';
import { scrollToBottom } from '@/utilities';
import { LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import { FormEvent } from 'react';
import './App.css';

function App() {
  const { imageSrc, isQueryImagePending, queryImage } = useQueryImageFromAddress();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    queryImage(undefined, { onSuccess: scrollToBottom });
  };

  return (
    <Stack sx={style}>
      <img alt='bp-ia-logo' src='/assets/images/bp-ia-logo.png' />
      <Paper onSubmit={handleSubmit} component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
        </Stack>
        <InputBase disabled={isQueryImagePending} placeholder='Adresse à analysé' />
        <Stack>
          <IconButton loading={isQueryImagePending}>
            <SearchIcon />
          </IconButton>
        </Stack>
      </Paper>
      {(imageSrc || isQueryImagePending) && <AnnotatorSection imageSrc={imageSrc} />}
      <GlobalDialog />
    </Stack>
  );
}

export default App;
