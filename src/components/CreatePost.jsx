import { useState } from 'react';

function CreatePost({ onSalvar, onFechar }) {
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(null);
  const [visibilidade, setVisibilidade] = useState('public');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!texto.trim() && !imagem) {
      return;
    }

    const formData = new FormData();
    formData.append('content', texto);
    formData.append('visibility', visibilidade);

    if (imagem) {
      formData.append('image', imagem);
    }

    onSalvar(formData);

    setTexto('');
    setImagem(null);
    setVisibilidade('public');
    onFechar();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white rounded">
      <div className="mb-3">
        <textarea
          className="form-control border-0 bg-light p-3"
          rows="4"
          placeholder="No que está a pensar hoje?"
          style={{ resize: 'none', fontSize: '14px' }}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label text-secondary small fw-bold">
          Visibility
        </label>
        <select
          className="form-select form-select-sm"
          value={visibilidade}
          onChange={(e) => setVisibilidade(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label text-secondary small fw-bold">
          Image Optional
        </label>
        <input
          type="file"
          className="form-control form-control-sm"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 border-top pt-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onFechar}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-sm btn-primary"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default CreatePost;