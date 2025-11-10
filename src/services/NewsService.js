import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';

const NewsService = {
  // Obtener todas las noticias (FUNCIÓN FALTANTE)
  async getAllNews() {
    try {
      const newsQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(newsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all news:', error);
      throw error;
    }
  },

  // Obtener noticias por autor
  async getNewsByAuthor(authorId) {
    try {
      const newsQuery = query(
        collection(db, 'news'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(newsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting news by author:', error);
      throw error;
    }
  },

  // Obtener noticias por estado
  async getNewsByStatus(status) {
    try {
      const newsQuery = query(
        collection(db, 'news'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(newsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting news by status:', error);
      throw error;
    }
  },

  // Obtener noticia por ID
  async getNewsById(newsId) {
    try {
      const newsDoc = await getDoc(doc(db, 'news', newsId));
      if (newsDoc.exists()) {
        return { id: newsDoc.id, ...newsDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting news by ID:', error);
      throw error;
    }
  },

  // Crear nueva noticia
  async createNews(newsData) {
    try {
      const newsWithTimestamp = {
        ...newsData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'news'), newsWithTimestamp);
      return { id: docRef.id, ...newsData };
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Actualizar noticia
  async updateNews(newsId, newsData) {
    try {
      const newsRef = doc(db, 'news', newsId);
      await updateDoc(newsRef, {
        ...newsData,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // Eliminar noticia
  async deleteNews(newsId) {
    try {
      await deleteDoc(doc(db, 'news', newsId));
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Obtener conteo de noticias del mes actual
  async getMonthlyNewsCount() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const newsQuery = query(
        collection(db, 'news'),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth)),
        where('status', '==', 'publicado')
      );
      const querySnapshot = await getDocs(newsQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting monthly news count:', error);
      return 0;
    }
  },

  // Obtener noticias recientes (últimas 5)
  async getRecentNews(limitCount = 5) {
    try {
      const newsQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(newsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent news:', error);
      throw error;
    }
  }
};

export default NewsService;