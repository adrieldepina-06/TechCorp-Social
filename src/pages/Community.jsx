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

  const fetchData = async () => {
    try {
      const [resUsers, resFriends, resReqs] = await Promise.all([
        fetch('http://localhost:5000/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/friends', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/friends/my-requests', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const users = await resUsers.json();
      const friends = await resFriends.json();
      const allReqs = await resReqs.json();

      setUsuarios(users);
      setAmigos(friends);

      // Pedidos que recebi (status pendente)
      setPedidosRecebidos(allReqs.filter(r => r.receiver_id === usuarioLogado.id && r.status === 'pending'));

      // IDs de quem adicionei (status pendente)
      setPedidosEnviados(allReqs.filter(r => r.sender_id === usuarioLogado.id && r.status === 'pending').map(r => r.receiver_id));

      setLoading(false);
    } catch (err) { console.error("Erro ao carregar comunidade:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdicionar = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/friends/request/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPedidosEnviados(prev => [...prev, id]);
      }
    } catch (err) { alert("Erro ao enviar pedido."); }
  };

  const handleDecidirPedido = async (e, idPedido, acao) => {
    e.stopPropagation();
    const endpoint = acao === 'accepted' ? 'accept' : 'reject';
    await fetch(`http://localhost:5000/api/friends/${endpoint}/${idPedido}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData(); // Recarrega para mover o utilizador de lista
  };

  // Filtro: lista principal só mostra quem NÃO me enviou pedido (pois esses estão na lateral)
  const listaExibicao = usuarios.filter(u =>
    u.id !== usuarioLogado?.id &&
    !pedidosRecebidos.find(p => p.sender_id === u.id)
  );

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <h4 className="fw-bold mb-4">Comunidade</h4>
      <div className="row">

        {/* COLUNA ESQUERDA: Utilizadores da Rede */}
        <div className="col-lg-8">
          {loading && <p className="text-muted small">A carregar membros da rede...</p>}

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {listaExibicao.map((item) => {
              const isAmigo = amigos.find(a => a.id === item.id);
              const isPendente = pedidosEnviados.includes(item.id);

              return (
                <div className="col" key={item.id} onClick={() => navigate(`/profile/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <UserCard
                    usuario={item}
                    acaoPrincipal={!isAmigo && !isPendente ? (e) => handleAdicionar(e, item.id) : null}
                    textoPrincipal={isAmigo ? "✅ Amigos" : (isPendente ? "⏳ Pendente" : "➕ Adicionar")}
                    desativado={!!isAmigo || isPendente}
                  />
                </div>
              );
            })}
          </div>
        </div>

       {/* COLUNA DIREITA: Pedidos Recebidos */}
               <div className="col-lg-4">
                 <div className="card shadow-sm border-0 p-3 bg-light">
                   <h5 className="fw-bold text-secondary mb-3" style={{ fontSize: '16px' }}>Pedidos Recebidos</h5>

                   {pedidosRecebidos.length === 0 && <p className="text-muted small">Sem pedidos pendentes.</p>}

                   {pedidosRecebidos.map(p => {
                     const remetente = usuarios.find(u => u.id === p.sender_id);

                     return (
                       // ADICIONADO O CLIQUE AQUI (onClick e cursor pointer)
                       <div
                         key={p.id}
                         onClick={() => navigate(`/profile/${p.sender_id}`)}
                         style={{ cursor: 'pointer' }}
                       >
                         <UserCard
                           usuario={remetente || { name: "Utilizador da Rede" }}
                           textoPrincipal="Aceitar"
                           acaoPrincipal={(e) => handleDecidirPedido(e, p.id, 'accepted')}
                           textoSecundario="Recusar"
                           acaoSecundaria={(e) => handleDecidirPedido(e, p.id, 'rejected')}
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