import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainNavbar.css';

function logoutHandler() {
  // Exemplo de logout
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}

function GridNavBar() {
  const navigate = useNavigate();

  // Caso deseje um “usuário logado” ou similar
  const [username] = useState('Jane Doe');

  return (
    <header className="gridNav-bar">
      {/* Área esquerda: logo ou ícone */}
      <div className="gridNav-left">
        <Link to="/dashboard" className="gridNav-logo">
          Anamnese.Ai
        </Link>
      </div>

      {/* Área central: menu principal */}
      <nav className="gridNav-center">
        <Link to="/dashboard" className="gridNav-link">
        Lista de Pacientes
        </Link>
        <Link to="/patient-form" className="gridNav-link">
          Novo Paciente
        </Link>
        
        
      </nav>

      {/* Área direita: pode exibir usuário, etc. */}
      <div className="gridNav-right">
        <div className="gridNav-user">
        <button
          type="button"
          className="gridNav-button"
          onClick={logoutHandler}
        >
          Logout
        </button>
        </div>
      </div>
    </header>
  );
}

export default GridNavBar;
