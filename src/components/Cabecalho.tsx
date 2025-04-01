import './Cabecalho.css'; // importa o CSS externo

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Pode ajustar o texto se desejar */}
        <h1 className="anamnese-title">FICHA DE ANAMNESE</h1>
      </div>
      <div className="nav-right">
        {/* Linha de cima */}
        <div className="clinica-bloco">
          <span className="clinica-nome">Clínica Cláudia Costa</span>
          <span className="clinica-sub">Estética Avançada</span>
        </div>
        {/* Linha de baixo */}
        <div className="profissional-bloco">
          <span className="profissional-nome">Diuly Ferraz</span>
          <span className="profissional-sub">Enfermeira Massoterapeuta</span>
        </div>
      </div>
    </nav>
  );
}
