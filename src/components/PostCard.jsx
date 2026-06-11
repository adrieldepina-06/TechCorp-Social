import { useState } from 'react';

function PostCard({ post }) {
  const [gostos, setGostos] = useState(post.gostos);
  const [deuGosto, setDeuGosto] = useState(false);

  const handleGosto = () => {
    if (deuGosto) {
      setGostos(gostos - 1);
    } else {
      setGostos(gostos + 1);
    }
    setDeuGosto(!deuGosto);
  };

  const obterIniciais = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="card shadow-sm border-0 p-3 mb-3 bg-white">

      {/* Cabeçalho do Post */}
      <div className="d-flex align-items-center mb-3">
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm"
          style={{ width: '45px', height: '45px', fontSize: '15px' }}
        >
          {obterIniciais(post.autor)}
        </div>
        <div>
          <h6 className="mb-0 fw-bold text-dark">{post.autor}</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>
            {post.funcao} • {post.data}
          </small>
        </div>
      </div>

      {/* Corpo do Post */}
      <p className="text-secondary mb-3" style={{ fontSize: '14px', lineHeight: '1.5' }}>
        {post.conteudo}
      </p>

      {/* Linha Divisória */}
      <hr className="my-2 opacity-25" />

      {/* BOTÕES DE ACÇÃO (Gostei e Comentários) */}
      <div className="row g-2 text-center mb-2">
        <div className="col-6">
          <button
            className={`btn btn-sm w-100 fw-bold bg-light ${deuGosto ? 'text-primary' : 'text-secondary'}`}
            style={{ fontSize: '13px', border: '1px solid #eee' }}
            onClick={handleGosto}
          >
            {deuGosto ? 'Gostei' : 'Gostei'} ({gostos})
          </button>
        </div>
        <div className="col-6">
          <div
            className="btn btn-sm w-100 fw-bold bg-light text-secondary disabled"
            style={{ fontSize: '13px', border: '1px solid #eee' }}
          >
            Comentários ({post.comentarios.length})
          </div>
        </div>
      </div>

      {/* SECÇÃO DE COMENTÁRIOS DINÂMICOS */}
      {post.comentarios.length > 0 && (
        <div className="mt-3 pt-2 border-top border-light">
          {post.comentarios.map((comentario) => (
            <div key={comentario.id} className="card bg-light border-0 p-2 mb-2">
              <div className="d-flex align-items-start">
                {/* Mini Avatar para o comentário */}
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-2"
                  style={{ width: '28px', height: '28px', fontSize: '10px', minWidth: '28px' }}
                >
                  {obterIniciais(comentario.autor)}
                </div>
                {/* Texto do Comentário */}
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