import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">N</span>
              </div>
              <span className="text-white text-xl font-bold hidden sm:block">NewsCMS</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-4">
                    {/* Campana de Notificaciones */}
                    <NotificationBell />
                    
                    <span className="text-white text-sm bg-blue-500 px-3 py-1 rounded-full">
                      👋 Hola, {user.displayName}
                    </span>
                    <Link 
                      to="/admin" 
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        location.pathname === '/admin' 
                          ? 'bg-blue-700 text-white' 
                          : 'text-blue-100 hover:bg-blue-700'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-500 bg-blue-600">
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-blue-500 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.displayName}</p>
                      <p className="text-blue-200 text-sm">{user.email}</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>
                    
                    {/* Notifications in Mobile */}
                    <div className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
                      <NotificationBell mobile={true} />
                      <span>Notificaciones</span>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 text-left"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <span>🔐</span>
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-3 px-4 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <span>✨</span>
                    <span>Registrarse</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 NewsCMS - Sistema de Gestión de Noticias</p>
            <p className="text-sm text-gray-500 mt-1">
              Desarrollado con React + Firebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;