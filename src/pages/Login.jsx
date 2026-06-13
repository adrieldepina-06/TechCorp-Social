import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // 1. Estados para controlar os inputs, erros e carregamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 2. Faz o pedido HTTP POST para o teu backend na porta 5000
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o status for 400 ou 401, apanha a mensagem de erro do teu colega
        throw new Error(data.message || 'Falha ao iniciar sessão.');
      }

      // 3. SE CORREU BEM: Guarda o Token e os dados do Utilizador no LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 4. Salta para a Cronologia
      navigate('/timeline');
    } catch (err) {
      // Exibe o erro ("Invalid email or password", etc.) no ecrã
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>

        {/* Logótipo / Cabeçalho */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-info mb-1">TechCorp Social</h2>
          <p className="text-muted small">Entre para colaborar com a sua equipa</p>
        </div>

        {/* Alerta de Erro Dinâmico */}
        {error && (
          <div className="alert alert-danger p-2 text-center small fw-bold mb-3" role="alert">
            {error === 'Invalid email or password' ? 'Email ou Palavra-passe incorretos.' : error}
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Botão de Submissão Dinâmico */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
            disabled={loading}
          >
            {loading ? 'A verificar credenciais...' : 'Iniciar Sessão'}
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