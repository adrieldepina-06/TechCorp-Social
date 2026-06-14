import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Leitura segura do utilizador para evitar crash caso não exista sessão
  const obterUtilizadorSeguro = () => {
    try {
      const userRaw = localStorage.getItem('user');
      return userRaw ? JSON.parse(userRaw) : null;
    } catch (err) {
      console.error("Erro ao ler utilizador do localStorage", err);
      return null;
    }
  };

  const usuarioLogado = obterUtilizadorSeguro();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Se o utilizador não estiver logado, ou estiver no Login/Registo, a Navbar não aparece
  if (!usuarioLogado || location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm py-2 sticky-top">
      <div className="container" style={{ maxWidth: '1140px' }}>

        {/* Logótipo com a cor text-info original */}
        <Link className="navbar-brand fw-bold text-primary fs-5" to="/timeline">
          TechCorp
        </Link>

        {/* Botão Hamburger para ecrãs pequenos (Telemóvel) */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de Navegação com deteção de página ativa */}
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-md-0 mt-2 mt-md-0">
            <li className="nav-item">
              <Link
                className={`nav-link fw-bold small ${location.pathname === '/timeline' ? 'text-info active' : 'text-light opacity-75'}`}
                to="/timeline"
              >
                Feed
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-bold small ${location.pathname === '/comunidade' ? 'text-info active' : 'text-light opacity-75'}`}
                to="/comunidade"
              >
                Comunidade
              </Link>
            </li>
          </ul>

          {/* Lado Direito: O teu botão Dropdown Customizado */}
          <div className="dropdown pt-2 pt-md-0">
            <button
              className="btn d-flex align-items-center bg-secondary bg-opacity-25 border border-secondary border-opacity-25 text-white dropdown-toggle rounded px-3 py-1.5 small fw-bold"
              type="button"
              id="userMenuDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ letterSpacing: '0.3px' }}
            >
              Olá, {usuarioLogado.name?.split(' ')[0]}
            </button>

            {/* bg-white + shadow-lg faz o menu destacar-se totalmente das páginas brancas abaixo */}
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border border-light-subtle mt-2 bg-white" aria-labelledby="userMenuDropdown">
              <li>
                {/* Sem classes de cor forçadas no texto para o efeito de hover funcionar perfeitamente */}
                <Link className="dropdown-item py-2 fw-medium text-dark" to="/profile" style={{ fontSize: '14px' }}>
                  Meu Perfil
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider opacity-25" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger fw-bold py-2"
                  onClick={handleLogout}
                  style={{ fontSize: '14px' }}
                >
                  Terminar Sessão
                </button>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </nav>
  );
}