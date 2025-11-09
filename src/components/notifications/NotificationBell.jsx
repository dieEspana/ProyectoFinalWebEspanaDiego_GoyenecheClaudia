import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationService from '../../services/NotificationService';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Suscribirse a notificaciones en tiempo real
    const unsubscribe = NotificationService.subscribeToUserNotifications(
      user.uid,
      user.role,
      (notifs) => {
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setLoading(true);
      await NotificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marcando como leída:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await NotificationService.markAllAsRead(user.uid, user.role);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'new_news': '📝',
      'news_published': '🚀',
      'status_changed': '🔄'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="relative">
      {/* Campana de Notificaciones - Optimizada para móvil */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 sm:p-3 bg-white hover:bg-blue-50 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg hover:shadow-md sm:hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 active:scale-95"
      >
        <span className="text-xl sm:text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse shadow-sm sm:shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificaciones - Full responsivo */}
      {showDropdown && (
        <div className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 w-full max-h-[80vh] sm:max-h-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-sm sm:text-lg">🔔</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Notificaciones</h3>
                  <p className="text-blue-100 text-xs sm:text-sm opacity-90">
                    {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs sm:text-sm font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Marcar todas'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div className="max-h-[60vh] sm:max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl text-gray-400">🔕</span>
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">No hay notificaciones</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Te notificaremos cuando haya novedades</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group cursor-pointer touch-pan-y ${
                    !notification.read ? 'bg-blue-50 border-l-2 sm:border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 ${
                      !notification.read 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm sm:shadow-lg' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
                        <h4 className={`font-semibold text-xs sm:text-sm leading-tight flex-1 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="flex items-center mt-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-1 sm:mr-2 animate-pulse"></span>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            Nuevo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            <div className="text-center">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para móvil - Solo se muestra en móvil */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm sm:bg-opacity-10 sm:backdrop-blur-0 transition-all duration-300"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationBell;