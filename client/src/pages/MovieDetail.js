import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../services/api";
import FavoriteButton from "../components/FavoriteButton";
import "../styles/MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const history = useHistory();

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error("Erro ao buscar comentários:", err);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchMovie();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/comments",
        { movieId: id, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      alert("Erro ao enviar comentário. Faz login novamente.");
    }
  };

  if (!movie)
    return <p className="loading-text">A carregar detalhes do filme...</p>;

  const posterUrl =
    movie.poster || "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="movie-detail">
      {/* 🔙 Botão de Voltar */}
      <button className="back-button" onClick={() => history.goBack()}>
        ← Voltar
      </button>

      <img src={posterUrl} alt={movie.title} className="movie-poster-top" />

      <div className="movie-info-vertical">
        <h1 className="movie-title">{movie.title}</h1>
        <div className="favorite-container">
          <FavoriteButton movieId={movie._id} />
        </div>
        <div className="genres">
          {movie.genres?.map((genre, index) => (
            <span key={index} className="genre-chip">
              {genre}
            </span>
          ))}
        </div>

        <div className="movie-meta">
          <p>
            <strong>⭐ IMDB:</strong> {movie.imdb?.rating || "N/A"}/10
            &nbsp;|&nbsp;
            <strong>🗳️</strong> {movie.imdb?.votes || 0} votos
          </p>
          <p>
            <strong>⏱️ Duração:</strong> {movie.runtime || "N/A"} minutos
          </p>
        </div>

        <div className="movie-cast">
          <h3>🎭 Elenco</h3>
          <p>{movie.cast?.join(", ") || "Sem informação"}</p>
        </div>

        <div className="movie-plot">
          <h3>📖 Sinopse</h3>
          <p>{movie.plot || "Sem sinopse disponível."}</p>
        </div>

        <div className="movie-comments">
          <h3>💬 Comentários</h3>
          {comments.length === 0 && <p>Ainda não há comentários.</p>}
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <strong>{comment.userName}</strong>: {comment.text}
            </div>
          ))}

          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                placeholder="Escreve um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">Comentar</button>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p>
                🔒 Para comentar,{" "}
                <span onClick={() => history.push("/login")} className="link">
                  efetua login
                </span>{" "}
                ou{" "}
                <span
                  onClick={() => history.push("/register")}
                  className="link"
                >
                  regista-te
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
