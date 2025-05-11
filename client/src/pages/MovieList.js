import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/MovieList.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { getFavorites, toggleFavorite } from "../services/favoritesService.js";

const MovieList = ({
  searchQuery = "",
  selectedGenre = "",
  showFavorites = "",
  logoutTrigger = false,
}) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const limit = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          setFavorites(getFavorites(storedUser.id));
        }

        if (showFavorites && storedUser) {
          const favIds = getFavorites(storedUser.id);
          const promises = favIds.map((id) => api.get(`/movies/${id}`));
          const results = await Promise.all(promises);
          const favMovies = results.map((res) => res.data);
          setMovies(favMovies);
          setTotalPages(1);
        } else {
          const res = await api.get("/movies", {
            params: {
              page: currentPage,
              limit,
              search: searchQuery,
              genre: selectedGenre,
            },
          });
          setMovies(res.data.movies);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchQuery, selectedGenre, showFavorites, logoutTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre]);

  const handleImageError = (e) => {
    e.target.src =
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    e.target.style.objectFit = "contain";
    e.target.style.backgroundColor = "#111";
  };

  const handleToggleFavorite = (movieId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Tens de fazer login para adicionar aos favoritos.");
      return;
    }

    const updated = toggleFavorite(storedUser.id, movieId);
    setFavorites(updated);

    if (showFavorites) {
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== movieId)
      );
    }
  };

  return (
    <div className="movie-list">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {movies.length === 0 ? (
            <p className="no-results">Nenhum resultado encontrado.</p>
          ) : (
            <>
              <div className="search-summary">
                {searchQuery || selectedGenre ? (
                  <p>
                    🔍 Resultados para:{" "}
                    {searchQuery && <strong>"{searchQuery}"</strong>}
                    {searchQuery && selectedGenre && " no género "}
                    {selectedGenre && <strong>{selectedGenre}</strong>}
                  </p>
                ) : (
                  <div className="movies-header">
                    <h2>🎬 Movies</h2>
                    <p>A mostrar todos os filmes</p>
                  </div>
                )}
              </div>

              <div
                className={`movie-grid ${
                  showFavorites ? "favorites-grid" : ""
                }`}
              >
                {movies.map((movie) => (
                  <div key={movie._id} className="movie-card-image-only">
                    <img
                      src={
                        movie.poster ||
                        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                      }
                      alt={movie.title || "Filme sem título"}
                      onError={handleImageError}
                      onClick={() =>
                        (window.location.href = `/movies/${movie._id}`)
                      }
                    />
                    <button
                      className="favorite-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(movie._id);
                      }}
                      title="Adicionar aos favoritos"
                    >
                      {favorites.includes(movie._id) ? "⭐" : "☆"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="pagination">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>
                    « Prev
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                  )
                  .map((page, i, arr) => (
                    <React.Fragment key={page}>
                      {i > 0 && page - arr[i - 1] > 1 && (
                        <span className="dots">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "active" : ""}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>
                    Next »
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;
