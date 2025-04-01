import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  // Outros campos
}

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    secondary: { main: '#ff9800' },
    error: { main: '#f44336' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
});

function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(storedPatients);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este paciente?')) {
      const updated = patients.filter((p) => p.id !== id);
      localStorage.setItem('patients', JSON.stringify(updated));
      setPatients(updated);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          my: 3,
          p: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Título menor para a listagem de pacientes */}
        <Typography variant="h6" align="center" gutterBottom>
          Pacientes Cadastrados
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/patient-form')}>
            + Novo Paciente
          </Button>
        </Box>

        <Grid container spacing={2}>
          {patients.length === 0 ? (
            <Typography align="center" sx={{ width: '100%' }}>
              Nenhum paciente cadastrado.
            </Typography>
          ) : (
            patients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} key={patient.id}>
                <Paper
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {patient.nome}
                    </Typography>
                    <Typography variant="body2">
                      Nascimento: {patient.dataNascimento}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/patient-detail/${patient.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/patient-form?edit=${patient.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(patient.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
