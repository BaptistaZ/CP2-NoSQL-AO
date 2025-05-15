import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setFavoriteMovies([]);
        return;
      }

      const favKey = `favorites_${storedUser.id}`;
      const favIds = JSON.parse(localStorage.getItem(favKey)) || [];

      try {
        const promises = favIds.map((id) => api.get(`/movies/${id}`));
        const results = await Promise.all(promises);
        setFavoriteMovies(results.map((res) => res.data));
      } catch (err) {
        console.error("Error searching for favorite movies:", err);
      }
    };

    fetchFavorites();

    const handleFavoritesUpdated = () => fetchFavorites();
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <a href="/" className="back-button">
          ← Go Back
        </a>
        <h2 className="profile-title">👤 My Profile</h2>

        <div className="profile-box">
          <p>
            <strong>👤 Name:</strong> {user?.name}
          </p>
          <p>
            <strong>✉️ Email:</strong> {user?.email}
          </p>
        </div>

        {favoriteMovies.length > 0 && (
          <div className="favorite-section">
            <h3>🎞️ Favorite Movies</h3>
            <div className="favorites-grid">
              {favoriteMovies.map((movie) => (
                <img
                  key={movie._id}
                  src={
                    movie.poster ||
                    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                  }
                  alt={movie.title || "Untitled Movie"}
                  onClick={() =>
                    (window.location.href = `/movies/${movie._id}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
