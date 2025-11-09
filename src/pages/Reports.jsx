import React from 'react';
import { Link } from 'react-router-dom';

const AdminReports = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📊 <span className="text-gradient">Reportes</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Estadísticas detalladas y análisis de tu actividad
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-500">Noticias Creadas</div>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👁️</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">1.2K</div>
              <div className="text-sm text-gray-500">Visitas</div>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👍</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-500">Interacciones</div>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-500">Rendimiento</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reporte de Actividad */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Noticia Publicada</div>
                <div className="text-sm text-gray-600">"Nueva función en la plataforma"</div>
              </div>
              <span className="text-green-600 font-medium">Hace 2h</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Noticia Editada</div>
                <div className="text-sm text-gray-600">"Actualización de políticas"</div>
              </div>
              <span className="text-blue-600 font-medium">Hace 5h</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Noticia Creada</div>
                <div className="text-sm text-gray-600">"Evento corporativo"</div>
              </div>
              <span className="text-purple-600 font-medium">Ayer</span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Noticias del Mes</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Tasa de Aprobación</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Tiempo Promedio</span>
              <span className="font-semibold text-orange-600">3.2 días</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Categorías Usadas</span>
              <span className="font-semibold text-purple-600">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generar Reportes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-200">
            <div className="font-medium text-blue-900">📥 Descargar PDF</div>
            <div className="text-sm text-blue-600">Reporte completo</div>
          </button>
          
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all border border-green-200">
            <div className="font-medium text-green-900">📧 Enviar por Email</div>
            <div className="text-sm text-green-600">A tu correo</div>
          </button>
          
          <Link 
            to="/admin" 
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200 text-center flex items-center justify-center"
          >
            <div>
              <div className="font-medium text-gray-900">← Volver</div>
              <div className="text-sm text-gray-600">Al dashboard</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;