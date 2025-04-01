// SessionDataSection.tsx
import React from 'react';
import { Grid, TextField, Box, Typography } from '@mui/material';

interface SessionDataSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SessionDataSection: React.FC<SessionDataSectionProps> = ({ formData, handleInputChange }) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        p: 3,
        mt: 4,
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Dados da Sessão
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Observações Gerais"
            name="observacoesGerais"
            value={formData.observacoesGerais}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Data da Sessão"
            type="date"
            name="dataSessao"
            value={formData.dataSessao}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Relatório da Sessão"
            name="relatorioSessao"
            value={formData.relatorioSessao}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Altura (cm)"
            type="number"
            name="altura"
            value={formData.altura}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Peso (kg)"
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDataSection;