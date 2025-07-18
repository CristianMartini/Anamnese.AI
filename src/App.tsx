import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout";
import RequireAdmin from "./components/RequireAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientForm from "./pages/PatientForm";
import PatientDetail from "./pages/PatientDetail";
import PrintPreview from "./pages/PrintPreview";
import AdminPanel from "./pages/AdminPanel";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

function RequireAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patient-form" element={<PatientForm />} />
            <Route path="patient-detail/:id" element={<PatientDetail />} />
            <Route path="print-preview" element={<PrintPreview />} />
            <Route element={<RequireAdmin />}>
              <Route path="admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Route>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
