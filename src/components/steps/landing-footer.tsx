import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Box, Stack, Typography } from '@mui/material';

const FrenchFlag = () => (
  <span className='fr-flag'>
    <span className='fr-blue' />
    <span className='fr-white' />
    <span className='fr-red' />
  </span>
);

export const LandingFooter = () => {
  return (
    <Box className='landing-footer'>
      <Stack direction='row' className='trust'>
        <Box className='trust-item'>
          <GppGoodOutlinedIcon />
          Conforme RGPD
        </Box>
        <Box className='trust-item'>
          <HttpsOutlinedIcon />
          Chiffrement SSL
        </Box>
        <Box className='trust-item'>
          <PublicOutlinedIcon />
          IA aérienne BIRDIA
        </Box>
        <Box className='trust-item'>
          <FrenchFlag />
          <span>
            <strong>IA 100 % française</strong> · issue de la recherche
          </span>
        </Box>
      </Stack>

      <Box className='foot' component='footer'>
        <Typography className='legal'>
          Service fourni par <a href='https://www.birdia.fr'>BIRDIA</a> · <a href='#'>Mentions légales</a> · <a href='#'>Politique de confidentialité</a>
        </Typography>
      </Box>
    </Box>
  );
};
