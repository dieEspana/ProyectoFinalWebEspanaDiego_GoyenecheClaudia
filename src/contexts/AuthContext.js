import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // Función para registro
  const register = async (email, password, displayName, role = 'reporter') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: displayName
      });

      // Guardar información adicional en Firestore
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return user;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  // Función para logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  // Función para actualizar perfil (NUEVA)
  const updateUserProfile = async (profileData) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, profileData);
        // Actualizar el estado del usuario
        setUser({ ...user, ...profileData });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

  // Observer para cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener información adicional de Firestore
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../config/firebase');
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...user,
              role: userData.role,
              displayName: userData.displayName || user.displayName
            });
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Error obteniendo datos de usuario:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile // ← FUNCIÓN AGREGADA
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};