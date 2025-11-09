import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import NotificationService from './NotificationService';

class NewsService {
  constructor() {
    this.collectionName = 'news';
  }

  // Crear noticia - CORREGIDO
  async createNews(newsData) {
    try {
      console.log('🔥 CREATE NEWS - Iniciando...');
      console.log('📦 Datos recibidos en createNews:', newsData);
      
      // Asegurarse de que tenemos los datos mínimos
      if (!newsData.title || !newsData.authorId) {
        throw new Error('Datos incompletos para crear noticia');
      }

      const newsWithTimestamps = {
        ...newsData,
        createdAt: newsData.createdAt || new Date(),
        updatedAt: newsData.updatedAt || new Date()
      };

      console.log('📝 Agregando documento a colección "news"...');
      
      const docRef = await addDoc(collection(db, this.collectionName), newsWithTimestamps);
      
      console.log('✅ DOCUMENTO CREADO EXITOSAMENTE EN FIRESTORE');
      console.log('🆕 ID del documento:', docRef.id);
      // Después de crear la noticia exitosamente, notificar a editores
try {
  await NotificationService.notifyEditorsNewNews({
    id: docRef.id,
    title: newsData.title,
    authorId: newsData.authorId
  });
} catch (notificationError) {
  console.error('Error enviando notificación:', notificationError);
  // No lanzar error para no afectar la creación de la noticia
}
      
      return docRef.id;
    } catch (error) {
      console.error('❌ ERROR EN CREATE NEWS:', error);
      console.error('❌ Código de error:', error.code);
      console.error('❌ Mensaje de error:', error.message);
      throw error;
    }

  }
  

  // Obtener noticias por autor - CORREGIDO (sin orderBy temporalmente)
  async getNewsByAuthor(authorId) {
    try {
      console.log('🔍 Buscando noticias para autor:', authorId);
      
      // CONSULTA SIMPLE - sin ordenamiento para evitar error de índices
      const q = query(
        collection(db, this.collectionName), 
        where('authorId', '==', authorId)
        // REMOVIDO: orderBy('createdAt', 'desc') temporalmente
      );
      
      const querySnapshot = await getDocs(q);
      console.log('📊 Número de documentos encontrados:', querySnapshot.size);
      
      const news = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Documento encontrado:', {
          id: doc.id,
          title: data.title,
          authorId: data.authorId,
          status: data.status,
          createdAt: data.createdAt
        });
        return {
          id: doc.id,
          ...data
        };
      });
      
      // Ordenar manualmente en JavaScript
      news.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA; // Orden descendente
      });
      // Notificar sobre cambio de estado
try {
  const newsItem = await this.getNewsById(newsId);
  if (newsItem) {
    if (newStatus === 'publicado') {
      await NotificationService.notifyReporterNewsPublished(newsItem);
    } else {
      await NotificationService.notifyStatusChange(newsItem, oldStatus, newStatus);
    }
  }
} catch (notificationError) {
  console.error('Error enviando notificación de estado:', notificationError);
}
      console.log('✅ Noticias procesadas y ordenadas:', news.length);
      return news;
    } catch (error) {
      console.error('❌ Error en getNewsByAuthor:', error);
      return [];
    }
  }

  // Obtener todas las noticias - CORREGIDO
  async getAllNews() {
    try {
      console.log('🔍 Buscando TODAS las noticias...');
      
      const q = query(collection(db, this.collectionName));
      const querySnapshot = await getDocs(q);
      
      console.log('📊 Total de documentos encontrados:', querySnapshot.size);
      
      const news = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      });
      
      // Ordenar manualmente
      news.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      console.log('✅ Todas las noticias procesadas:', news.length);
      return news;
    } catch (error) {
      console.error('❌ Error obteniendo todas las noticias:', error);
      return [];
    }
  }
  

  // Actualizar noticia
  async updateNews(id, newsData) {
    try {
      const updateData = {
        ...newsData,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, this.collectionName, id), updateData);
      console.log('✅ Noticia actualizada:', id);
    } catch (error) {
      console.error('Error al actualizar la noticia:', error);
      throw new Error('Error al actualizar la noticia: ' + error.message);
    }
  }
  
  // Eliminar noticia
  async deleteNews(id) {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
      console.log('✅ Noticia eliminada:', id);
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
      throw new Error('Error al eliminar la noticia: ' + error.message);
    }
  }

  // Obtener noticia por ID
  async getNewsById(id) {
    try {
      const docSnap = await getDoc(doc(db, this.collectionName, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la noticia:', error);
      throw new Error('Error al obtener la noticia: ' + error.message);
    }
  }

  // Obtener noticias por estado
  async getNewsByStatus(status) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener noticias por estado:', error);
      return [];
    }
  }

  // Obtener número de noticias del mes
  async getMonthlyNewsCount() {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, this.collectionName),
        where('createdAt', '>=', startOfMonth)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error obteniendo noticias del mes:', error);
      return 0;
    }
  }

  // Cambiar estado de noticia
  async changeNewsStatus(id, newStatus) {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        status: newStatus,
        updatedAt: new Date()
      });
      console.log('✅ Estado cambiado:', id, newStatus);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw new Error('Error al cambiar estado: ' + error.message);
    }
  }

  // Subir imagen
  async uploadImage(file) {
    try {
      console.log('📤 Subiendo imagen:', file.name);
      const storageRef = ref(storage, `news-images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Imagen subida:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new Error('Error al subir imagen: ' + error.message);
    }
  }
}

export default new NewsService();