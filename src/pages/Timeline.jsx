import { useState } from 'react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard'; // Garante que este import está correto
import UserCard from '../components/UserCard';

function Timeline({ posts, onAdicionarPost }) {
  const [mostrarCriarPost, setMostrarCriarPost] = useState(false);

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <div className="row">

        {/* COLUNA ESQUERDA: Feed Principal */}
        <div className="col-lg-8">
          <h4 className="mb-4 fw-bold">Cronologia</h4>

          {/* AQUI ESTÁ A CORREÇÃO: Mapeia para PostCard e passa a propriedade post */}
          {posts.map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>

        {/* COLUNA DIREITA: Barra Lateral */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5 className="mb-3 fw-bold text-secondary" style={{ fontSize: '16px' }}>
              Sugestoes de Amizade
            </h5>
            <UserCard />
            <UserCard />
          </div>
        </div>

      </div>

      {/* BOTÃO FLUTUANTE (Abre o Modal) */}
      <button
        className="btn btn-primary rounded-pill px-4 py-2 position-fixed bottom-0 end-0 m-4 shadow-lg fw-bold"
        style={{ zIndex: 1000, fontSize: '15px' }}
        onClick={() => setMostrarCriarPost(true)}
      >
        + Nova Publicacao
      </button>

      {/* ESTRUTURA DO MODAL JANELA FLUTUANTE */}
      {mostrarCriarPost && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setMostrarCriarPost(false)} style={{ zIndex: 1040 }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold text-secondary" style={{ fontSize: '16px' }}>
                    Criar Nova Publicacao
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarCriarPost(false)}></button>
                </div>
                <div className="modal-body p-0">
                  <CreatePost
                    onSalvar={onAdicionarPost}
                    onFechar={() => setMostrarCriarPost(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Timeline;