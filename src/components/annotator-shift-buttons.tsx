import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FC } from 'react';

interface AnnotatorShiftButtonsProps {
  prevXShift: () => void;
  nextXShift: () => void;
}

export const AnnotatorShiftButtons: FC<AnnotatorShiftButtonsProps> = ({ prevXShift, nextXShift }) => {
  return (
    <>
      <IconButton onClick={prevXShift}>
        <ChevronLeft />
      </IconButton>
      <IconButton>
        <ChevronRight onClick={nextXShift} />
      </IconButton>
    </>
  );
};
