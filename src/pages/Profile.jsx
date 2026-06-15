import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('none');
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaVisibilidade, setNovaVisibilidade] = useState('public');

  const token = localStorage.getItem('token');

  function getUser() {
    try {
      const userText = localStorage.getItem('user');
      return userText ? JSON.parse(userText) : null;
    } catch (err) {
      return null;
    }
  }

  const userLogado = getUser();
  const isOwnProfile = !id || Number(id) === Number(userLogado?.id);

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    return new Date(dateValue).toLocaleDateString('pt-PT', {
      month: 'long',
      year: 'numeric'
    });
  };

  const loadProfile = async () => {
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      const profileUrl = isOwnProfile
        ? 'http://localhost:5000/api/users/me'
        : `http://localhost:5000/api/users/${id}`;

      const profileRes = await fetch(profileUrl, {
        headers: headers
      });

      if (!profileRes.ok) {
        navigate('/timeline');
        return;
      }

      const profileData = await profileRes.json();

      setPerfil(profileData);
      setNovoNome(profileData.name || '');
      setNovaVisibilidade(profileData.profile_visibility || 'public');

      let newStatus = 'none';
      let newRequestId = null;

      if (!isOwnProfile) {
        const friendsRes = await fetch('http://localhost:5000/api/friends', {
          headers: headers
        });

        const requestsRes = await fetch('http://localhost:5000/api/friends/my-requests', {
          headers: headers
        });

        const friends = await friendsRes.json();
        const requests = await requestsRes.json();

        const isFriend = friends.find((friend) => friend.id === profileData.id);

        if (isFriend) {
          newStatus = 'friend';
        } else {
          const sentRequest = requests.find((req) => {
            return req.sender_id === userLogado.id && req.receiver_id === profileData.id;
          });

          const receivedRequest = requests.find((req) => {
            return req.sender_id === profileData.id && req.receiver_id === userLogado.id;
          });

          if (sentRequest) {
            newStatus = 'sent';
            newRequestId = sentRequest.id;
          }

          if (receivedRequest) {
            newStatus = 'received';
            newRequestId = receivedRequest.id;
          }
        }
      }

      setStatus(newStatus);
      setRequestId(newRequestId);

      const canSeeProfile =
        isOwnProfile ||
        profileData.profile_visibility === 'public' ||
        newStatus === 'friend';

      if (canSeeProfile) {
        const postsRes = await fetch(`http://localhost:5000/api/posts/user/${profileData.id}`, {
          headers: headers
        });

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        } else {
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const sendRequest = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/friends/request/${perfil.id}`, {
        method: 'POST',
        headers: headers
      });

      if (res.ok) {
        loadProfile();
      } else {
        const data = await res.json();
        alert(data.message || 'Não foi possível enviar o pedido.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const answerRequest = async (action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/friends/${action}/${requestId}`, {
        method: 'POST',
        headers: headers
      });

      if (res.ok) {
        loadProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFriend = async () => {
    const ok = window.confirm('Remover este amigo?');

    if (!ok) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/friends/${perfil.id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (res.ok) {
        loadProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: novoNome,
          avatar: perfil.avatar,
          profile_visibility: novaVisibilidade
        })
      });

      if (res.ok) {
        const oldUser = getUser();

        localStorage.setItem(
          'user',
          JSON.stringify({
            ...oldUser,
            name: novoNome,
            profile_visibility: novaVisibilidade
          })
        );

        setEditando(false);
        loadProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        A carregar perfil...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="container mt-4">
        Perfil não encontrado.
      </div>
    );
  }

  const canSeeProfile =
    isOwnProfile ||
    perfil.profile_visibility === 'public' ||
    status === 'friend';

  return (
    <div className="container mt-4" style={{ maxWidth: '1140px' }}>
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="bg-secondary" style={{ height: '150px' }}></div>

        <div className="card-body position-relative pt-5">
          <div
            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold border border-4 border-white position-absolute shadow"
            style={{
              width: '110px',
              height: '110px',
              fontSize: '36px',
              top: '-55px',
              left: '30px'
            }}
          >
            {getInitials(perfil.name)}
          </div>

          <div className="d-flex justify-content-between align-items-start flex-wrap mt-2">
            <div>
              <h3 className="fw-bold mb-1">{perfil.name}</h3>

              <small className="text-muted">
                {perfil.profile_visibility === 'private' ? 'Perfil privado' : 'Perfil público'}
              </small>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {isOwnProfile && (
                <>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setEditando(!editando)}
                  >
                    {editando ? 'Cancelar' : 'Editar Perfil'}
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={logout}
                  >
                    Sair
                  </button>
                </>
              )}

              {!isOwnProfile && status === 'none' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={sendRequest}
                >
                  Add
                </button>
              )}

              {!isOwnProfile && status === 'sent' && (
                <button className="btn btn-secondary btn-sm" disabled>
                  Pending Request
                </button>
              )}

              {!isOwnProfile && status === 'received' && (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => answerRequest('accept')}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => answerRequest('reject')}
                  >
                    Reject
                  </button>
                </>
              )}

              {!isOwnProfile && status === 'friend' && (
                <>
                  <button className="btn btn-success btn-sm" disabled>
                    Friends
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={removeFriend}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {canSeeProfile ? (
        <div className="row">
          <div className="col-lg-8">
            {editando && isOwnProfile && (
              <div className="card shadow-sm border-0 p-4 mb-4">
                <h5 className="fw-bold mb-3">Edit Profile</h5>

                <form onSubmit={saveProfile}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">
                      Name
                    </label>

                    <input
                      className="form-control"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">
                      Profile Visibility
                    </label>

                    <select
                      className="form-select"
                      value={novaVisibilidade}
                      onChange={(e) => setNovaVisibilidade(e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <button className="btn btn-primary btn-sm" type="submit">
                    Save
                  </button>
                </form>
              </div>
            )}

            <h5 className="fw-bold mb-3">Publications</h5>

            {posts.length === 0 && (
              <p className="text-muted small">
                No publications to show.
              </p>
            )}

            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm border-0 p-3 bg-light">
              <h5 className="fw-bold mb-3" style={{ fontSize: '16px' }}>
                Account Info
              </h5>

              {isOwnProfile && (
                <div className="mb-2">
                  <strong>Email:</strong>
                  <span className="text-muted d-block">
                    {perfil.email}
                  </span>
                </div>
              )}

              <div className="mb-2">
                <strong>Member since:</strong>
                <span className="text-muted text-capitalize d-block">
                  {formatDate(perfil.created_at)}
                </span>
              </div>

              {!isOwnProfile && status === 'friend' && (
                <div className="mb-2">
                  <strong>Status:</strong>
                  <span className="text-success d-block">
                    Friends
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 p-5 text-center">
          <h4>🔒</h4>
          <h5>This profile is private</h5>
          <p className="text-muted mb-0">
            Add this user to see their publications.
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;