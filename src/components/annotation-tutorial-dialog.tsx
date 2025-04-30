import { useDialog, useWindodwsSize } from '@/hooks';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import close_annotation_tutorial from '/assets/images/close-annotation-tutorial.webp';
import tutorial from '/assets/videos/annotation-tutorial.webm';

export const AnnotationTutorialDialog = () => {
  const { close } = useDialog();
  const { height } = useWindodwsSize();

  return (
    <>
      <DialogTitle>Comment annoter sa toiture ?</DialogTitle>
      <DialogContent sx={{ maxHeight: height * 0.7 }} className='scrollbar'>
        <video autoPlay controls width={600} height={600} src={tutorial} />
        <Stack width={600} mt={2}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Comment finaliser l'annotation ?</AccordionSummary>
            <AccordionDetails>
              Placez le pointeur de votre souris sur le premier point que vous avez positionné. Le pointeur se transformera en un cercle, et vous pourrez
              cliquer pour terminer l'annotation.
              <img style={{ objectFit: 'cover', width: '100%' }} src={close_annotation_tutorial} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Fermer</Button>
      </DialogActions>
    </>
  );
};
