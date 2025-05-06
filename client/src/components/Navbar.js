import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../styles/Navbar.css';
import { AuthContext } from './AuthContext';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  showFavorites,
  setShowFavorites
}) => {
  const history = useHistory();
  const [genres, setGenres] = useState([]);
  const { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    setGenres([
      'Action', 'Drama', 'Comedy', 'Short', 'Crime',
      'Western', 'Animation', 'Biography', 'Romance'
    ]);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
  };

  const handleLogout = () => {
    logoutUser();
    history.push('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎬 MLFlix</Link>

      <div className="navbar-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          disabled={showFavorites}
        />
        <select
          value={selectedGenre}
          onChange={(e) =>
            setSelectedGenre(e.target.value === 'all' ? '' : e.target.value)
          }
          className="genre-select"
          disabled={showFavorites}
        >
          <option value="all">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <button className="clear-button" onClick={handleClearFilters} disabled={showFavorites}>
          Limpar Filtros
        </button>
        <button className="fav-toggle-button" onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? "Ver Todos" : "Ver Favoritos"}
        </button>
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <span>👋 Olá, {user.name}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Registar</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
