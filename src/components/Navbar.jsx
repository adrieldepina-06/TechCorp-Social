import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container" style={{ maxWidth: '1140px' }}>

        {/* Atualizado para /timeline */}
        <Link className="navbar-brand fw-bold text-info" to="/timeline">
          TechCorp Social
        </Link>

        <div className="ms-auto d-flex align-items-center gap-3">

          {/* Atualizado para /timeline */}
          <NavLink
            to="/timeline"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold border-bottom' : 'opacity-75'}`}
          >
            Feed
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold border-bottom' : 'opacity-75'}`}
          >
            O Meu Perfil
          </NavLink>

          <NavLink
            to="/comunidade"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold border-bottom' : 'opacity-75'}`}
          >
            Comunidade
          </NavLink>

          <button className="btn btn-sm btn-secondary fw-bold px-3 ms-2" disabled>
            Utilizador de Teste
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;