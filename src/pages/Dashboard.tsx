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

// Firebase imports
import { db } from '../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';

interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
}

function getAvatarColor(letter: string): string {
  const palette = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
    '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#FFC107',
    '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B',
  ];
  if (!letter) return '#9E9E9E';
  const code = letter.toUpperCase().charCodeAt(0);
  const idx = (code - 65) % palette.length;
  return palette[idx] || '#9E9E9E';
}

function getInitialLetter(nome: string): string {
  return nome?.trim()?.charAt(0)?.toUpperCase() || '?';
}

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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Patient));
        setPatients(patientsList);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este paciente?')) {
      try {
        await deleteDoc(doc(db, 'patients', id));
        setPatients(patients.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting patient: ", error);
        alert("Falha ao excluir o paciente.");
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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

          {loading ? (
             <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Carregando pacientes...
            </Typography>
          ) : filteredPatients.length === 0 ? (
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
                    <Paper
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 64,
                        p: 1,
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ mr: 1 }}>
                        <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40, fontSize: 18 }}>
                          {initial}
                        </Avatar>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'medium',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {patient.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.dataNascimento}
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{ color: '#009688' }}
                        size="small"
                        onClick={() => navigate(`/patient-detail/${patient.id}`)}
                      >
                        <VisibilityRounded fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: '#ff9800' }}
                        size="small"
                        onClick={() => navigate(`/patient-form?edit=${patient.id}`)}
                      >
                        <EditRounded fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: '#e91e63' }}
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
