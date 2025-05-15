import React, { useState, useEffect } from "react";
import "../styles/FavoriteButton.css";

const FavoriteButton = ({ movieId, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser) return;

    const favs = JSON.parse(localStorage.getItem(`favorites_${storedUser.id}`)) || [];
    setIsFavorite(favs.includes(movieId));
  }, [movieId]);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    if (!user) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const key = `favorites_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(key)) || [];

    let updatedFavs;
    if (favs.includes(movieId)) {
      updatedFavs = favs.filter((id) => id !== movieId);
    } else {
      updatedFavs = [...favs, movieId];
    }

    localStorage.setItem(key, JSON.stringify(updatedFavs));
    setIsFavorite(updatedFavs.includes(movieId));

    if (onToggle) onToggle(); 
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
          ⚠️ You have to log in to add to favorites!
        </span>
      )}
    </div>
  );
};

export default FavoriteButton;
