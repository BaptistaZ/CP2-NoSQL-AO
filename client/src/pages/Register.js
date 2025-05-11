import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

const Register = () => {
  const history = useHistory();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      history.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erro no registo");
    }
  };

  return (
    <>
      <div className="auth-overlay" />
      <div className="auth-container fixed-center">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h1>🍿 Junta-te ao MLFlix</h1>
            <p>
              Cria a tua conta e mergulha no universo do cinema com milhares de
              títulos.
            </p>
          </div>
          <div className="auth-card">
            <h2>Registar</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nome"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <button type="submit">Criar Conta</button>
            </form>

            <button className="back-button" onClick={() => history.push("/")}>
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
