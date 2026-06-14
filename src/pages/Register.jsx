import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao registar.');
      }

      // Limpa qualquer sessão antiga que tenha ficado esquecida no computador
      localStorage.clear();

      alert("Conta criada com sucesso! Por favor, inicie sessão.");
      navigate('/'); // Redireciona para o Login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="fw-bold text-center mb-3 text-primary">Criar Conta</h3>

        {error && <div className="alert alert-danger small py-2">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Nome Completo</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Email</label>
            <input
              type="email"
              className="form-control form-control-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Palavra-passe</label>
            <input
              type="password"
              className="form-control form-control-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold mb-2">
            Registar Hub
          </button>
        </form>
        <div className="text-center mt-2">
          <small className="text-muted">
            Já tem conta? <Link to="/" className="text-decoration-none fw-bold">Entrar</Link>
          </small>
        </div>
      </div>
    </div>
  );
} // <- Esta era a chaveta que faltava na linha 54!