import React from 'react';
import { Grid, TextField, Box, Typography } from '@mui/material';

interface BasicInfoSectionProps {
  formData: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Seção de Informações Básicas
 * - Somente campos: Nome, Telefone, Endereço, Data de Nascimento
 * - Não contém "Tratamento Anterior" ou "Cirurgias"
 */
const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleInputChange,
}) => {
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
        Informações Básicas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Data de Nascimento"
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            required
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoSection;
