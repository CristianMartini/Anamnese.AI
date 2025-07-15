import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Delete, Refresh } from "@mui/icons-material";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: { main: "#4a90e2" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
  },
});

interface UserData {
  uid: string;
  email: string;
  role: string;
}

function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<UserData | null>(null);

  // Função para buscar usuários cadastrados (Firestore, não Auth)
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const db = getFirestore();
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const usersList: UserData[] = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...(doc.data() as Omit<UserData, "uid">),
      }));
      setUsers(usersList);
    } catch {
      setError("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cadastro de novo usuário
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const db = getFirestore();
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "user",
      });
      setSuccess("Usuário cadastrado com sucesso!");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao cadastrar usuário: " + err.message);
      } else {
        setError("Erro ao cadastrar usuário.");
      }
    }
  };

  // Redefinir senha (envia email de reset)
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess("Email de redefinição enviado!");
      setResetDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao enviar email de redefinição: " + err.message);
      } else {
        setError("Erro ao enviar email de redefinição.");
      }
    }
  };

  // Remover usuário
  const handleRemoveUser = async () => {
    if (!removeUser) return;
    setError("");
    setSuccess("");
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "users", removeUser.uid));
      setSuccess("Usuário removido com sucesso!");
      setRemoveDialogOpen(false);
      setRemoveUser(null);
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao remover usuário: " + err.message);
      } else {
        setError("Erro ao remover usuário.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f7f8fa"
        py={4}
      >
        <Paper sx={{ p: 4, width: 400, mb: 4 }}>
          <Typography variant="h5" mb={2} align="center">
            Administração de Usuários
          </Typography>
          <form onSubmit={handleAddUser}>
            <TextField
              label="Email do novo usuário"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Add />}
            >
              Cadastrar Usuário
            </Button>
          </form>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" mt={2}>
              {success}
            </Typography>
          )}
        </Paper>
        <Paper sx={{ p: 4, width: 400 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6">Usuários Cadastrados</Typography>
            <IconButton onClick={fetchUsers} title="Atualizar lista">
              <Refresh />
            </IconButton>
          </Box>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={100}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {users.map((user) => (
                <ListItem
                  key={user.uid}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        title="Redefinir senha"
                        onClick={() => {
                          setResetEmail(user.email);
                          setResetDialogOpen(true);
                        }}
                      >
                        <Refresh />
                      </IconButton>
                      <IconButton
                        edge="end"
                        color="error"
                        title="Remover usuário"
                        onClick={() => {
                          setRemoveUser(user);
                          setRemoveDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={user.email}
                    secondary={
                      user.role === "admin" ? "Administrador" : "Usuário"
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
        {/* Dialog para redefinir senha */}
        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
        >
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogContent>
            <Typography>
              Enviar email de redefinição para: <b>{resetEmail}</b>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleResetPassword} color="primary">
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para remover usuário */}
        <Dialog
          open={removeDialogOpen}
          onClose={() => setRemoveDialogOpen(false)}
        >
          <DialogTitle>Remover usuário</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja remover o usuário{" "}
              <b>{removeUser?.email}</b>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoveDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleRemoveUser} color="error">
              Remover
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default AdminPanel;
