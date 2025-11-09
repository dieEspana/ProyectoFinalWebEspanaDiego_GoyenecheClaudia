import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas públicas
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas de administración (protegidas)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/Profile';
import AdminReports from './pages/admin/Reports';
import NewsList from './components/news/NewsList';
import NewsForm from './components/news/NewsForm';
import CategoryManager from './components/categories/CategoryManager';

// Páginas adicionales
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import CreateNews from './pages/CreateNews';
import MyNews from './pages/MyNews';

// Estilos
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ===== RUTAS PÚBLICAS ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* ===== RUTAS GENERALES ===== */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/create-news" element={<CreateNews />} />
            <Route path="/my-news" element={<MyNews />} />

            {/* ===== RUTAS DE ADMINISTRACIÓN (PROTEGIDAS) ===== */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/profile" 
              element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/news" 
              element={
                <ProtectedRoute>
                  <NewsList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/news/create" 
              element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/news/edit/:id" 
              element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <CategoryManager />
                </ProtectedRoute>
              } 
            />

            {/* ===== RUTA DE FALLBACK ===== */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;