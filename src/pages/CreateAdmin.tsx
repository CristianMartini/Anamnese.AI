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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: { main: "#4a90e2" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
  },
});

function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    const auth = getAuth();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Salva flag no Firestore indicando que o admin foi criado
      await setDoc(doc(db, "config", "admin"), {
        adminCreated: true,
        adminUid: userCredential.user.uid,
      });
      setSuccess(
        "Administrador criado com sucesso! Redirecionando para login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao criar administrador: " + err.message);
      } else {
        setError("Erro desconhecido ao criar administrador.");
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
        <Paper elevation={3} sx={{ p: 4, width: 340, textAlign: "center" }}>
          <Typography variant="h5" mb={2}>
            Criar Administrador
          </Typography>
          <Typography variant="body2" mb={2}>
            Este será o único usuário com permissão para cadastrar outros
            usuários.
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
            <TextField
              label="Confirmar Senha"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" variant="body2" mb={2}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="primary" variant="body2" mb={2}>
                {success}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Criar Administrador
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default CreateAdmin;
