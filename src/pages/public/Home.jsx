import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '📝',
      title: 'Crear Noticias',
      description: 'Editor intuitivo para redactar y diseñar noticias atractivas.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '👥',
      title: 'Gestión de Roles',
      description: 'Sistema de reporteros y editores con permisos específicos.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '🔄',
      title: 'Flujo de Trabajo',
      description: 'Control completo del proceso de publicación de noticias.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📱',
      title: 'Totalmente Responsivo',
      description: 'Diseño adaptable a todos los dispositivos móviles.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sistema de Gestión de 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Noticias</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Plataforma moderna para crear, gestionar y publicar noticias de manera eficiente. 
              Diseñada para equipos de comunicación y marketing corporativo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center min-w-[200px]"
              >
                <span className="mr-2">🚀</span>
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="group bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md flex items-center justify-center min-w-[200px]"
              >
                <span className="mr-2">✨</span>
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar eficientemente tus noticias corporativas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Reporter Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👨‍💻</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Para Reporteros</h3>
                    <p className="text-blue-100">Crea y gestiona tu contenido</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Crear y editar noticias con editor intuitivo</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Seguimiento del estado de publicaciones</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Envío para revisión editorial</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Gestión de tus noticias publicadas</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Editor Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👨‍💼</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Para Editores</h3>
                    <p className="text-purple-100">Supervisa y publica contenido</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Revisar y aprobar noticias pendientes</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Gestionar publicación y desactivación</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Administrar categorías y secciones</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Reportes y estadísticas detalladas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a nuestra plataforma y transforma la manera de gestionar y publicar tus noticias corporativas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center"
              >
                <span className="mr-2">🎯</span>
                Comenzar Ahora
              </Link>
              <Link 
                to="/login" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <span className="mr-2">🔐</span>
                Acceder a Mi Cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Plataforma diseñada para equipos de comunicación corporativa
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;