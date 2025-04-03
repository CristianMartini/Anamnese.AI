import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Importar as páginas que deseja no seu projeto
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas que exigem a Navbar principal */}
        <Route path="/" element={<Layout />}>
          {/* Coloque as rotas “filhas” dentro de Layout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patient-form" element={<PatientForm />} />
          <Route path="patient-detail/:id" element={<PatientDetail />} />
         
          {/* Você pode adicionar quantas rotas quiser aqui */}
        </Route>

        {/* Exemplo de rota que não tem Navbar (como login) */}
        <Route path="/login" element={<Login />} />

        {/* Caso queira uma rota “fallback” */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
