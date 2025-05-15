import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import api from "../services/api";
import FavoriteButton from "../components/FavoriteButton";

import "../styles/MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
        const ratings = res.data.ratings || [];

        const storedUserRaw = localStorage.getItem("user");
        const parsedUser =
          storedUserRaw && storedUserRaw !== "undefined"
            ? JSON.parse(storedUserRaw)
            : null;

        setUser(parsedUser);
        setUserRating(0); 

        if (ratings.length > 0) {
          const avg =
            ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
          setAverageRating(avg.toFixed(1));

          if (parsedUser) {
            const existing = ratings.find((r) => r.userId === parsedUser.id);
            if (existing) setUserRating(existing.value);
          }
        }
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

    fetchMovie();
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movie?.genres) return;
      try {
        const res = await api.get("/movies");
        const allMovies = res.data.movies || [];

        const filtered = allMovies.filter(
          (m) =>
            m._id !== movie._id &&
            m.genres?.some((g) => movie.genres.includes(g))
        );

        setRecommendations(filtered.slice(0, 4));
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [movie]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      alert("Error sending comment. Please log in again.");
    }
  };

  const submitRating = async (value) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/movies/${id}/rate`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovie(res.data);

      const ratings = res.data.ratings || [];
      if (ratings.length > 0) {
        const avg =
          ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
        setAverageRating(avg.toFixed(1));

        let storedUser = null;
        try {
          const rawUser = localStorage.getItem("user");
          storedUser =
            rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
        } catch (err) {
          console.error("Error reading user in submitRating:", err);
        }

        const existing = ratings.find((r) => r.userId === storedUser?.id);

        if (existing) setUserRating(existing.value);
      }
    } catch (err) {
      alert("Error evaluating. Please log in again.");
    }
  };

  if (!movie)
    return <p className="loading-text">Loading movie details...</p>;

  const posterUrl =
    movie.poster || "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="movie-detail">
      <button
        className="back-button"
        onClick={() => {
          const from = location.state?.from || "/";
          const search = location.state?.searchQuery || "";
          const genre = location.state?.selectedGenre || "";
          const page = location.state?.currentPage || 1;

          const queryParams = new URLSearchParams();
          if (search) queryParams.set("search", search);
          if (genre) queryParams.set("genre", genre);
          if (page) queryParams.set("page", page);

          history.push(`${from}?${queryParams.toString()}`);
        }}
      >
        ← Go Back
      </button>

      <img src={posterUrl} alt={movie.title} className="movie-poster-top" />

      <div className="movie-info-vertical">
        <h1 className="movie-title">{movie.title}</h1>
        <div className="favorite-container">
          <FavoriteButton
            movieId={movie._id}
            onToggle={() => window.location.reload()}
          />
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
            <strong>🗳️</strong> {movie.imdb?.votes || 0} Votes
          </p>
          <p>
            <strong>⏱️ Duration:</strong> {movie.runtime || "N/A"} minutes
          </p>
        </div>

        <div className="movie-cast">
          <h3>🎭 Cast</h3>
          <p>{movie.cast?.join(", ") || "No information"}</p>
        </div>

        <div className="movie-plot">
          <h3>📖 Synopsis</h3>
          <p>{movie.plot || "No synopsis available."}</p>
        </div>
        <div className="movie-rating">
          <h3>🗳️ Assessment</h3>
          <p>
            {averageRating
              ? `Average: ${averageRating}/5 (${movie.ratings.length} reviews)`
              : "Not yet rated."}
          </p>
          {user ? (
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= userRating ? "filled" : ""}`}
                  onClick={() => submitRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          ) : (
            <p className="comment-login-prompt">
              🔒 To evaluate,{" "}
              <span onClick={() => history.push("/login")} className="link">
                log in
              </span>{" "}
              or{" "}
              <span onClick={() => history.push("/register")} className="link">
                register
              </span>
              .
            </p>
          )}
        </div>

        <div className="movie-comments">
          <h3>💬 Comments</h3>
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <strong>{comment.userName}</strong>: {comment.text}
            </div>
          ))}

          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">Comment</button>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p>
                🔒 To comment,{" "}
                <span onClick={() => history.push("/login")} className="link">
                  log in
                </span>{" "}
                or{" "}
                <span
                  onClick={() => history.push("/register")}
                  className="link"
                >
                  register
                </span>
                .
              </p>
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h3>🍿 You may also like...</h3>
            <div className="recommendations-grid">
              {recommendations.map((rec) => (
                <img
                  key={rec._id}
                  src={
                    rec.poster ||
                    "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={rec.title}
                  className="movie-poster-recommendation"
                  onClick={() => history.push(`/movies/${rec._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
