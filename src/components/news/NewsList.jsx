import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsService from '../../services/NewsService';

const NewsList = () => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadNews();
  }, [user, filter]);

  const loadNews = async () => {
    try {
      console.log('🚀 INICIANDO CARGA DE NOTICIAS...');
      setLoading(true);
      setError('');
      
      let newsData = [];

      if (user.role === 'reporter') {
        console.log('🎯 Modo REPORTERO');
        newsData = await NewsService.getNewsByAuthor(user.uid);
      } else {
        console.log('🎯 Modo EDITOR');
        newsData = await NewsService.getAllNews();
      }

      console.log('📦 Noticias recibidas:', newsData);
      if (filter !== 'all') {
        newsData = newsData.filter(item => item.status === filter);
      }

      console.log('✅ Noticias finales:', newsData.length);
      setNews(newsData);

    } catch (error) {
      console.error('❌ Error cargando noticias:', error);
      setError('Error al cargar las noticias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      edicion: { label: 'En Edición', class: 'badge-edicion', icon: '✏️' },
      terminado: { label: 'En Revisión', class: 'badge-terminado', icon: '⏳' },
      publicado: { label: 'Publicado', class: 'badge-publicado', icon: '🚀' },
      desactivado: { label: 'Desactivado', class: 'badge-desactivado', icon: '⏸️' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-edicion', icon: '❓' };
    return (
      <span className={`badge ${config.class} flex items-center space-x-1 text-xs sm:text-sm px-3 py-1 rounded-full font-medium`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      edicion: 'La noticia está en desarrollo y puede ser editada',
      terminado: 'La noticia está pendiente de revisión por el editor',
      publicado: 'La noticia está visible para el público',
      desactivado: 'La noticia no está visible para el público'
    };
    return descriptions[status] || '';
  };

const getStatusActions = (newsItem) => {
  // Reportero solo puede editar sus propias noticias
  if (user.role === 'reporter' && newsItem.authorId === user.uid) {
    return (
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Link 
          to={`/admin/news/edit/${newsItem.id}`}
          className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <span>✏️</span>
          <span className="sm:inline">Editar</span> {/* CAMBIADO */}
        </Link>
        
        {/* Solo puede enviar a revisión si está en edición */}
        {newsItem.status === 'edicion' && (
          <button 
            onClick={() => handleStatusChange(newsItem.id, 'terminado', newsItem.title)}
            disabled={actionLoading === newsItem.id}
            className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === newsItem.id ? (
              <>
                <div className="w-3 h-3 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <span className="sm:inline">Enviando...</span> {/* CAMBIADO */}
              </>
            ) : (
              <>
                <span>✅</span>
                <span className="sm:inline">Enviar</span> {/* CAMBIADO */}
              </>
            )}
          </button>
        )}
        
        {/* Solo puede volver a edición si está en revisión */}
        {newsItem.status === 'terminado' && (
          <button 
            onClick={() => handleStatusChange(newsItem.id, 'edicion', newsItem.title)}
            disabled={actionLoading === newsItem.id}
            className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-yellow-50 hover:bg-yellow-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === newsItem.id ? (
              <>
                <div className="w-3 h-3 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <span className="sm:inline">Volviendo...</span> {/* CAMBIADO */}
              </>
            ) : (
              <>
                <span>↩️</span>
                <span className="sm:inline">Volver</span> {/* CAMBIADO */}
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  // Editor puede gestionar todas las noticias
  if (user.role === 'editor') {
    return (
      <div className="flex flex-col space-y-2">
        <Link 
          to={`/admin/news/edit/${newsItem.id}`}
          className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <span>👁️</span>
          <span className="sm:inline">Revisar</span> {/* CAMBIADO */}
        </Link>
        
        {/* Publicar noticias en revisión */}
        {newsItem.status === 'terminado' && (
          <button 
            onClick={() => handleStatusChange(newsItem.id, 'publicado', newsItem.title)}
            disabled={actionLoading === newsItem.id}
            className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === newsItem.id ? (
              <>
                <div className="w-3 h-3 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <span className="sm:inline">Publicando...</span> {/* CAMBIADO */}
              </>
            ) : (
              <>
                <span>🚀</span>
                <span className="sm:inline">Publicar</span> {/* CAMBIADO */}
              </>
            )}
          </button>
        )}
        
        {/* Desactivar noticias publicadas */}
        {newsItem.status === 'publicado' && (
          <button 
            onClick={() => handleStatusChange(newsItem.id, 'desactivado', newsItem.title)}
            disabled={actionLoading === newsItem.id}
            className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === newsItem.id ? (
              <>
                <div className="w-3 h-3 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <span className="sm:inline">Desactivando...</span> {/* CAMBIADO */}
              </>
            ) : (
              <>
                <span>⏸️</span>
                <span className="sm:inline">Desactivar</span> {/* CAMBIADO */}
              </>
            )}
          </button>
        )}
        
        {/* Reactivar noticias desactivadas */}
        {newsItem.status === 'desactivado' && (
          <button 
            onClick={() => handleStatusChange(newsItem.id, 'publicado', newsItem.title)}
            disabled={actionLoading === newsItem.id}
            className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === newsItem.id ? (
              <>
                <div className="w-3 h-3 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <span className="sm:inline">Reactivando...</span> {/* CAMBIADO */}
              </>
            ) : (
              <>
                <span>🔄</span>
                <span className="sm:inline">Reactivar</span> {/* CAMBIADO */}
              </>
            )}
          </button>
        )}

        {/* Eliminar noticia (solo editor) */}
        <button 
          onClick={() => handleDeleteNews(newsItem.id, newsItem.title)}
          disabled={actionLoading === newsItem.id}
          className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span>🗑️</span>
          <span className="sm:inline">Eliminar</span> {/* CAMBIADO */}
        </button>
      </div>
    );
  }

  return null;
};

  const handleStatusChange = async (newsId, newStatus, newsTitle) => {
    try {
      setActionLoading(newsId);
      
      const statusMessages = {
        edicion: 'volvió a edición',
        terminado: 'envió a revisión',
        publicado: 'publicó',
        desactivado: 'desactivó'
      };

      console.log(`🔄 Cambiando estado: ${newsId} → ${newStatus}`);
      await NewsService.changeNewsStatus(newsId, newStatus);
      
      // Mostrar mensaje de éxito
      setError(`✅ Noticia "${newsTitle}" ${statusMessages[newStatus]} exitosamente`);
      
      // Recargar las noticias después del cambio
      setTimeout(() => {
        loadNews();
        setError('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      setError('Error al cambiar el estado: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNews = async (newsId, newsTitle) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la noticia "${newsTitle}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setActionLoading(newsId);
      console.log(`🗑️ Eliminando noticia: ${newsId}`);
      await NewsService.deleteNews(newsId);
      
      setError(`✅ Noticia "${newsTitle}" eliminada exitosamente`);
      
      // Recargar las noticias después de eliminar
      setTimeout(() => {
        loadNews();
        setError('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error eliminando noticia:', error);
      setError('Error al eliminar la noticia: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return 'Fecha inválida';
  };

  const getNewsStats = () => {
    const stats = {
      total: news.length,
      edicion: news.filter(n => n.status === 'edicion').length,
      terminado: news.filter(n => n.status === 'terminado').length,
      publicado: news.filter(n => n.status === 'publicado').length,
      desactivado: news.filter(n => n.status === 'desactivado').length
    };
    return stats;
  };

  const stats = getNewsStats();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Cargando Noticias</h3>
          <p className="text-gray-600">Preparando todas las publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {user.role === 'reporter' ? '📝 Mis Noticias' : '📰 Gestión de Noticias'}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {user.role === 'reporter' 
                ? 'Gestiona y revisa tus publicaciones' 
                : 'Administra todas las noticias del sistema'
              }
            </p>
          </div>
          
          <Link 
            to="/admin/news/create" 
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-center"
          >
            📝 Crear Noticia
          </Link>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 shadow-lg border border-yellow-200 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{stats.edicion}</div>
            <div className="text-sm text-yellow-600 font-medium">En Edición</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 shadow-lg border border-blue-200 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.terminado}</div>
            <div className="text-sm text-blue-600 font-medium">En Revisión</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 shadow-lg border border-green-200 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">{stats.publicado}</div>
            <div className="text-sm text-green-600 font-medium">Publicadas</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 shadow-lg border border-red-200 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-red-700">{stats.desactivado}</div>
            <div className="text-sm text-red-600 font-medium">Desactivadas</div>
          </div>
        </div>

        {error && (
          <div className={`p-4 rounded-2xl border-2 ${
            error.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          } transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{error.includes('✅') ? '✅' : '❌'}</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Filtros */}
   {/* Filtros */}
<div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
    <button
      onClick={() => setFilter('all')}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        filter === 'all' 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
      }`}
    >
      <span>📋</span>
      <span className="hidden sm:inline">Todas</span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {stats.total}
      </span>
    </button>
    <button
      onClick={() => setFilter('edicion')}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        filter === 'edicion' 
          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
      }`}
    >
      <span>✏️</span>
      <span className="hidden sm:inline">En Edición</span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {stats.edicion}
      </span>
    </button>
    <button
      onClick={() => setFilter('terminado')}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        filter === 'terminado' 
          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
      }`}
    >
      <span>⏳</span>
      <span className="hidden sm:inline">En Revisión</span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {stats.terminado}
      </span>
    </button>
    <button
      onClick={() => setFilter('publicado')}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        filter === 'publicado' 
          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
      }`}
    >
      <span>🚀</span>
      <span className="hidden sm:inline">Publicadas</span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {stats.publicado}
      </span>
    </button>
    <button
      onClick={() => setFilter('desactivado')}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        filter === 'desactivado' 
          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg transform scale-105' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
      }`}
    >
      <span>⏸️</span>
      <span 
        className="hidden sm:inline" 
        style={{ 
          color: filter === 'desactivado' ? 'white' : 'black',
          backgroundColor: 'transparent'
        }}
      >
        Desactivadas
      </span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {stats.desactivado}
      </span>
    </button>
  </div>

</div>

        {/* Información del Filtro */}
        {filter !== 'all' && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <p className="font-semibold">
                  Mostrando <strong>{news.length}</strong> noticias en estado: <strong>{filter}</strong>
                </p>
                <p className="text-blue-100 text-sm opacity-90">
                  {getStatusDescription(filter)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Noticias */}
        {news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-8xl mb-6">📰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {filter !== 'all' ? `No hay noticias en estado "${filter}"` : 'No hay noticias'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {user.role === 'reporter' 
                ? 'Comienza creando tu primera noticia para verla aquí' 
                : 'Los reporteros aún no han creado noticias en el sistema'
              }
            </p>
            {user.role === 'reporter' && (
              <Link 
                to="/admin/news/create" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-lg"
              >
                📝 Crear Primera Noticia
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {getStatusBadge(newsItem.status)}
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {formatDate(newsItem.createdAt)}
                      </span>
                      {user.role === 'editor' && (
                        <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                          por {newsItem.authorName}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {newsItem.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-lg">
                      {newsItem.subtitle}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        {getStatusDescription(newsItem.status)}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-2 rounded-xl flex items-center space-x-2 border border-gray-200">
                        <span>📁</span>
                        <span className="font-medium">{newsItem.category}</span>
                      </span>
                      {newsItem.imageUrl && (
                        <span className="text-green-600 bg-green-50 px-3 py-2 rounded-xl flex items-center space-x-2 border border-green-200">
                          <span>🖼️</span>
                          <span className="font-medium">Con imagen</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                        ID: {newsItem.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 min-w-[140px]">
                    {getStatusActions(newsItem)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para recargar */}
        {news.length > 0 && (
          <div className="text-center">
            <button
              onClick={loadNews}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold flex items-center space-x-2 mx-auto"
            >
              <span>🔄</span>
              <span>Actualizar Lista</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;