import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CategoryService from '../../services/CategoryService';

const CategoryManager = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await CategoryService.getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setError('');

      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.id, formData);
        setError('✅ Categoría actualizada exitosamente');
      } else {
        await CategoryService.createCategory(formData);
        setError('✅ Categoría creada exitosamente');
      }

      resetForm();
      loadCategories();
      setTimeout(() => setError(''), 3000);

    } catch (error) {
      console.error('Error guardando categoría:', error);
      setError('Error al guardar la categoría: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer y podría afectar las noticias existentes.`)) {
      return;
    }

    try {
      await CategoryService.deleteCategory(categoryId);
      setError('✅ Categoría eliminada exitosamente');
      loadCategories();
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      setError('Error al eliminar la categoría: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('es-ES');
    }
    
    return 'Fecha inválida';
  };

  if (user.role !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center max-w-md w-full">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 text-lg">
            Solo los usuarios con rol de Editor pueden gestionar categorías.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl m-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🗂️</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Gestión de Categorías
                  </h1>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Crea y gestiona las secciones para organizar las noticias
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center lg:justify-start"
            >
              <span className="text-lg">{showForm ? '❌' : '➕'}</span>
              <span>{showForm ? 'Cancelar' : 'Nueva Categoría'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className={`rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 ${
            error.includes('✅') 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 shadow-lg' 
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-800 shadow-lg'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-xl ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {error.includes('✅') ? '✅' : '⚠️'}
              </span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Formulario de Categoría */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 transform transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">
                  {editingCategory ? '✏️' : '➕'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ej: Tecnología, Deportes, Política..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Describe brevemente esta categoría..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <span>{editingCategory ? '💾' : '📝'}</span>
                  <span>{editingCategory ? 'Actualizar' : 'Crear'} Categoría</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{categories.length}</div>
            <div className="text-sm sm:text-base text-blue-600 font-semibold">Total Categorías</div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
              {categories.filter(cat => cat.name && cat.name.trim()).length}
            </div>
            <div className="text-sm sm:text-base text-green-600 font-semibold">Categorías Activas</div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-purple-700 mb-2">
              {categories.filter(cat => cat.description && cat.description.trim()).length}
            </div>
            <div className="text-sm sm:text-base text-purple-600 font-semibold">Con Descripción</div>
          </div>
        </div>

        {/* Lista de Categorías */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📋</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Lista de Categorías
              </h2>
            </div>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {categories.length} items
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🗂️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                No hay categorías creadas
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Comienza creando tu primera categoría para organizar las noticias
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ➕ Crear Primera Categoría
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md group">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {category.name}
                        </h3>
                        <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-300 self-start">
                          📅 Creado: {formatDate(category.createdAt)}
                        </span>
                      </div>
                      
                      {category.description ? (
                        <p className="text-gray-600 leading-relaxed">
                          {category.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">
                          Sin descripción
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-semibold text-sm"
                      >
                        <span>✏️</span>
                        <span>Editar</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-semibold text-sm"
                      >
                        <span>🗑️</span>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información importante */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-yellow-600">💡</span>
            </div>
            <div>
              <h4 className="font-bold text-yellow-800 mb-3 text-lg">
                Información Importante
              </h4>
              <ul className="text-yellow-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Las categorías se usan para organizar las noticias
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Solo los editores pueden gestionar categorías
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Al eliminar una categoría, las noticias mantendrán el nombre de la categoría asignada
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Se recomienda usar nombres claros y descriptivos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;