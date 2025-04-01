import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  createTheme,
  ThemeProvider,
} from '@mui/material';

/* Ícones “Rounded” com cores mais modernas */
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';

/* Interface de Paciente */
interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  // Outros campos se quiser
}

/**
 * Gera uma cor baseada na inicial do nome.
 * Você pode alterar a paleta abaixo conforme preferir.
 */
function getAvatarColor(letter: string): string {
  const palette = [
    '#F44336', // red
    '#E91E63', // pink
    '#9C27B0', // purple
    '#673AB7', // deep purple
    '#3F51B5', // indigo
    '#2196F3', // blue
    '#03A9F4', // light blue
    '#00BCD4', // cyan
    '#009688', // teal
    '#4CAF50', // green
    '#8BC34A', // light green
    '#FFC107', // amber
    '#FF9800', // orange
    '#FF5722', // deep orange
    '#795548', // brown
    '#9E9E9E', // gray
    '#607D8B', // blue gray
  ];

  if (!letter) return '#9E9E9E'; // fallback
  // Letra maiúscula
  const upper = letter.toUpperCase();
  // Converte para código ASCII (A=65, B=66, ... Z=90)
  const code = upper.charCodeAt(0);
  // Normaliza em 0..25
  const idx = (code - 65) % palette.length;
  // Se sair negativo ou fora, ajusta
  if (idx < 0 || idx >= palette.length) return '#9E9E9E';

  return palette[idx];
}

/** Retorna a primeira letra do nome. */
function getInitialLetter(nome: string): string {
  return nome?.trim()?.charAt(0)?.toUpperCase() || '?';
}

/** Tema do Material UI */
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },    
    secondary: { main: '#ff9800' },
    error: { main: '#e91e63' },     
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 15, 
  },
});

function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  /** Carrega pacientes do localStorage */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(stored);
  }, []);

  /** Deletar paciente */
  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este paciente?')) {
      const updated = patients.filter((p) => p.id !== id);
      localStorage.setItem('patients', JSON.stringify(updated));
      setPatients(updated);
    }
  };

  /** Campo de busca */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  /** Lista filtrada */
  const filteredPatients = patients.filter((p) =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Paper
          variant="outlined"
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: { xs: 2, md: 3 },
            borderRadius: 2,
          }}
        >
          {/* Cabeçalho e botão de novo paciente */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Lista de Pacientes
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddRounded />}
              onClick={() => navigate('/patient-form')}
            >
              Novo Paciente
            </Button>
          </Box>

          {/* Campo de Busca */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <SearchRounded color="disabled" />
            <TextField
              variant="outlined"
              size="small"
              label="Buscar pelo nome"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ flex: 1, maxWidth: 300 }}
            />
          </Box>

          {/* Se não há pacientes filtrados, mostra mensagem */}
          {filteredPatients.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Nenhum paciente encontrado.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredPatients.map((patient) => {
                const initial = getInitialLetter(patient.nome);
                const avatarColor = getAvatarColor(initial);

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
                    {/* Card de uma única linha */}
                    <Paper
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 64,
                        p: 1,
                        borderRadius: 2,
                        overflow: 'hidden', // garante que nada transborde
                      }}
                    >
                      {/* Avatar */}
                      <Box sx={{ mr: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: avatarColor,
                            width: 40,
                            height: 40,
                            fontSize: 18,
                          }}
                        >
                          {initial}
                        </Avatar>
                      </Box>

                      {/* Nome + data (com truncamento) */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0, 
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Nome do paciente, truncado se muito grande */}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'medium',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                          }}
                        >
                          {patient.nome}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                          }}
                        >
                          {patient.dataNascimento}
                        </Typography>
                      </Box>

                      {/* Ícones de ação */}
                      <IconButton
                        sx={{ color: '#009688' }} // teal
                        size="small"
                        onClick={() => navigate(`/patient-detail/${patient.id}`)}
                      >
                        <VisibilityRounded fontSize="small" />
                      </IconButton>

                      <IconButton
                        sx={{ color: '#ff9800' }} // laranja
                        size="small"
                        onClick={() => navigate(`/patient-form?edit=${patient.id}`)}
                      >
                        <EditRounded fontSize="small" />
                      </IconButton>

                      <IconButton
                        sx={{ color: '#e91e63' }} // rosa
                        size="small"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <DeleteRounded fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
