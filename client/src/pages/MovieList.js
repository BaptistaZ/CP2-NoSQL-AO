import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import api from "../services/api";
import "../styles/MovieList.css";
import LoadingSpinner from "../components/LoadingSpinner";

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

  const limit = 10;

  // Buscar filmes com filtros e paginação
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      try {
        if (showFavorites) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (!storedUser) {
            setMovies([]);
            setTotalPages(1);
            return;
          }

          const favKey = `favorites_${storedUser.id}`;
          const favIds = JSON.parse(localStorage.getItem(favKey)) || [];

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

  return (
    <div className="movie-list">

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {movies.length === 0 ? (
            <p>Nenhum resultado encontrado.</p>
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

              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
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
