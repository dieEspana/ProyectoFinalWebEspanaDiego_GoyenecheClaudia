import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

const NotificationService = {
  // ... (mantén todas las funciones anteriores)

  // Suscribirse a notificaciones en tiempo real (FUNCIÓN FALTANTE)
  subscribeToUserNotifications(userId, userRole, callback) {
    try {
      let notificationsQuery;
      
      if (userRole === 'editor') {
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('type', 'in', ['system', 'news_pending']),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      }
      
      return onSnapshot(notificationsQuery, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(notifications);
      });
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  },

  // Obtener notificaciones no leídas en tiempo real
  subscribeToUnreadCount(userId, userRole, callback) {
    try {
      let notificationsQuery;
      
      if (userRole === 'editor') {
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('isRead', '==', false),
          where('type', 'in', ['system', 'news_pending'])
        );
      } else {
        notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          where('isRead', '==', false)
        );
      }
      
      return onSnapshot(notificationsQuery, (snapshot) => {
        callback(snapshot.size);
      });
    } catch (error) {
      console.error('Error subscribing to unread count:', error);
      throw error;
    }
  }
};

export default NotificationService;