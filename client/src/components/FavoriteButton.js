import React, { useState, useEffect } from 'react';
import '../styles/FavoriteButton.css'; // Criar ficheiro de estilo leve para mensagem

const FavoriteButton = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [showWarning, setShowWarning] = useState(false); // NOVO

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favs.includes(movieId));

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [movieId]);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    if (!user) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavs;

    if (favs.includes(movieId)) {
      updatedFavs = favs.filter((id) => id !== movieId);
    } else {
      updatedFavs = [...favs, movieId];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    setIsFavorite(updatedFavs.includes(movieId));
  };

  return (
    <div className="favorite-wrapper">
      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        onClick={toggleFavorite}
      >
        {isFavorite ? "★" : "☆"}
      </button>
      {showWarning && (
        <span className="favorite-warning">
          ⚠️ Tens de fazer login para adicionar aos favoritos!
        </span>
      )}
    </div>
  );
};

export default FavoriteButton;
