import PostCard from '../components/PostCard';

function Profile({ posts }) {
  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>

      {/* CABEÇALHO DO PERFIL */}
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="bg-secondary" style={{ height: '150px' }}></div>
        <div className="card-body position-relative pt-5">
          <div
            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold border border-4 border-white position-absolute shadow"
            style={{ width: '110px', height: '110px', fontSize: '36px', top: '-55px', left: '30px' }}
          >
            JS
          </div>
          <div className="d-flex justify-content-between align-items-start flex-wrap mt-2">
            <div>
              <h3 className="fw-bold mb-1">Joao Silva</h3>
              <p className="text-muted mb-0">Estudante de Engenharia Informatica | Entusiasta de Desenvolvimento Web</p>
            </div>
            <button className="btn btn-outline-secondary btn-sm fw-bold mt-2 mt-sm-0">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* CORPO DO PERFIL */}
      <div className="row">

        {/* COLUNA ESQUERDA: As Minhas Publicações (Dinâmicas) */}
        <div className="col-lg-8">
          <h5 className="fw-bold mb-3 text-secondary" style={{ fontSize: '16px' }}>
            As Minhas Publicacoes
          </h5>

          {posts.length === 0 ? (
            <p className="text-muted small">Ainda nao fez nenhuma publicacao.</p>
          ) : (
            posts.map(item => (
              <PostCard key={item.id} post={item} />
            ))
          )}
        </div>

        {/* COLUNA DIREITA: Detalhes */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5 className="fw-bold text-secondary mb-3" style={{ fontSize: '16px' }}>
              Detalhes
            </h5>
            <div className="mb-2">
              <strong className="text-dark">Cidade:</strong> <span className="text-muted">Portalegre, Portugal</span>
            </div>
            <div className="mb-2">
              <strong className="text-dark">Funcao:</strong> <span className="text-muted">Estudante / IT</span>
            </div>
            <div className="mb-3">
              <strong className="text-dark">Membro desde:</strong> <span className="text-muted">Junho de 2026</span>
            </div>
            <hr />
            <div className="text-primary fw-bold text-center" style={{ cursor: 'pointer' }}>
              Ver mais informacoes
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;