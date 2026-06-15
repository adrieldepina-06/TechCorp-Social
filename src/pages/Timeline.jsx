import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
// Podes manter o import do UserCard se planeares usá-lo mais tarde na barra lateral
// import UserCard from '../components/UserCard';

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [mostrarCriarPost, setMostrarCriarPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. Função para ir buscar os posts reais ao Backend
  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    // Se não houver token, o utilizador não está logado. Força o redirecionamento.
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts/timeline", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar o feed de publicações.");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Executa o fetch assim que a página é montada no ecrã
  useEffect(() => {
    fetchPosts();
  }, []);

  // 3. Função para enviar a nova publicação para a base de dados
  const handleAdicionarPost = async (conteudoDoPost) => {
    const token = localStorage.getItem("token");

    try {
      let bodyData;
      let headers = { "Authorization": `Bearer ${token}` };

      // O backend aceita imagens! Se o teu CreatePost enviar um FormData, lidamos com ele:
      if (conteudoDoPost instanceof FormData) {
        bodyData = conteudoDoPost;
      } else {
        // Se for apenas texto simples
        headers["Content-Type"] = "application/json";
        bodyData = JSON.stringify({ content: conteudoDoPost });
      }

      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: headers,
        body: bodyData
      });

      if (!response.ok) {
        throw new Error("Não foi possível criar a publicação.");
      }

      // Se correu bem, fecha o modal e recarrega os posts atualizados da base de dados
      setMostrarCriarPost(false);
      fetchPosts();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <div className="row justify-content-center">

        {/* COLUNA ESQUERDA: Feed Principal */}
        <div className="col-lg-8">
          <h4 className="mb-4 fw-bold">Feed</h4>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && posts.length === 0 && (
            <p className="text-secondary">No publications to show.</p>
          )}

          {posts.map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <button
        className="btn btn-primary rounded-pill px-4 py-2 position-fixed bottom-0 end-0 m-4 shadow-lg fw-bold"
        style={{ zIndex: 1000, fontSize: '15px' }}
        onClick={() => setMostrarCriarPost(true)}
      >
        + New Post
      </button>

      {/* MODAL */}
      {mostrarCriarPost && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setMostrarCriarPost(false)} style={{ zIndex: 1040 }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold text-secondary" style={{ fontSize: '16px' }}>
                    New Post
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarCriarPost(false)}></button>
                </div>
                <div className="modal-body p-0">
                  <CreatePost
                    onSalvar={handleAdicionarPost}
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