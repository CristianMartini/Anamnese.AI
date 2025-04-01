import React from 'react';
import { Grid, TextField, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';

interface ResponsibilityTermSectionProps {
  formData: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Seção Termo de Responsabilidade
 */
const ResponsibilityTermSection: React.FC<ResponsibilityTermSectionProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange
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
        Termo de Responsabilidade
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            name="termoResponsabilidade"
            checked={formData.termoResponsabilidade}
            onChange={handleCheckboxChange}
            sx={{ color: '#4a90e2', '&.Mui-checked': { color: '#4a90e2' } }}
          />
        }
        label="Estou ciente e de acordo com todas as informações acima relacionadas."
        sx={{ mb: 2 }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Profissional Responsável (Assinatura)"
            name="assinaturaProfissional"
            value={formData.assinaturaProfissional}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Assinatura do Cliente"
            name="assinaturaCliente"
            value={formData.assinaturaCliente}
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

export default ResponsibilityTermSection;
