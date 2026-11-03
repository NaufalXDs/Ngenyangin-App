import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Layout (Login & Register without profile picture & without footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Global Layout (Home & general pages with profile picture & footer) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <div className="flex flex-1 items-center justify-center bg-gray-100 py-20">
                    <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard Workspace</h1>
                  </div>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
