import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";

const AppContent = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";
  const isDetailPage = location.pathname.startsWith("/movies/");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [logoutTrigger, setLogoutTrigger] = useState(false);

  return (
    <div className="app-container">
      {!isAuthPage && !isProfilePage && (
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          setLogoutTrigger={setLogoutTrigger}
        />
      )}

      {isDetailPage ? (
        <Switch>
          <Route path="/movies/:id" component={MovieDetail} />
        </Switch>
      ) : (
        <>
          <div className={`main-content ${isAuthPage ? "blurred" : ""}`}>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <MovieList
                    searchQuery={searchQuery}
                    selectedGenre={selectedGenre}
                    showFavorites={showFavorites}
                    logoutTrigger={logoutTrigger}
                  />
                )}
              />
              <Route path="/profile" component={Profile} />
            </Switch>
          </div>

          {isAuthPage && <div className="auth-overlay" />}

          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
