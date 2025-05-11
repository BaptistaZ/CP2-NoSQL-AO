import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../components/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const history = useHistory();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      loginUser(res.data);
      history.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erro no login");
    }
  };

  return (
    <>
      <div className="auth-overlay" />
      <div className="auth-container fixed-center">
        <div className="auth-card">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Entrar</button>
          </form>
          <button className="back-button" onClick={() => history.push("/")}>← Voltar</button>
        </div>
      </div>
    </>
  );
};

export default Login;
