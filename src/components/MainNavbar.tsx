import { Link, useNavigate } from 'react-router-dom';
import './MainNavBar.css';

function logoutHandler() {
  // Remova tokens ou faça sua lógica de logout
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}

function MainNavBar() {
  const navigate = useNavigate();

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        {/* Logo ou Nome da Aplicação */}
        <Link to="/dashboard" className="nav-logo">
          MinhaAplicacao
        </Link>
      </div>

      <div className="nav-right">
        {/* BOTÃO: Dashboard */}
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        {/* BOTÃO: Novo Paciente */}
        <Link to="/patient-form" className="nav-link">
          Novo Paciente
        </Link>

        {/* BOTÃO: Impressão */}
        <button
          type="button"
          className="nav-button"
          onClick={() => navigate('/print-preview')}
        >
          Impressão
        </button>

        {/* BOTÃO: Logout */}
        <button
          type="button"
          className="nav-button"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default MainNavBar;
