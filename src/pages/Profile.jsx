import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [statusConexao, setStatusConexao] = useState('none');
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaVisibilidade, setNovaVisibilidade] = useState('public');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuarioLogado = JSON.parse(localStorage.getItem('user')) || {};
  const isOwnProfile = !id || id === String(usuarioLogado.id);

  const carregarDadosDoPerfil = async () => {
    if (!token) { navigate('/'); return; }
    try {
      const urlUser = isOwnProfile ? 'http://localhost:5000/api/users/me' : `http://localhost:5000/api/users/${id}`;
      const resUser = await fetch(urlUser, { headers: { 'Authorization': `Bearer ${token}` } });
      const dataUser = await resUser.json();

      setPerfil(dataUser);
      setNovoNome(dataUser.name);
      setNovaVisibilidade(dataUser.profile_visibility || 'public');

      let currentStatus = 'none';
      if (!isOwnProfile) {
        const [resFriends, resRequests] = await Promise.all([
          fetch('http://localhost:5000/api/friends', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/friends/requests', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const friends = await resFriends.json();
        const requests = await resRequests.json();

        if (friends.find(f => f.id === dataUser.id)) {
          currentStatus = 'accepted';
        } else {
          const pedidoPendente = requests.find(r => r.sender_id === dataUser.id);
          if (pedidoPendente) {
            currentStatus = 'pending';
            setPerfil(prev => ({ ...prev, requestId: pedidoPendente.id }));
          }
        }
      }
      setStatusConexao(currentStatus);

      const podeVer = isOwnProfile || dataUser.profile_visibility === 'public' || currentStatus === 'accepted';
      if (podeVer) {
        const resPosts = await fetch(`http://localhost:5000/api/posts/user/${dataUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setPosts(resPosts.ok ? await resPosts.json() : []);
      } else {
        setPosts([]);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { carregarDadosDoPerfil(); }, [token, id]);

  const obterIniciais = (nome) => {
    if (!nome) return "U";
    return nome.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatarMembroDesde = (dataSql) => {
    if (!dataSql) return "";
    return new Date(dataSql).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  };

  const handleEnviarPedido = async () => {
    const res = await fetch(`http://localhost:5000/api/friends/request/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) carregarDadosDoPerfil();
  };

  const handleDecidirPedido = async (acao) => {
    const endpoint = acao === 'accepted' ? 'accept' : 'reject';
    await fetch(`http://localhost:5000/api/friends/${endpoint}/${perfil.requestId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    carregarDadosDoPerfil();
  };

  if (loading) return <div className="container mt-4">A carregar...</div>;

  const temAcesso = isOwnProfile || perfil?.profile_visibility === 'public' || statusConexao === 'accepted';

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="bg-secondary" style={{ height: '150px' }}></div>
        <div className="card-body position-relative pt-5">
          <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold border border-4 border-white position-absolute shadow" style={{ width: '110px', height: '110px', fontSize: '36px', top: '-55px', left: '30px' }}>
            {obterIniciais(perfil?.name)}
          </div>
          <div className="d-flex justify-content-between align-items-start flex-wrap mt-2">
            <h3 className="fw-bold mb-0">{perfil?.name}</h3>
            <div className="d-flex gap-2">
              {isOwnProfile ? (
                <>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditando(!editando)}>{editando ? 'Cancelar' : 'Editar Perfil'}</button>
                  <button className="btn btn-danger btn-sm" onClick={() => { localStorage.clear(); navigate('/'); }}>Sair</button>
                </>
              ) : (
                <>
                  {statusConexao === 'none' && <button className="btn btn-primary btn-sm" onClick={handleEnviarPedido}>➕ Adicionar</button>}
                  {statusConexao === 'pending' && perfil?.requestId && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => handleDecidirPedido('accepted')}> Aceitar</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDecidirPedido('rejected')}>Reject</button>
                    </>
                  )}
                  {statusConexao === 'accepted' && <button className="btn btn-success btn-sm" disabled> Amigos</button>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {temAcesso ? (
        <div className="row">
          <div className="col-lg-8">
            {editando ? (
              <div className="card shadow-sm border-0 p-4 mb-4">
                <form onSubmit={async (e) => { e.preventDefault(); await fetch('http://localhost:5000/api/users/me', { method: 'PUT', headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({name: novoNome, profile_visibility: novaVisibilidade, avatar: perfil.avatar})}); setEditando(false); carregarDadosDoPerfil(); }}>
                  <input className="form-control mb-3" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                  <select className="form-select mb-3" value={novaVisibilidade} onChange={(e) => setNovaVisibilidade(e.target.value)}>
                    <option value="public">🌍 Público</option>
                    <option value="private">🔒 Privado</option>
                  </select>
                  <button className="btn btn-primary btn-sm" type="submit">Guardar</button>
                </form>
              </div>
            ) : posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <h5 className="fw-bold mb-3" style={{ fontSize: '16px' }}>Informações da Conta</h5>
              {isOwnProfile && <div className="mb-2"><strong>Email:</strong><span className="text-muted d-block">{perfil?.email}</span></div>}
              <div className="mb-2"><strong>Membro desde:</strong><span className="text-muted text-capitalize d-block">{formatarMembroDesde(perfil?.created_at)}</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 p-5 text-center">🔒 <h5>Este perfil é privado</h5><p>Adiciona este utilizador para veres as suas publicações.</p></div>
      )}
    </div>
  );
}