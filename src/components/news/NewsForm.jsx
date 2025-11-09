import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsService from '../../services/NewsService';
import CategoryService from '../../services/CategoryService';

const NewsForm = ({ newsItem = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    status: 'edicion'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCategories();
    
    if (id) {
      loadNewsItem(id);
      setIsEditing(true);
    } else if (newsItem) {
      setFormData({
        title: newsItem.title || '',
        subtitle: newsItem.subtitle || '',
        content: newsItem.content || '',
        category: newsItem.category || '',
        status: newsItem.status || 'edicion'
      });
      setImagePreview(newsItem.imageUrl || '');
      setIsEditing(true);
    }
  }, [id, newsItem]);

  const loadNewsItem = async (newsId) => {
    try {
      const item = await NewsService.getNewsById(newsId);
      if (item) {
        setFormData({
          title: item.title || '',
          subtitle: item.subtitle || '',
          content: item.content || '',
          category: item.category || '',
          status: item.status || 'edicion'
        });
        setImagePreview(item.imageUrl || '');
      }
    } catch (error) {
      console.error('Error cargando noticia:', error);
      setError('Error al cargar la noticia');
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await CategoryService.getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar las categorías');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }
      
      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🎯 INICIANDO ENVÍO DE FORMULARIO');
    
    // Validaciones básicas
    if (!formData.title?.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!formData.subtitle?.trim()) {
      setError('El subtítulo es obligatorio');
      return;
    }
    if (!formData.content?.trim()) {
      setError('El contenido es obligatorio');
      return;
    }
    if (!formData.category) {
      setError('La categoría es obligatoria');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('⏳ Iniciando proceso de guardado...');

      let imageUrl = '';
      
      // Subir imagen si existe
      if (imageFile) {
        console.log('📤 Subiendo imagen...');
        try {
          imageUrl = await NewsService.uploadImage(imageFile);
          console.log('✅ Imagen subida:', imageUrl);
        } catch (imageError) {
          console.error('❌ Error subiendo imagen:', imageError);
          setError('Error al subir la imagen: ' + imageError.message);
          setLoading(false);
          return;
        }
      }

      // Preparar datos para Firestore
      const newsData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status || 'edicion',
        imageUrl: imageUrl,
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('💾 Datos listos para Firestore:', newsData);

      let result;
      if (isEditing) {
        console.log('✏️ Editando noticia existente...');
        const newsId = id || newsItem?.id;
        result = await NewsService.updateNews(newsId, newsData);
        console.log('✅ Noticia actualizada');
      } else {
        console.log('🆕 Creando nueva noticia...');
        result = await NewsService.createNews(newsData);
        console.log('✅ Noticia creada con ID:', result);
      }

      console.log('🎉 Proceso completado, redirigiendo...');
      navigate('/admin/news');
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO:', error);
      console.error('❌ Detalles del error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError('Error al guardar la noticia: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              {isEditing ? '✏️ Editar Noticia' : '📝 Crear Nueva Noticia'}
            </h1>
            <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">
              {isEditing 
                ? 'Actualiza la información de tu noticia' 
                : 'Completa todos los campos para crear una nueva noticia'
              }
            </p>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-4 mb-6 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Título */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="Ingresa el título de la noticia"
                  required
                />
              </div>

              {/* Subtítulo */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Subtítulo *
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="Ingresa un subtítulo llamativo"
                  required
                />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Imagen Principal
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="max-w-md mx-auto sm:mx-0">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="rounded-xl shadow-lg max-h-64 object-cover w-full border-2 border-gray-200"
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="text-3xl mb-2">📷</span>
                        <p className="text-sm text-gray-500 text-center">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF hasta 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-gray-900">
                  Contenido *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="12"
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base resize-none"
                  placeholder="Escribe el contenido completo de la noticia aquí..."
                  required
                />
              </div>

              {/* Estado (solo para reporteros) */}
              {user.role === 'reporter' && (
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-gray-900">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  >
                    <option value="edicion">📝 En Edición</option>
                    <option value="terminado">✅ Terminado (Enviar para revisión)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {formData.status === 'edicion' 
                      ? 'La noticia sigue en desarrollo y puedes seguir editándola' 
                      : 'La noticia será enviada al editor para revisión y publicación'
                    }
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/news')}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50"
                  disabled={loading}
                >
                  <span>↩️</span>
                  <span>Cancelar</span>
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <span>💾</span>
                      <span>Actualizar Noticia</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Crear Noticia</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;