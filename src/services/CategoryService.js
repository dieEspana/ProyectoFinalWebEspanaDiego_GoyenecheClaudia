import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class CategoryService {
  constructor() {
    this.collectionName = 'categories';
  }

  async getAllCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar alfabéticamente por nombre
      categories.sort((a, b) => a.name.localeCompare(b.name));
      
      return categories;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('Error al obtener categorías: ' + error.message);
    }
  }

  async createCategory(categoryData) {
    try {
      const categoryWithTimestamp = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || '',
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, this.collectionName), categoryWithTimestamp);
      console.log('✅ Categoría creada:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('Error al crear categoría: ' + error.message);
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const updateData = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || ''
      };
      
      await updateDoc(doc(db, this.collectionName, id), updateData);
      console.log('✅ Categoría actualizada:', id);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error('Error al actualizar categoría: ' + error.message);
    }
  }

  async deleteCategory(id) {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
      console.log('✅ Categoría eliminada:', id);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw new Error('Error al eliminar categoría: ' + error.message);
    }
  }

  async getCategoryById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw new Error('Error al obtener categoría: ' + error.message);
    }
  }
}

export default new CategoryService();