import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Toast from "./Toast";
import "../styles/MovieCard.css";

const MovieCard = ({ movie }) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const key = user?.id ? `favorites_${user.id}` : null;

    if (!key) {
      setIsFavorite(false);
      return;
    }

    const favs = JSON.parse(localStorage.getItem(key)) || [];
    setIsFavorite(favs.includes(movie._id));
  }, [movie._id, user]);

  const handleClick = () => {
    history.push(`/movies/${movie._id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();

    if (!user || !user.id) {
      setShowToast(true);
      return;
    }

    const key = `favorites_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(key)) || [];
    let updatedFavs;

    if (favs.includes(movie._id)) {
      updatedFavs = favs.filter((id) => id !== movie._id);
    } else {
      updatedFavs = [...favs, movie._id];
    }

    localStorage.setItem(key, JSON.stringify(updatedFavs));
    setIsFavorite(updatedFavs.includes(movie._id));
  };

  if (!movie) return null;

  return (
    <>
      <div className="movie-card" onClick={handleClick}>
        <img
          src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{movie.year}</p>
          <div className="movie-genres">
            {movie.genres?.slice(0, 3).map((genre, i) => (
              <span className="genre-tag" key={i}>
                {genre}
              </span>
            ))}
          </div>

          <div className="card-actions">
            <button className="view-button">View Details</button>
            <button
              className={`favorite-button ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Tens de estar autenticado para adicionar aos favoritos!"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default MovieCard;
