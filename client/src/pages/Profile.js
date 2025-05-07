// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css"; 

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p className="loading-text">A carregar perfil...</p>;

  return (
    <div className="profile-page">
      <h2>👤 O meu Perfil</h2>
      <div className="profile-info">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
