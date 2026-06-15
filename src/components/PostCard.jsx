import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [liked, setLiked] = useState(Boolean(post.liked_by_me));
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    user = null;
  }

  const isMyPost = user && Number(user.id) === Number(post.user_id);

  useEffect(() => {
    setLikes(post.likes_count || 0);
    setLiked(Boolean(post.liked_by_me));
    setCommentsCount(post.comments_count || 0);
  }, [post]);

  const deletePost = async () => {
    const ok = window.confirm('Delete this post?');

    if (!ok) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Could not delete post');
      }
    } catch (err) {
      console.log(err);
      alert('Error deleting post');
    }
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
    if (!dateValue) return 'Agora';
    return new Date(dateValue).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    const method = liked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);

      const res = await fetch(`http://localhost:5000/api/comments/post/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }

    setShowComments(!showComments);
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/comments/post/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: commentText
        })
      });

      if (res.ok) {
        setCommentText('');
        setCommentsCount(commentsCount + 1);
        await loadComments();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeComment = async (comment) => {
    const method = comment.liked_by_me ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${comment.id}/like`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setComments((oldComments) =>
          oldComments.map((item) => {
            if (item.id !== comment.id) {
              return item;
            }

            return {
              ...item,
              liked_by_me: comment.liked_by_me ? 0 : 1,
              likes_count: comment.liked_by_me
                ? Number(comment.likes_count) - 1
                : Number(comment.likes_count) + 1
            };
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-3 mb-3 bg-white">
      <div
        className="d-flex align-items-center mb-3"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/profile/${post.user_id}`)}
      >
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold me-3"
          style={{ width: '45px', height: '45px', fontSize: '15px' }}
        >
          {getInitials(post.name)}
        </div>

        <div>
          <h6 className="mb-0 fw-bold">{post.name || 'User'}</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>
            {formatDate(post.created_at)} · {post.visibility === 'private' ? 'Private' : 'Public'}
          </small>
        </div>

        {isMyPost && (
          <button
            className="btn btn-sm btn-outline-danger ms-auto"
            onClick={(e) => {
              e.stopPropagation();
              deletePost();
            }}
          >
            Delete
          </button>
        )}        
      </div>

      {post.content && (
        <p className="text-secondary mb-3" style={{ fontSize: '14px' }}>
          {post.content}
        </p>
      )}

      {post.image && (
        <div className="mb-3 rounded overflow-hidden border">
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
      )}

      <hr className="my-2" />

      <div className="row g-2 text-center mb-2">
        <div className="col-6">
          <button
            className={`btn btn-sm w-100 fw-bold ${liked ? 'btn-primary' : 'btn-light'}`}
            onClick={handleLike}
          >
            {liked ? 'Like' : 'Like'} ({likes})
          </button>
        </div>

        <div className="col-6">
          <button
            className="btn btn-sm w-100 fw-bold btn-light"
            onClick={toggleComments}
          >
            Comments ({commentsCount})
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-3 pt-3 border-top">
          <form onSubmit={addComment} className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Escrever comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn btn-sm btn-primary" type="submit">
              Send
            </button>
          </form>

          {commentsLoading && (
            <p className="text-muted small">Loading comments...</p>
          )}

          {!commentsLoading && comments.length === 0 && (
            <p className="text-muted small mb-0">No comments yet.</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="bg-light rounded p-2 mb-2">
              <div className="d-flex align-items-start">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-2"
                  style={{ width: '28px', height: '28px', fontSize: '10px', minWidth: '28px' }}
                >
                  {getInitials(comment.name)}
                </div>

                <div className="flex-grow-1" style={{ fontSize: '13px' }}>
                  <strong>{comment.name}</strong>
                  <div className="text-secondary">{comment.content}</div>

                  <button
                    className="btn btn-link btn-sm p-0 mt-1 text-decoration-none"
                    onClick={() => likeComment(comment)}
                  >
                    {comment.liked_by_me ? 'Remove Like' : 'Like'} ({comment.likes_count || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;