import { Cached } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC } from 'react';
import { llmButtonStyle } from './style';

interface Props {
  showLlm: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const LlmSwitchButton: FC<Props> = ({ onClick, showLlm, disabled = false }) => {
  return (
    <Button disabled={disabled} data-cy='toggle-llm-result-view' sx={llmButtonStyle} startIcon={<Cached />} onClick={onClick}>
      {showLlm ? "Revenir à l’écran d'annotation" : 'Comprendre votre rapport'}
    </Button>
  );
};
