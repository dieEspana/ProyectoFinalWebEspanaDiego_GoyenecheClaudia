import React from 'react';
import { Link } from 'react-router-dom';

const MyNews = () => {
  return (
    <div className="container">
      <div className="top-header">
        <h1 className="app-title">Sistema de Noticias</h1>
        <div className="header-actions">
          <Link to="/reports" className="reports-btn">
            <i className="fas fa-chart-bar"></i>
            <span>Reportes</span>
          </Link>
          <Link to="/profile" className="profile-btn">
            <i className="fas fa-user"></i>
            <span>Mi Perfil</span>
          </Link>
        </div>
      </div>
      
      <div className="page-content">
        <h1>📰 Mis Noticias</h1>
        <p>Lista de mis noticias en construcción...</p>
        <Link to="/" className="btn-primary mt-4">
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default MyNews;