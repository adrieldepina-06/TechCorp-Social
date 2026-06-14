import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';

function Community() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [pedidosRecebidos, setPedidosRecebidos] = useState([]);
  const [pedidosEnviados, setPedidosEnviados] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const usuarioLogado = JSON.parse(localStorage.getItem('user'));

  const authHeader = {
    Authorization: `Bearer ${token}`
  };

  const carregarDados = async () => {
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      const resUsers = await fetch('http://localhost:5000/api/users', {
        headers: authHeader
      });

      const resFriends = await fetch('http://localhost:5000/api/friends', {
        headers: authHeader
      });

      const resRequests = await fetch('http://localhost:5000/api/friends/my-requests', {
        headers: authHeader
      });

      const usersData = await resUsers.json();
      const friendsData = await resFriends.json();
      const requestsData = await resRequests.json();

      setUsuarios(usersData);
      setAmigos(friendsData);

      const received = requestsData.filter(
        (item) => item.receiver_id === usuarioLogado.id && item.status === 'pending'
      );

      const sent = requestsData
        .filter((item) => item.sender_id === usuarioLogado.id && item.status === 'pending')
        .map((item) => item.receiver_id);

      setPedidosRecebidos(received);
      setPedidosEnviados(sent);
    } catch (err) {
      console.log(err);
      alert('Erro ao carregar a comunidade.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const enviarPedido = async (e, userId) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:5000/api/friends/request/${userId}`, {
        method: 'POST',
        headers: authHeader
      });

      if (res.ok) {
        carregarDados();
      } else {
        const data = await res.json();
        alert(data.message || 'Não foi possível enviar o pedido.');
      }
    } catch (err) {
      console.log(err);
      alert('Erro ao enviar pedido.');
    }
  };

  const aceitarOuRecusar = async (e, requestId, action) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:5000/api/friends/${action}/${requestId}`, {
        method: 'POST',
        headers: authHeader
      });

      if (res.ok) {
        carregarDados();
      }
    } catch (err) {
      console.log(err);
      alert('Erro ao responder ao pedido.');
    }
  };

  const removerAmigo = async (e, friendId) => {
    e.stopPropagation();

    const confirmar = window.confirm('Remover este amigo?');

    if (!confirmar) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: authHeader
      });

      if (res.ok) {
        carregarDados();
      }
    } catch (err) {
      console.log(err);
      alert('Erro ao remover amigo.');
    }
  };

  const ehAmigo = (userId) => {
    return amigos.find((item) => item.id === userId);
  };

  const pedidoFoiEnviado = (userId) => {
    return pedidosEnviados.includes(userId);
  };

  const pedidoFoiRecebido = (userId) => {
    return pedidosRecebidos.find((item) => item.sender_id === userId);
  };

  const listaExibicao = usuarios.filter((user) => {
    return user.id !== usuarioLogado?.id && !pedidoFoiRecebido(user.id);
  });

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <h4 className="fw-bold mb-4">Comunidade</h4>

      <div className="row">
        <div className="col-lg-8">
          {loading && (
            <p className="text-muted small">A carregar membros da rede...</p>
          )}

          {!loading && listaExibicao.length === 0 && (
            <p className="text-muted small">Não há utilizadores para mostrar.</p>
          )}

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {listaExibicao.map((user) => {
              const amigo = ehAmigo(user.id);
              const pendente = pedidoFoiEnviado(user.id);

              let textoBotao = '➕ Adicionar';
              let acaoBotao = (e) => enviarPedido(e, user.id);
              let desativado = false;
              let textoSecundario = null;
              let acaoSecundaria = null;

              if (amigo) {
                textoBotao = '✅ Amigos';
                acaoBotao = null;
                desativado = true;
                textoSecundario = 'Remover';
                acaoSecundaria = (e) => removerAmigo(e, user.id);
              }

              if (pendente) {
                textoBotao = '⏳ Pendente';
                acaoBotao = null;
                desativado = true;
              }

              return (
                <div
                  className="col"
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <UserCard
                    usuario={user}
                    textoPrincipal={textoBotao}
                    acaoPrincipal={acaoBotao}
                    desativado={desativado}
                    textoSecundario={textoSecundario}
                    acaoSecundaria={acaoSecundaria}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5 className="fw-bold text-secondary mb-3" style={{ fontSize: '16px' }}>
              Pedidos Recebidos
            </h5>

            {pedidosRecebidos.length === 0 && (
              <p className="text-muted small">Sem pedidos pendentes.</p>
            )}

            {pedidosRecebidos.map((pedido) => {
              const sender = usuarios.find((item) => item.id === pedido.sender_id);

              return (
                <div
                  key={pedido.id}
                  onClick={() => navigate(`/profile/${pedido.sender_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <UserCard
                    usuario={sender || { name: 'Utilizador' }}
                    textoPrincipal="Aceitar"
                    acaoPrincipal={(e) => aceitarOuRecusar(e, pedido.id, 'accept')}
                    textoSecundario="Recusar"
                    acaoSecundaria={(e) => aceitarOuRecusar(e, pedido.id, 'reject')}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;