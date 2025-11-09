import React from 'react';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          👤 Mi <span className="text-gradient">Perfil</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Información del Perfil */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea 
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="btn-secondary">
                  Cancelar
                </button>
                <button className="btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Preferencias</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Notificaciones por Email</div>
                  <div className="text-sm text-gray-600">Recibir notificaciones vía correo electrónico</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Modo Oscuro</div>
                  <div className="text-sm text-gray-600">Interfaz en modo oscuro</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="card p-6 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{user?.displayName || 'Usuario'}</h3>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {user?.role === 'reporter' ? '📝 Reportero' : '👨‍💼 Editor'}
            </span>
            
            <button className="w-full mt-4 btn-secondary">
              Cambiar Avatar
            </button>
          </div>

          {/* Acciones Rápidas */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-2">
              <Link to="/admin" className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                ← Volver al Dashboard
              </Link>
              <button className="block w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;