import { useState } from 'react';

function CreatePost({ onSalvar, onFechar }) {
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim() && !imagem) return;

    // Como o backend aceita uploads, usamos FormData para agrupar texto e ficheiro
    const formData = new FormData();
    formData.append("content", texto);
    if (imagem) {
      formData.append("image", imagem);
    }

    onSalvar(formData); // Envia o FormData completo para o handleAdicionarPost da Timeline
    setTexto('');
    setImagem(null);
    onFechar();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white rounded">
      <div className="mb-3">
        <textarea
          className="form-control border-0 bg-light p-3"
          rows="4"
          placeholder="No que está a pensar para o projeto hoje?..."
          style={{ resize: 'none', fontSize: '14px' }}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        ></textarea>
      </div>

      {/* Campo de Upload de Imagem Integrado com o Multer do colega */}
      <div className="mb-3 px-1">
        <label className="form-label text-secondary small fw-bold">Adicionar Imagem à Publicação (Opcional):</label>
        <input
          type="file"
          className="form-control form-control-sm"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 border-top pt-3 bg-light m-n3 p-3 rounded-bottom">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary fw-bold px-3"
          onClick={onFechar}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-primary fw-bold px-4 shadow-sm"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}

export default CreatePost;