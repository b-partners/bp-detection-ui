import { useDialog } from '@/hooks';
import { Info } from '@mui/icons-material';
import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { DetectionForm } from './detection-form';
import { DetectionFormStyle, QcmDialogStyle } from './style';

interface QcmQuestion {
  label: string;
  options: string[];
}

const QCM_QUESTIONS: QcmQuestion[] = [
  {
    label: 'Quel est l’objectif de votre demande ?',
    options: ['Demander une intervention urgente', 'Entretien / réparation préventive', 'Diagnostic avant vente immobilière', 'Demande de devis'],
  },
  {
    label: 'À quand remonte votre dernier entretien ?',
    options: ['Moins de 3 ans', 'Moins de 10 ans', 'Jamais entretenu'],
  },
];

/**
 * Builds the prospect comment that is saved alongside the created prospect,
 * keeping only the answers the user selected.
 */
const buildComment = (answers: string[]) => answers.join('\n');

interface QcmFormProps {
  address: string;
}

export const QcmForm: FC<QcmFormProps> = ({ address }) => {
  const { open: openDialog, close: closeDialog } = useDialog();
  const [answers, setAnswers] = useState<string[]>(Array(QCM_QUESTIONS.length).fill(''));

  const isComplete = answers.every(Boolean);

  const handleSelect = (questionIndex: number) => (_: unknown, value: string) => {
    setAnswers(prev => prev.map((answer, index) => (index === questionIndex ? value : answer)));
  };

  const handleContinue = () => {
    if (!isComplete) return;
    openDialog(<DetectionForm address={address} comment={buildComment(answers)} onBack={handleBack} />, { style: DetectionFormStyle });
  };

  const handleBack = () => openDialog(<QcmForm address={address} />, { style: QcmDialogStyle });

  return (
    <Box sx={QcmDialogStyle}>
      <DialogTitle>
        <Stack width='100%' direction='row' justifyContent='space-between' alignItems='flex-start' gap={2}>
          <Stack>
            <Typography className='dialog-eyebrow'>Avant de commencer</Typography>
            <Typography className='dialog-title'>Quelques infos pour mieux vous orienter</Typography>
            <Typography className='dialog-subtitle'>2 questions rapides pour que votre couvreur prépare la meilleure réponse possible.</Typography>
          </Stack>
          <Box className='dialog-info'>
            <Info />
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {QCM_QUESTIONS.map((question, questionIndex) => (
          <Box key={question.label}>
            <Box className='qcm-question'>
              <Box className='qcm-badge'>{questionIndex + 1}</Box>
              <Typography className='qcm-question-label'>{question.label}</Typography>
            </Box>
            <RadioGroup className='qcm-options' value={answers[questionIndex]} onChange={handleSelect(questionIndex)}>
              {question.options.map(option => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  className={answers[questionIndex] === option ? 'qcm-option qcm-option-selected' : 'qcm-option'}
                />
              ))}
            </RadioGroup>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Annuler</Button>
        <Button variant='contained' disabled={!isComplete} onClick={handleContinue} data-cy='qcm-continue-button'>
          Continuer
        </Button>
      </DialogActions>
    </Box>
  );
};
