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
  orderBy
} from 'firebase/firestore';

const CategoryService = {
  // Obtener todas las categorías
  async getAllCategories() {
    try {
      const categoriesQuery = query(
        collection(db, 'categories'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(categoriesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw error;
    }
  },

  // Obtener categoría por ID
  async getCategoryById(categoryId) {
    try {
      const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
      if (categoryDoc.exists()) {
        return { id: categoryDoc.id, ...categoryDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw error;
    }
  },

  // Crear nueva categoría
  async createCategory(categoryData) {
    try {
      const categoryWithTimestamp = {
        ...categoryData,
        createdAt: new Date(),
        isActive: true
      };
      const docRef = await addDoc(collection(db, 'categories'), categoryWithTimestamp);
      return { id: docRef.id, ...categoryData };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Actualizar categoría
  async updateCategory(categoryId, categoryData) {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, categoryData);
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Eliminar categoría (soft delete)
  async deleteCategory(categoryId) {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        isActive: false,
        deletedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Obtener categorías activas
  async getActiveCategories() {
    try {
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(categoriesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting active categories:', error);
      throw error;
    }
  }
};

export default CategoryService;