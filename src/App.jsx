import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Timeline from './pages/Timeline';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Login from './pages/Login';

function AppContent({ posts, onAdicionarPost }) {
  const location = useLocation();
  const mostrarNavbar = location.pathname !== '/';

  return (
    <div>
      {mostrarNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/timeline"
          element={<Timeline posts={posts} onAdicionarPost={onAdicionarPost} />}
        />

        <Route
          path="/perfil"
          element={<Profile posts={posts.filter(p => p.autor === 'João Silva' || p.autor === 'Joao Silva')} />}
        />

        <Route path="/comunidade" element={<Community />} />
      </Routes>
    </div>
  );
}

function App() {
  // Lista inicial com os dados exatos e formatados do teu ecrã
  const [posts, setPosts] = useState([
    {
      id: 1,
      autor: "Ana Rodrigues",
      funcao: "Designer de Interface | TechCorp",
      conteudo: "Malta, acabei de rever o novo design do painel de controlo da rede. O que acham de usarmos uma abordagem com tons mais escuros para reduzir a fadiga visual dos operadores?",
      data: "Há 2 horas",
      gostos: 12,
      comentarios: []
    },
    {
      id: 2,
      autor: "João Silva",
      funcao: "Estudante de Engenharia Informática | IT",
      conteudo: "A desenvolver a interface reativa da nossa rede social em React e Bootstrap 5!",
      data: "Há 10 minutos",
      gostos: 3,
      comentarios: [
        {
          id: 101,
          autor: "Maria Santos",
          texto: "Está a ficar excelente! Parabéns."
        }
      ]
    }
  ]);

  // Função para dar vida ao feed e aceitar novas publicações
  const adicionarPost = (textoDoPost) => {
    const novoPost = {
      id: Date.now(),
      autor: "João Silva",
      funcao: "Estudante de Engenharia Informática | IT",
      conteudo: textoDoPost,
      data: "Agora mesmo",
      gostos: 0,
      comentarios: []
    };
    setPosts([novoPost, ...posts]);
  };

  return (
    <Router>
      <AppContent posts={posts} onAdicionarPost={adicionarPost} />
    </Router>
  );
}

export default App;