import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  TextField,
  Collapse,
  Radio as MaterialRadio,
  Grid,
} from '@mui/material';

interface Question {
  label: string;
  name: string;
  requiresObservation?: boolean;
}

interface YesNoQuestionGroupProps {
  questions: Question[];
  formData: Record<string, any>;
  onChange: (name: string, value: string) => void;
}

/**
 * Componente genérico para mostrar perguntas Sim/Não
 * com possível campo de observação quando a resposta é "Sim"
 */
const YesNoQuestionGroup: React.FC<YesNoQuestionGroupProps> = ({
  questions,
  formData,
  onChange,
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        p: 3,
        mt: 2,
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid container spacing={2}>
        {questions.map((questionObject) => {
          const currentValue = formData[questionObject.name] || 'Não';
          const observationValue = formData[`${questionObject.name}Observacao`] || '';

          return (
            <Grid item xs={12} sm={6} md={3} key={questionObject.name}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel sx={{ fontSize: '0.95rem', color: '#333', mb: 1 }}>
                  {questionObject.label}
                </FormLabel>
                <RadioGroup
                  row
                  name={questionObject.name}
                  value={currentValue}
                  onChange={(event) => onChange(questionObject.name, event.target.value)}
                >
                  <FormControlLabel value="Sim" control={<MaterialRadio />} label="Sim" />
                  <FormControlLabel value="Não" control={<MaterialRadio />} label="Não" />
                </RadioGroup>
              </FormControl>

              {questionObject.requiresObservation && (
                <Collapse in={currentValue === 'Sim'} timeout={300} unmountOnExit>
                  <TextField
                    label="Observação"
                    name={`${questionObject.name}Observacao`}
                    value={observationValue}
                    onChange={(event) => onChange(`${questionObject.name}Observacao`, event.target.value)}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    sx={{ mt: 1, backgroundColor: '#f9f9f9' }}
                  />
                </Collapse>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default YesNoQuestionGroup;
