import { useDialog, useWindowsSize } from '@/hooks';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import close_annotation_tutorial from '/assets/images/close-annotation-tutorial.webp';
import extend_image_illustration from '/assets/images/extend-image-illustration.png';
import refresh_image_illustration from '/assets/images/refresh-image-illustration.png';
import tutorial from '/assets/videos/annotation-tutorial.webm';

export const AnnotationTutorialDialog = () => {
  const { close } = useDialog();
  const { height, width } = useWindowsSize();
  const isNotMobile = useMediaQuery(theme => theme.breakpoints.up('md'));

  const defaultWidth = isNotMobile ? 600 : width * 0.85;

  return (
    <>
      <DialogTitle>Comment annoter sa toiture ?</DialogTitle>
      <DialogContent
        sx={{ maxHeight: isNotMobile ? height * 0.7 : '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column' }}
        className='scrollbar'
      >
        <video autoPlay controls width={defaultWidth} height={defaultWidth} src={tutorial} />
        <Stack width={defaultWidth} mt={2}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Que faire si le toit ne s'affiche pas totalement ?</AccordionSummary>
            <AccordionDetails>
              <Typography>Si votre toit ne s'affiche pas totalement, vous pouvez élargir la zone en cliquant sur le bouton Élargir la zone</Typography>
              <img style={{ objectFit: 'cover', width: '100%' }} src={extend_image_illustration} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Que faire si l'image reçue ne correspond pas à l'adresse que vous avez demandée ?
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Si l'image reçue ne correspond pas à l'adresse que vous avez demandée, cliquez sur le bouton Actualiser l’image pour obtenir une image
                correspondant à votre adresse.
              </Typography>
              <img style={{ objectFit: 'cover', width: '100%' }} src={refresh_image_illustration} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Comment finaliser l'annotation ?</AccordionSummary>
            <AccordionDetails>
              <Typography>
                Placez le pointeur de votre souris sur le premier point que vous avez positionné. Le pointeur se transformera en un cercle, et vous pourrez
                cliquer pour terminer l'annotation.
              </Typography>
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
