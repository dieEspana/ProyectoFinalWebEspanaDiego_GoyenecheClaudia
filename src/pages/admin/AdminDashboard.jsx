import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/UserService';
import NewsService from '../../services/NewsService';
import CategoryService from '../../services/CategoryService';
import NotificationService from '../../services/NotificationService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    activeUsers: 0,
    monthlyNews: 0,
    userNews: 0,
    pendingNews: 0,
    totalNews: 0,
    totalCategories: 0,
    unreadNotifications: 0
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userProfile = await UserService.getUserProfile(user.uid);
          setUserData(userProfile);
        } catch (error) {
          console.error('Error cargando datos del usuario:', error);
        }
      }
    };

    loadUserData();
  }, [user]);

  const userRole = userData?.role || user?.role;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener usuarios activos
        const activeUsers = await UserService.getActiveUsersCount();
        
        // Obtener noticias del mes
        const monthlyNews = await NewsService.getMonthlyNewsCount();
        
        // Obtener noticias del usuario actual
        const userNews = user ? await NewsService.getNewsByAuthor(user.uid) : [];
        
        // Obtener todas las noticias para estadísticas
        const allNews = await NewsService.getAllNews();
        
        // Obtener noticias pendientes (solo para editores)
        let pendingNews = 0;
        if (userRole === 'editor') {
          const pending = await NewsService.getNewsByStatus('terminado');
          pendingNews = pending.length;
        }

        // Obtener categorías
        const categories = await CategoryService.getAllCategories();

        // Obtener notificaciones no leídas
        const unreadNotifications = await NotificationService.getUnreadCount(user.uid, userRole);

        // Obtener noticias recientes (últimas 5)
        const recent = allNews.slice(0, 5);

        setStats({
          activeUsers,
          monthlyNews,
          userNews: userNews.length,
          pendingNews,
          totalNews: allNews.length,
          totalCategories: categories.length,
          unreadNotifications
        });

        setRecentNews(recent);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, userRole]);

  const reporterStats = [
    { 
      label: 'Mis Noticias', 
      value: stats.userNews, 
      color: 'from-blue-500 to-blue-600',
      icon: '📝',
      description: 'Total de tus noticias'
    },
    { 
      label: 'En Edición', 
      value: stats.userNews > 0 ? Math.floor(stats.userNews * 0.6) : 0, 
      color: 'from-yellow-500 to-yellow-600',
      icon: '✏️',
      description: 'En desarrollo'
    },
    { 
      label: 'En Revisión', 
      value: stats.userNews > 0 ? Math.floor(stats.userNews * 0.3) : 0, 
      color: 'from-orange-500 to-orange-600',
      icon: '⏳',
      description: 'Pendientes de aprobación'
    },
    { 
      label: 'Publicadas', 
      value: stats.userNews > 0 ? Math.floor(stats.userNews * 0.1) : 0, 
      color: 'from-green-500 to-green-600',
      icon: '🚀',
      description: 'Aprobadas y publicadas'
    }
  ];

  const editorStats = [
    { 
      label: 'Noticias Pendientes', 
      value: stats.pendingNews, 
      color: 'from-orange-500 to-orange-600',
      icon: '👁️',
      description: 'Esperando revisión'
    },
    { 
      label: 'Notificaciones', 
      value: stats.unreadNotifications, 
      color: 'from-red-500 to-red-600',
      icon: '🔔',
      description: 'Pendientes de revisar'
    },
    { 
      label: 'Noticias del Mes', 
      value: stats.monthlyNews, 
      color: 'from-green-500 to-green-600',
      icon: '📈',
      description: 'Total publicadas este mes'
    },
    { 
      label: 'Usuarios Activos', 
      value: stats.activeUsers, 
      color: 'from-purple-500 to-purple-600',
      icon: '👥',
      description: 'Usuarios registrados'
    },
    { 
      label: 'Total Noticias', 
      value: stats.totalNews, 
      color: 'from-blue-500 to-blue-600',
      icon: '📰',
      description: 'En el sistema'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      edicion: { label: 'En Edición', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      terminado: { label: 'En Revisión', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      publicado: { label: 'Publicado', class: 'bg-green-100 text-green-800 border-green-200' },
      desactivado: { label: 'Desactivado', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800 border-gray-200' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Cargando Dashboard</h3>
          <p className="text-gray-600">Preparando toda la información...</p>
        </div>
      </div>
    );
  }

  const currentStats = userRole === 'reporter' ? reporterStats : editorStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Superior Responsivo */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">News CMS</h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>

            {/* User Info - Solo en desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole || 'Cargando...'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white animate-slideDown">
              {/* User Info en móvil */}
              <div className="flex items-center space-x-3 px-4 py-3 mb-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName}</p>
                  <p className="text-sm text-gray-600 capitalize">{userRole || 'Cargando...'} • {user?.email}</p>
                </div>
              </div>

              {/* Navegación móvil */}
              <nav className="space-y-2">
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/admin/news" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📰</span>
                  <span>Noticias</span>
                </Link>
                
                <Link 
                  to="/admin/reports" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📈</span>
                  <span>Reportes</span>
                </Link>

                <Link 
                  to="/admin/profile" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">👤</span>
                  <span>Mi Perfil</span>
                </Link>

                {userRole === 'editor' && (
                  <Link 
                    to="/admin/categories" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">🗂️</span>
                    <span>Categorías</span>
                  </Link>
                )}
              </nav>

              {/* Acciones rápidas en móvil */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/admin/news/create" 
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📝 Crear
                  </Link>
                  <Link 
                    to="/admin/reports" 
                    className="bg-green-500 text-white px-3 py-2 rounded-lg text-center text-sm font-medium hover:bg-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📊 Reportes
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Navigation - Solo se muestra en desktop */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 h-12">
            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/news" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
            >
              Noticias
            </Link>
            <Link 
              to="/admin/reports" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
            >
              Reportes
            </Link>
            {userRole === 'editor' && (
              <Link 
                to="/admin/categories" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
              >
                Categorías
              </Link>
            )}
            <Link 
              to="/admin/profile" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Welcome Section */}
          <section className="text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Administración</span>
              </h1>
              
              <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 inline-block max-w-md w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-lg text-gray-700 mb-2">
                      👋 Bienvenido, <span className="font-bold text-blue-600">{user?.displayName}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        {userRole === 'reporter' ? '📝 Reportero' : '👨‍💼 Editor'}
                      </span>
                      <span className="text-gray-500 hidden sm:block">•</span>
                      <span className="text-gray-600 font-medium text-sm">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {currentStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 bg-gray-50 rounded-xl p-2 md:p-3 text-center font-medium">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Quick Actions & Recent News */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <span className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-3 text-sm md:text-base">🚀</span>
                  Acciones Rápidas
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {userRole === 'reporter' && (
                    <>
                      <Link 
                        to="/admin/news/create" 
                        className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-5 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                            📝
                          </div>
                          <div>
                            <div className="font-bold text-blue-900 text-base md:text-lg">Crear Noticia</div>
                            <div className="text-xs md:text-sm text-blue-700">Redactar nueva publicación</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/admin/news" 
                        className="group bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-5 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                            📋
                          </div>
                          <div>
                            <div className="font-bold text-green-900 text-base md:text-lg">Mis Noticias</div>
                            <div className="text-xs md:text-sm text-green-700">Gestionar publicaciones</div>
                          </div>
                        </div>
                      </Link>
                    </>
                  )}

                  {/* Common Actions */}
                  <Link 
                    to="/admin/profile" 
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-5 rounded-2xl border-2 border-gray-200 hover:border-gray-400 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                        👤
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base md:text-lg">Mi Perfil</div>
                        <div className="text-xs md:text-sm text-gray-700">Actualizar información</div>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    to="/admin/reports" 
                    className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 md:p-5 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                        📊
                      </div>
                      <div>
                        <div className="font-bold text-indigo-900 text-base md:text-lg">Reportes</div>
                        <div className="text-xs md:text-sm text-indigo-700">Ver estadísticas</div>
                      </div>
                    </div>
                  </Link>
                  
                  {userRole === 'editor' && (
                    <>
                      <Link 
                        to="/admin/news" 
                        className="group bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-5 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                            👁️
                          </div>
                          <div>
                            <div className="font-bold text-orange-900 text-base md:text-lg">Revisar Noticias</div>
                            <div className="text-xs md:text-sm text-orange-700">{stats.pendingNews} pendientes</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/admin/categories" 
                        className="group bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-5 rounded-2xl border-2 border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-base md:text-lg">
                            🗂️
                          </div>
                          <div>
                            <div className="font-bold text-purple-900 text-base md:text-lg">Gestionar Categorías</div>
                            <div className="text-xs md:text-sm text-purple-700">{stats.totalCategories} activas</div>
                          </div>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Recent News */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <span className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-3 text-sm md:text-base">📰</span>
                  Noticias Recientes
                </h3>
                
                {recentNews.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="text-5xl md:text-6xl mb-4">📭</div>
                    <h4 className="text-lg md:text-xl font-bold text-gray-700 mb-2">No hay noticias recientes</h4>
                    <p className="text-gray-500 mb-6">Las noticias creadas aparecerán aquí</p>
                    <Link 
                      to="/admin/news/create" 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 md:px-8 py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                    >
                      Crear Primera Noticia
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {recentNews.map((newsItem) => (
                      <div 
                        key={newsItem.id} 
                        className="group bg-gradient-to-r from-gray-50 to-white p-3 md:p-4 rounded-2xl border border-gray-200 hover:border-blue-300 hover:from-blue-50 hover:to-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusBadge(newsItem.status)}
                              <span className="text-xs text-gray-500 font-medium">
                                {formatDate(newsItem.createdAt)}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-base md:text-lg mb-1 line-clamp-1">
                              {newsItem.title}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {newsItem.subtitle}
                            </p>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-2">
                              {newsItem.category}
                            </div>
                            <div className="text-xs text-gray-500">por {newsItem.authorName}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Link 
                      to="/admin/news" 
                      className="block text-center bg-gray-100 text-gray-700 font-bold py-3 md:py-4 rounded-2xl hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                    >
                      Ver todas las noticias →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* System Info */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <span className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-3 text-sm md:text-base">📈</span>
                  Información del Sistema
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  {[
                    { label: 'Estado del Sistema', value: '✅ Operativo', color: 'text-green-600' },
                    { label: 'Usuarios Activos', value: stats.activeUsers, color: 'text-blue-600' },
                    { label: 'Noticias del Mes', value: stats.monthlyNews, color: 'text-green-600' },
                    { label: 'Total Noticias', value: stats.totalNews, color: 'text-purple-600' },
                    { label: 'Categorías', value: stats.totalCategories, color: 'text-orange-600' },
                    { label: 'Notificaciones', value: `${stats.unreadNotifications} no leídas`, color: stats.unreadNotifications > 0 ? 'text-red-600' : 'text-green-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <span className="text-gray-700 font-medium text-sm md:text-base">{item.label}</span>
                      <span className={`font-bold ${item.color} text-sm md:text-base`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Info */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <span className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-3 text-sm md:text-base">🎯</span>
                  Tu Rol: {userRole === 'reporter' ? 'Reportero' : 'Editor'}
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  {(userRole === 'reporter' ? [
                    { icon: '✓', title: 'Crear noticias', desc: 'Redactar y diseñar contenido', color: 'blue' },
                    { icon: '✓', title: 'Editar tus noticias', desc: 'Modificar contenido en desarrollo', color: 'green' },
                    { icon: '⏳', title: 'Enviar para revisión', desc: 'Solicitar aprobación del editor', color: 'yellow' },
                    { icon: '🔔', title: 'Recibir notificaciones', desc: 'Ser notificado de publicaciones', color: 'purple' }
                  ] : [
                    { icon: '✓', title: 'Revisar noticias', desc: 'Aprobar o rechazar contenido', color: 'blue' },
                    { icon: '✓', title: 'Publicar noticias', desc: 'Hacer visible al público', color: 'green' },
                    { icon: '✓', title: 'Gestionar categorías', desc: 'Administrar secciones', color: 'purple' },
                    { icon: '✓', title: 'Eliminar contenido', desc: 'Remover noticias inapropiadas', color: 'red' },
                    { icon: '🔔', title: 'Recibir notificaciones', desc: 'Alertas de nuevas noticias', color: 'orange' }
                  ]).map((item, index) => (
                    <div key={index} className={`flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-${item.color}-50 rounded-xl border border-${item.color}-200`}>
                      <span className={`text-${item.color}-600 font-bold mt-1 text-sm`}>{item.icon}</span>
                      <div>
                        <div className={`font-bold text-${item.color}-900 text-sm md:text-base`}>{item.title}</div>
                        <div className={`text-xs md:text-sm text-${item.color}-700`}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-4 md:p-6 text-white shadow-2xl">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
                  <span className="mr-2 md:mr-3">💡</span>
                  Tips Rápidos
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    { icon: '🎯', text: 'Usa títulos claros y descriptivos' },
                    { icon: '📷', text: 'Incluye imágenes de calidad' },
                    { icon: '🔔', text: 'Revisa notificaciones regularmente' },
                    { icon: '⏱️', text: 'Mantén un flujo constante de contenido' }
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 md:space-x-3">
                      <span className="text-sm">{tip.icon}</span>
                      <span className="text-blue-100 text-sm md:text-base">{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
              <span className="mr-2 md:mr-3">🚀</span>
              Próximos Pasos Recomendados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { 
                  number: '1', 
                  title: 'Explorar Funciones', 
                  desc: 'Conoce todas las herramientas disponibles' 
                },
                { 
                  number: '2', 
                  title: userRole === 'reporter' ? 'Crear Noticia' : 'Revisar Pendientes',
                  desc: userRole === 'reporter' ? 'Comienza con tu primera publicación' : 'Revisa noticias en espera'
                },
                { 
                  number: '3', 
                  title: userRole === 'editor' ? 'Gestionar Categorías' : 'Organizar Contenido',
                  desc: userRole === 'editor' ? 'Organiza las secciones del sitio' : 'Clasifica tus noticias correctamente'
                }
              ].map((step, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300">
                  <div className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{step.number}</div>
                  <div className="font-bold text-base md:text-lg mb-1 md:mb-2">{step.title}</div>
                  <div className="text-green-100 text-xs md:text-sm">{step.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;