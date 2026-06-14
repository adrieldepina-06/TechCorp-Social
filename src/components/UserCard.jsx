function UserCard({ usuario, acaoPrincipal, textoPrincipal, acaoSecundaria, textoSecundario, desativado }) {
  // LINHA DE SEGURANÇA ADICIONADA:
  if (!usuario) return null;

  const obterIniciais = (nome) => {
    if (!nome) return "U";
    return nome.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded shadow-sm mb-2" style={{ fontSize: '14px' }}>
      <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
        <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-2 flex-shrink-0" style={{ width: '35px', height: '35px', fontSize: '12px' }}>
          {obterIniciais(usuario.name)}
        </div>
        <span className="fw-bold text-dark text-truncate">{usuario.name}</span>
      </div>

      <div className="d-flex gap-1">
        {acaoSecundaria && (
          <button className="btn btn-outline-danger btn-sm py-1 px-2" onClick={acaoSecundaria}>
            {textoSecundario || "❌"}
          </button>
        )}
        <button
          className={`btn btn-sm py-1 px-2 fw-bold ${desativado ? 'btn-success' : 'btn-outline-primary'}`}
          onClick={acaoPrincipal}
          disabled={desativado}
        >
          {textoPrincipal}
        </button>
      </div>
    </div>
  );
}

export default UserCard;