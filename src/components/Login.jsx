import React, { useState } from "react";
import apiClient from "../apiClient";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.post("/login", { username, password });
      const token = response.data.token;
      onLogin(token);
    } catch (err) {
      setError("Credenciales inválidas o error en el servidor.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formWrapperStyle}>
        <h2 style={titleStyle}>Iniciar Sesión</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f2f5",
  width: "100vw",
  margin: 0,
  padding: 0,
};

const formWrapperStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "2rem",
  backgroundColor: "#fff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "1.5rem",
  fontFamily: "Arial, sans-serif",
};

const errorStyle = {
  color: "red",
  marginBottom: "1rem",
  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const formGroupStyle = {
  marginBottom: "1rem",
  textAlign: "left",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontFamily: "Arial, sans-serif",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontFamily: "Arial, sans-serif",
};

const buttonStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "Arial, sans-serif",
};

export default Login;
