import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui no futuro validamos o email/senha. Por agora, saltamos direto para o feed!
    navigate('/timeline');
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>

        {/* Logótipo / Cabeçalho */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-info mb-1">TechCorp Social</h2>
          <p className="text-muted small">Entre para colaborar com a sua equipa</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-bold" style={{ fontSize: '13px' }}>
              Endereço de Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="nome@techcorp.local"
              required
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-secondary fw-bold mb-0" style={{ fontSize: '13px' }}>
                Palavra-passe
              </label>
              <a href="#" className="text-decoration-none small text-info">Esqueceu-se?</a>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botão de Submissão */}
          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
            Iniciar Sessão
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Novo na plataforma? <a href="#" className="text-decoration-none text-info fw-bold">Criar conta</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;