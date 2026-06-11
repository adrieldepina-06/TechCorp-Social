function UserCard() {
  return (
    <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded shadow-sm mb-2" style={{ fontSize: '14px' }}>

      {/* Lado Esquerdo: Avatar e Textos alinhados */}
      <div className="d-flex align-items-center">
        {/* Avatar mais pequeno e discreto */}
        <div
          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-2"
          style={{ width: '35px', height: '35px', fontSize: '12px' }}
        >
          UA
        </div>

        {/* Textos com tamanhos reduzidos */}
        <div>
          <span className="d-block fw-bold text-dark lh-sm">Utilizador Aleatorio</span>
          <small className="text-muted" style={{ fontSize: '11px' }}>Estudante / Colega</small>
        </div>
      </div>

      {/* Lado Direito: Botao minimalista */}
      <div>
        <button className="btn btn-outline-primary btn-sm py-1 px-2 fw-bold" style={{ fontSize: '12px' }}>
          Adicionar
        </button>
      </div>

    </div>
  );
}

export default UserCard;