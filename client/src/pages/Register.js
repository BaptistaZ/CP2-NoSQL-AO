import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";
import { AuthContext } from "../components/AuthContext"; // ✅

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
    <div className="auth-container">
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
      </div>
    </div>
  );
};

export default Register;
