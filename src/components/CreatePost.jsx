import { useState } from 'react';

function CreatePost({ onSalvar, onFechar }) {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    onSalvar(texto);
    setTexto('');
    onFechar();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white rounded">
      <div className="mb-3">
        <textarea
          className="form-control border-0 bg-light p-3"
          rows="4"
          placeholder="No que esta a pensar para o projeto hoje?..."
          style={{ resize: 'none', fontSize: '14px' }}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        ></textarea>
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