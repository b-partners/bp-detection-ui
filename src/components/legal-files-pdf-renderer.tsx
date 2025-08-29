import { useDialog } from '@/hooks';
import { legalFilesProvider } from '@/providers';
import { LegalFile } from '@bpartners/typescript-client';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { MutationFunction, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import { LegalFileDialogStyle as style } from './style';

export const LegalFilesPdfRenderer = () => {
  const [currentLegalFile, setCurrentLegalFile] = useState<LegalFile>();
  const { close } = useDialog();
  const {
    data: legalFiles,
    refetch,
    isLoading: isQueryLegalFiles,
  } = useQuery({ queryKey: ['legalFiles', currentLegalFile], queryFn: legalFilesProvider.checkLegalFiles });

  const { mutate: acceptLegalFile, isPending: isAcceptLegalFilesPending } = useMutation({
    mutationKey: ['update-legal-files'],
    mutationFn: legalFilesProvider.acceptLegalFiles as MutationFunction<RefetchOptions | undefined, string>,
    onSuccess: () => {
      if (legalFiles && (legalFiles?.legalFiles?.length || 0) > 1) setCurrentLegalFile(legalFiles.legalFiles[1]);
      if (legalFiles && legalFiles?.legalFiles?.length === 1) {
        close();
        return;
      }
      refetch();
    },
  });

  useEffect(() => {
    if (legalFiles?.legalFiles?.[0]) setCurrentLegalFile(legalFiles?.legalFiles?.[0]);
  }, [legalFiles]);

  const handleAcceptCurrentLegalFiles = () => {
    acceptLegalFile(currentLegalFile?.id || '');
  };

  const [lastPage, setLastPage] = useState(0);
  const [page, setPage] = useState(1);
  const nextPage = () => setPage(e => (page < lastPage ? e + 1 : e));
  const prevPage = () => setPage(e => (page > 1 ? e - 1 : e));

  return (
    <>
      <DialogTitle>Conditions générales d'utilisation</DialogTitle>
      <DialogContent sx={style.dialogContent}>
        <Box>
          {!isQueryLegalFiles && legalFiles && legalFiles.legalFiles.length > 0 && (
            <Document onLoadSuccess={({ numPages }) => setLastPage(numPages)} renderMode='canvas' file={currentLegalFile?.fileUrl} loading={<></>}>
              <Page pageNumber={page} />
            </Document>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={style.dialogActions}>
        <Stack justifyContent='space-between' width='100%' direction='row'>
          <Button onClick={handleAcceptCurrentLegalFiles} loading={isAcceptLegalFilesPending}>
            Accepter
          </Button>
          <Stack direction='row' gap={2}>
            <Button disabled={page === 1 || isAcceptLegalFilesPending} onClick={prevPage} startIcon={<ChevronLeft />}>
              Précédent
            </Button>
            <Button disabled={page === lastPage || isAcceptLegalFilesPending} onClick={nextPage} endIcon={<ChevronRight />}>
              Suivant
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </>
  );
};
