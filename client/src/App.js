import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './components/AuthContext'; // ✅

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />

        <Switch>
          <Route path="/" exact render={() => (
            <MovieList
              searchQuery={searchQuery}
              selectedGenre={selectedGenre}
              showFavorites={showFavorites}
            />
          )} />
          <Route path="/movies/:id" component={MovieDetail} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
