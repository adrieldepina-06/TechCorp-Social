import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao iniciar sessão.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/timeline');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px', width: '100%' }}>

        <div className="text-center mb-4">
          <h2 className="fw-bold text-info mb-1">TechCorp Social</h2>
          <p className="text-muted small">Find Your Community</p>
        </div>

        {error && (
          <div className="alert alert-danger p-2 text-center small fw-bold mb-3" role="alert">
            {error === 'Invalid email or password' ? 'Email ou Palavra-passe incorretos.' : error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-bold" style={{ fontSize: '13px' }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-secondary fw-bold mb-0" style={{ fontSize: '13px' }}>
                password
              </label>
              <a href="#" className="text-decoration-none small text-info">Forgot your password?</a>
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

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
            disabled={loading}
          >
            {loading ? 'Checking credentials...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            New to the platform? <Link to="/register" className="text-decoration-none text-info fw-bold">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;