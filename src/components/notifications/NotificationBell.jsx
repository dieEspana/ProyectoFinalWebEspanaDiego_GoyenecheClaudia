// src/components/notifications/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationService from '../../services/NotificationService';

const NotificationBell = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Cargar conteo inicial
    const loadUnreadCount = async () => {
      try {
        const count = await NotificationService.getUnreadCount(user.uid, user.role);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
        setUnreadCount(0);
      }
    };

    loadUnreadCount();

    // Temporalmente comentamos las suscripciones en tiempo real hasta que funcionen
    /*
    try {
      const unsubscribe = NotificationService.subscribeToUnreadCount(
        user.uid, 
        user.role, 
        setUnreadCount
      );
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
    }
    */
  }, [user]);

  return (
    <div className="relative">
      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;