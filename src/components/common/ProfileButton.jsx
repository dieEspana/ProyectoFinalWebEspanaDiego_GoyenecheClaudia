import React from 'react';
import { Link } from 'react-router-dom';

const ProfileButton = () => {
  return (
    <Link to="/profile" className="profile-btn">
      <i className="fas fa-user"></i>
      <span>Mi Perfil</span>
    </Link>
  );
};

export default ProfileButton;