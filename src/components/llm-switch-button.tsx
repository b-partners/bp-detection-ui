import { Cached } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC } from 'react';
import { llmButtonStyle } from './style';

interface Props {
  showLlm: boolean;
  onClick: () => void;
}

export const LlmSwitchButton: FC<Props> = ({ onClick, showLlm }) => {
  return (
    <Button sx={llmButtonStyle} startIcon={<Cached />} onClick={onClick}>
      {showLlm ? "Revenir à l'ecran d'annotation" : 'Comprendre votre rapport'}
    </Button>
  );
};
