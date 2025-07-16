import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const theme = createTheme({
  palette: {
    primary: { main: "#4a90e2" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
  },
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao fazer login: " + err.message);
      } else {
        setError("Erro desconhecido ao fazer login.");
      }
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
        <Paper elevation={3} sx={{ p: 4, width: 320, textAlign: "center" }}>
          <Typography variant="h5" mb={2}>
            Bem-vindo!
          </Typography>
          <Typography variant="body2" mb={2}>
            Por favor, faça login para continuar.
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" variant="body2" mb={2}>
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Entrar
            </Button>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate("/register")}
            >
              Criar nova conta
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
