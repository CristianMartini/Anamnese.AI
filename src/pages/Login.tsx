import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  createTheme
} from '@mui/material';
import './Login.css'; // Se quiser manter parte do estilo

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
});

function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === '123456') {
      navigate('/dashboard');
    } else {
      alert('Senha incorreta!');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f7f8fa"
      >
        <Paper elevation={3} sx={{ p: 4, width: 320, textAlign: 'center' }}>
          <Typography variant="h5" mb={2}>
            Bem-vindo!
          </Typography>
          <Typography variant="body2" mb={2}>
            Por favor, faça login para continuar.
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Entrar
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
