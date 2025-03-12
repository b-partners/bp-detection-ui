import { useDialog } from '@/hooks';
import { Info } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField, Tooltip, Typography } from '@mui/material';

export const DetectionForm = () => {
  const { close: closeDialog } = useDialog();

  return (
    <>
      <DialogTitle>
        <Typography>Veuillez renseigner les informations suivantes</Typography>
        <Tooltip title="Seule l'adresse email est obligatoire pour que vous puissiez recevoir les résulta de l'analyse de votre toiture.">
          <Info />
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Stack component='form'>
          <TextField type='text' name='lastName' label='Nom' />
          <TextField type='text' name='firstName' label='Prénoms' />
          <TextField type='tel' name='phone' label='Numéro de téléphone' />
          <TextField
            title="L'adresse est obligatoire pour que vous puissiez recevoir les résultats par email"
            type='email'
            name='email'
            label='Adresse Email'
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Annuler</Button>
        <Button>Valider</Button>
      </DialogActions>
    </>
  );
};
