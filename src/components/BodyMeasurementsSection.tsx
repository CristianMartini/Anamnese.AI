import React from 'react';
import { Grid, TextField, Typography, Box } from '@mui/material';

export interface BodyMeasurements {
  peso: string;
  altura: string;
  busto: string;
  cintura: string;
  quadril: string;
  bracoDireito: string;
  bracoEsquerdo: string;
  pernaDireita: string;
  pernaEsquerda: string;
  culote: string;
  flancoDireito: string;
  flancoEsquerdo: string;
  panturrilhaDireita: string;
  panturrilhaEsquerda: string;
}

interface BodyMeasurementsSectionProps {
  measurements: BodyMeasurements;
  onChange: (field: keyof BodyMeasurements, value: string) => void;
}

/**
 * Seção de Medidas Corporais
 * Usada dentro do histórico de sessões (SessionHistory) para cada sessão.
 */
const BodyMeasurementsSection: React.FC<BodyMeasurementsSectionProps> = ({
  measurements,
  onChange
}) => {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

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
        Medidas Corporais
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Peso (kg)"
            type="number"
            fullWidth
            value={measurements.peso}
            onChange={(event) => onChange('peso', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Altura (cm)"
            type="number"
            fullWidth
            value={measurements.altura}
            onChange={(event) => onChange('altura', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Busto (cm)"
            type="number"
            fullWidth
            value={measurements.busto}
            onChange={(event) => onChange('busto', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Cintura (cm)"
            type="number"
            fullWidth
            value={measurements.cintura}
            onChange={(event) => onChange('cintura', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Quadril (cm)"
            type="number"
            fullWidth
            value={measurements.quadril}
            onChange={(event) => onChange('quadril', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Braço Direito (cm)"
            type="number"
            fullWidth
            value={measurements.bracoDireito}
            onChange={(event) => onChange('bracoDireito', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Braço Esquerdo (cm)"
            type="number"
            fullWidth
            value={measurements.bracoEsquerdo}
            onChange={(event) => onChange('bracoEsquerdo', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Perna Direita (cm)"
            type="number"
            fullWidth
            value={measurements.pernaDireita}
            onChange={(event) => onChange('pernaDireita', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Perna Esquerda (cm)"
            type="number"
            fullWidth
            value={measurements.pernaEsquerda}
            onChange={(event) => onChange('pernaEsquerda', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Culote (cm)"
            type="number"
            fullWidth
            value={measurements.culote}
            onChange={(event) => onChange('culote', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Flanco Direito (cm)"
            type="number"
            fullWidth
            value={measurements.flancoDireito}
            onChange={(event) => onChange('flancoDireito', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Flanco Esquerdo (cm)"
            type="number"
            fullWidth
            value={measurements.flancoEsquerdo}
            onChange={(event) => onChange('flancoEsquerdo', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Panturrilha Direita (cm)"
            type="number"
            fullWidth
            value={measurements.panturrilhaDireita}
            onChange={(event) => onChange('panturrilhaDireita', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Panturrilha Esquerda (cm)"
            type="number"
            fullWidth
            value={measurements.panturrilhaEsquerda}
            onChange={(event) => onChange('panturrilhaEsquerda', event.target.value)}
            variant="outlined"
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BodyMeasurementsSection;
