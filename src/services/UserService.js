import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';

const UserService = {
  // Obtener perfil del usuario
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil del usuario
  async updateUserProfile(uid, userData) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },

  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuarios activos (últimos 30 días)
  async getActiveUsersCount() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const usersQuery = query(
        collection(db, 'users'),
        where('createdAt', '>=', thirtyDaysAgo)
      );
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error obteniendo usuarios activos:', error);
      return 0;
    }
  },

  // Obtener usuario por email
  async getUserByEmail(email) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email),
        limit(1)
      );
      const querySnapshot = await getDocs(usersQuery);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw error;
    }
  },

  // Actualizar rol de usuario
  async updateUserRole(uid, newRole) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error actualizando rol:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  // Buscar usuarios
  async searchUsers(searchTerm) {
    try {
      const allUsers = await this.getAllUsers();
      return allUsers.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      throw error;
    }
  }
};

export default UserService;