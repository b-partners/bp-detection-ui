import { LocationOn as LocationOnIcon, Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import './App.css';
import { MainStyle as style } from './style';

function App() {
  return (
    <Stack sx={style}>
      <img alt='bp-ia-logo' src='/assets/images/bp-ia-logo.png' />
      <Paper component='form' className='location-input' elevation={1}>
        <Stack>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
        </Stack>
        <InputBase placeholder='Adresse à analysé' />
        <Stack>
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default App;
