import { legalFilesProvider } from '@/providers';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import { LegalFileDialogStyle as style } from './style';

export const LegalFilesPdfRenderer = () => {
  const { data: legalFiles } = useQuery({ queryKey: ['legalFiles'], queryFn: legalFilesProvider.checkLegalFiles });
  const [lastPage, setLastPage] = useState(0);
  const [page, setPage] = useState(1);
  const nextPage = () => setPage(e => (page < lastPage ? e + 1 : e));
  const prevPage = () => setPage(e => (page > 1 ? e - 1 : e));

  return (
    <>
      <DialogTitle>Conditions générales d'utilisation</DialogTitle>
      <DialogContent sx={style.dialogContent}>
        <Box>
          {legalFiles && legalFiles.legalFiles.length > 0 && (
            <Document onLoadSuccess={({ numPages }) => setLastPage(numPages)} renderMode='canvas' file={legalFiles?.legalFiles?.[0]?.fileUrl} loading={<></>}>
              <Page pageNumber={page} />
            </Document>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={style.dialogActions}>
        <Stack justifyContent='space-between' width='100%' direction='row'>
          <Button>Accepter</Button>
          <Stack direction='row' gap={2}>
            <Button disabled={page === 1} onClick={prevPage} startIcon={<ChevronLeft />}>
              Précédent
            </Button>
            <Button disabled={page === lastPage} onClick={nextPage} endIcon={<ChevronRight />}>
              Suivant
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </>
  );
};
