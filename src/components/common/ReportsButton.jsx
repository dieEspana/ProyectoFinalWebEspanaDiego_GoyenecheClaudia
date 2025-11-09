import React from 'react';
import { Link } from 'react-router-dom';

const ReportsButton = () => {
  return (
    <Link to="/reports" className="reports-btn">
      <i className="fas fa-chart-bar"></i>
      <span>Reportes</span>
    </Link>
  );
};

export default ReportsButton;