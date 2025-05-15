import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "./AuthContext";

const Navbar = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  showFavorites,
  setShowFavorites,
  setLogoutTrigger,
}) => {
  const history = useHistory();
  const [genres, setGenres] = useState([]);
  const { user, logoutUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setGenres([
      "Action",
      "Drama",
      "Comedy",
      "Short",
      "Crime",
      "Western",
      "Animation",
      "Biography",
      "Romance",
    ]);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
  };

  const handleLogout = () => {
    logoutUser();
    setLogoutTrigger((prev) => !prev);
    history.push("/");
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🎬 MLFlix
      </Link>

      {!location.pathname.startsWith("/movies/") && (
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
              setSelectedGenre(e.target.value === "all" ? "" : e.target.value)
            }
            className="genre-select"
            disabled={showFavorites}
          >
            <option value="all">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <button
            className="clear-button"
            onClick={handleClearFilters}
            disabled={showFavorites}
          >
            Clear Filters
          </button>
          {user && (
            <button
              className="fav-toggle-button"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? "See All" : "View Favorites"}
            </button>
          )}
        </div>
      )}

      <div className="navbar-auth">
        {user ? (
          <div
            className={showDropdown ? "user-dropdown open" : "user-dropdown"}
            onClick={toggleDropdown}
          >
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user.name}</span>
            </div>
            <div className="user-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="auth-link">
              Login
            </Link>
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
