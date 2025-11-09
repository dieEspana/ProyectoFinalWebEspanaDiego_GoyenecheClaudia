import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/UserService';

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    phone: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const userData = await UserService.getUserProfile(user.uid);
          setFormData({
            displayName: userData?.displayName || user.displayName || '',
            email: userData?.email || user.email || '',
            bio: userData?.bio || '',
            phone: userData?.phone || '',
            department: userData?.department || ''
          });
        } catch (error) {
          console.error('Error cargando perfil:', error);
          // Si hay error, usar datos básicos de auth
          setFormData({
            displayName: user.displayName || '',
            email: user.email || '',
            bio: '',
            phone: '',
            department: ''
          });
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Actualizar perfil en Firebase Auth
      if (formData.displayName !== user.displayName) {
        await updateUserProfile({
          displayName: formData.displayName
        });
      }

      // Actualizar datos adicionales en Firestore
      await UserService.updateUserProfile(user.uid, {
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
        department: formData.department,
        updatedAt: new Date()
      });

      setMessage({ 
        type: 'success', 
        text: 'Perfil actualizado correctamente!' 
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al actualizar el perfil. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            👤 Mi <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfil</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Mensaje de estado */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información del Perfil */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Información Personal</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input 
                        type="text" 
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico *
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea 
                      rows="4"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Link 
                      to="/admin" 
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-center"
                    >
                      Cancelar
                    </Link>
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center transition-all duration-300 hover:shadow-md">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold mx-auto mb-4 shadow-lg">
                {formData.displayName?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {formData.displayName || user?.displayName || 'Usuario'}
              </h3>
              <p className="text-gray-600 mb-2 text-sm sm:text-base truncate">
                {formData.email || user?.email}
              </p>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {user?.role === 'reporter' ? '📝 Reportero' : '👨‍💼 Editor'}
              </span>
              
              {formData.department && (
                <span className="block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formData.department}
                </span>
              )}
            </div>

            {/* Información de la cuenta */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la Cuenta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuario desde:</span>
                  <span className="font-medium">
                    {user?.metadata?.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES')
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último acceso:</span>
                  <span className="font-medium">
                    {user?.metadata?.lastSignInTime 
                      ? new Date(user.metadata.lastSignInTime).toLocaleDateString('es-ES')
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
       {/* Acciones Rápidas */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
  <div className="space-y-3">
    <Link 
      to="/admin" 
      className="flex items-center w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
    >
      <i className="fas fa-arrow-left mr-3 text-gray-600 group-hover:text-gray-800"></i>
      <span>Volver al Dashboard</span>
    </Link>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;