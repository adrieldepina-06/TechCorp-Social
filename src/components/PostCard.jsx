import { useState } from 'react';

function PostCard({ post }) {
  // Mapeado para ler 'likes_count' vindo da Query SQL do backend
  const [gostos, setGostos] = useState(post.likes_count || 0);
  const [deuGosto, setDeuGosto] = useState(false);

  // Sincronização Real do Like com o Backend
  const handleGosto = async () => {
    const token = localStorage.getItem("token");
    const metodo = deuGosto ? "DELETE" : "POST";

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
        method: metodo,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setGostos(deuGosto ? gostos - 1 : gostos + 1);
        setDeuGosto(!deuGosto);
      }
    } catch (err) {
      console.error("Erro ao processar o gosto:", err);
    }
  };

  const obterIniciais = (nome) => {
    if (!nome) return "TC";
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Formatação amigável da data vinda do MySQL
  const formatarData = (dataSql) => {
    if (!dataSql) return "Agora mesmo";
    return new Date(dataSql).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card shadow-sm border-0 p-3 mb-3 bg-white">

      {/* Cabeçalho do Post - Mapeado para post.name */}
      <div className="d-flex align-items-center mb-3">
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm"
          style={{ width: '45px', height: '45px', fontSize: '15px' }}
        >
          {obterIniciais(post.name)}
        </div>
        <div>
          <h6 className="mb-0 fw-bold text-dark">{post.name || "Utilizador TechCorp"}</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>
            Colaborador • {formatarData(post.created_at)}
          </small>
        </div>
      </div>

      {/* Corpo do Post - Mapeado para post.content */}
      <p className="text-secondary mb-3" style={{ fontSize: '14px', lineHeight: '1.5' }}>
        {post.content}
      </p>

      {/* Upload de Imagem integrado (se existir imagem na base de dados) */}
      {post.image && (
        <div className="mb-3 rounded overflow-hidden border">
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Publicação"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
      )}

      <hr className="my-2 opacity-25" />

      {/* Botões de Ação */}
      <div className="row g-2 text-center mb-2">
        <div className="col-6">
          <button
            className={`btn btn-sm w-100 fw-bold bg-light ${deuGosto ? 'text-primary' : 'text-secondary'}`}
            style={{ fontSize: '13px', border: '1px solid #eee' }}
            onClick={handleGosto}
          >
            {deuGosto ? '❤️ Gostei' : '👍 Gostará'} ({gostos})
          </button>
        </div>
        <div className="col-6">
          <div
            className="btn btn-sm w-100 fw-bold bg-light text-secondary disabled"
            style={{ fontSize: '13px', border: '1px solid #eee' }}
          >
            Comentários (0)
          </div>
        </div>
      </div>

      {/* Secção de comentários salvaguardada (caso adicionem no futuro) */}
      {post.comentarios && post.comentarios.length > 0 && (
        <div className="mt-3 pt-2 border-top border-light">
          {post.comentarios.map((comentario) => (
            <div key={comentario.id} className="card bg-light border-0 p-2 mb-2">
              <div className="d-flex align-items-start">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-2"
                  style={{ width: '28px', height: '28px', fontSize: '10px', minWidth: '28px' }}
                >
                  {obterIniciais(comentario.autor)}
                </div>
                <div style={{ fontSize: '13px' }}>
                  <strong className="text-dark me-1">{comentario.autor}</strong>
                  <span className="text-secondary">{comentario.texto}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default PostCard;