import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import Notification from '../models/Notification';

class NotificationService {
  constructor() {
    this.collectionName = 'notifications';
  }

  // Crear notificación
  async createNotification(notificationData) {
    try {
      const notificationWithTimestamp = {
        ...notificationData,
        read: false,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, this.collectionName), notificationWithTimestamp);
      console.log('🔔 Notificación creada:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creando notificación:', error);
      throw new Error('Error al crear notificación: ' + error.message);
    }
  }

  // Notificar a editores sobre nueva noticia
  async notifyEditorsNewNews(newsItem) {
    try {
      // Obtener todos los editores (en un sistema real, esto vendría de la base de datos)
      // Por ahora notificamos a todos los usuarios, pero en producción filtrarías por rol
      const message = `Nueva noticia pendiente de revisión: "${newsItem.title}"`;
      
      const notificationData = {
        type: 'new_news',
        title: '📝 Nueva Noticia Pendiente',
        message: message,
        userId: 'all_editors', // Para todos los editores
        relatedId: newsItem.id,
        forRole: 'editor'
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error notificando editores:', error);
    }
  }

  // Notificar a reportero sobre publicación
  async notifyReporterNewsPublished(newsItem) {
    try {
      const message = `Tu noticia "${newsItem.title}" ha sido publicada`;
      
      const notificationData = {
        type: 'news_published',
        title: '🚀 Noticia Publicada',
        message: message,
        userId: newsItem.authorId, // Al autor específico
        relatedId: newsItem.id
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error notificando reportero:', error);
    }
  }

  // Notificar cambio de estado
  async notifyStatusChange(newsItem, oldStatus, newStatus) {
    try {
      const statusMessages = {
        'edicion': 'en edición',
        'terminado': 'enviada a revisión', 
        'publicado': 'publicada',
        'desactivado': 'desactivada'
      };

      const message = `La noticia "${newsItem.title}" ha sido ${statusMessages[newStatus]}`;
      
      const notificationData = {
        type: 'status_changed',
        title: '🔄 Estado Cambiado',
        message: message,
        userId: newsItem.authorId,
        relatedId: newsItem.id,
        metadata: {
          oldStatus,
          newStatus
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error notificando cambio de estado:', error);
    }
  }

  // Obtener notificaciones del usuario
  async getUserNotifications(userId, userRole) {
    try {
      let q;
      
      if (userRole === 'editor') {
        // Editores ven notificaciones para editores y las suyas propias
        q = query(
          collection(db, this.collectionName),
          where('userId', 'in', [userId, 'all_editors']),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Reporteros ven solo sus notificaciones
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Notification.fromFirebase(doc));
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, this.collectionName, notificationId), {
        read: true
      });
      console.log('✅ Notificación marcada como leída:', notificationId);
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      throw new Error('Error al marcar notificación como leída: ' + error.message);
    }
  }

  // Marcar todas como leídas
  async markAllAsRead(userId, userRole) {
    try {
      const notifications = await this.getUserNotifications(userId, userRole);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const updatePromises = unreadNotifications.map(notification => 
        this.markAsRead(notification.id)
      );
      
      await Promise.all(updatePromises);
      console.log('✅ Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  }

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(db, this.collectionName, notificationId));
      console.log('🗑️ Notificación eliminada:', notificationId);
    } catch (error) {
      console.error('Error eliminando notificación:', error);
      throw new Error('Error al eliminar notificación: ' + error.message);
    }
  }

  // Escuchar notificaciones en tiempo real
  subscribeToUserNotifications(userId, userRole, callback) {
    let q;
    
    if (userRole === 'editor') {
      q = query(
        collection(db, this.collectionName),
        where('userId', 'in', [userId, 'all_editors']),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => Notification.fromFirebase(doc));
      callback(notifications);
    });
  }

  // Obtener contador de no leídas
  async getUnreadCount(userId, userRole) {
    try {
      const notifications = await this.getUserNotifications(userId, userRole);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error obteniendo contador de no leídas:', error);
      return 0;
    }
  }
}

export default new NotificationService();