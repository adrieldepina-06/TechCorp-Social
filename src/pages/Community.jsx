import UserCard from '../components/UserCard';

function Community() {
  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>

      {/* BARRA SUPERIOR: Ajustada para trazer a pesquisa para o meio/esquerda */}
      <div className="row mb-4 align-items-center">
        {/* O titulo agora ocupa apenas 3 colunas em ecras grandes */}
        <div className="col-lg-3 col-md-4">
          <h4 className="fw-bold mb-2 mb-md-0">Comunidade</h4>
        </div>

        {/* A pesquisa ocupa 5 colunas. Somado ao titulo (3+5), termina exatamente na coluna 8 */}
        <div className="col-lg-5 col-md-8">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Pesquisar por nome ou funcao..."
          />
        </div>
      </div>

      {/* CORPO DA PÁGINA */}
      <div className="row">

        {/* COLUNA ESQUERDA: Lista de Membros (Ocupa 8 colunas) */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-3 mb-4">
            <h5 className="fw-bold text-secondary mb-3" style={{ fontSize: '16px' }}>
              Todos os Utilizadores
            </h5>

            <div className="row row-cols-1 row-cols-md-2 g-2">
              <div className="col"><UserCard /></div>
              <div className="col"><UserCard /></div>
              <div className="col"><UserCard /></div>
              <div className="col"><UserCard /></div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Pedidos Pendentes (Ocupa 4 colunas) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5 className="fw-bold text-secondary mb-3" style={{ fontSize: '16px' }}>
              Pedidos Recebidos
            </h5>

            <div className="bg-white p-3 rounded shadow-sm mb-2" style={{ fontSize: '14px' }}>
              <div className="fw-bold text-dark mb-1">Carlos Antunes</div>
              <small className="text-muted d-block mb-2">Engenharia Eletrotecnica</small>
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm flex-grow-1 fw-bold" style={{ fontSize: '12px' }}>
                  Aceitar
                </button>
                <button className="btn btn-outline-danger btn-sm flex-grow-1 fw-bold" style={{ fontSize: '12px' }}>
                  Recusar
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Community;