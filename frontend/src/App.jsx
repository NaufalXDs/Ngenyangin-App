import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Summary from './pages/workspace/Summary.jsx';
import MyRecipes from './pages/workspace/MyRecipes.jsx';
import RecipeReview from './pages/workspace/RecipeReview.jsx';
import UserManagement from './pages/workspace/UserManagement.jsx';
import RecipeManagement from './pages/workspace/RecipeManagement.jsx';
import Account from './pages/Account.jsx';
import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import WorkspaceLayout from './layouts/WorkspaceLayout.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* App Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipes/:slug" element={<RecipeDetail />} />
            
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/my-recipes" replace />
                </ProtectedRoute>
              }
            />

            {/* Workspace & Admin Layout Routes */}
            <Route element={<WorkspaceLayout />}>
              <Route
                path="/workspace/summary"
                element={
                  <ProtectedRoute>
                    <Navigate to="/workspace/my-recipes" replace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/my-recipes"
                element={
                  <ProtectedRoute>
                    <MyRecipes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/review"
                element={
                  <ProtectedRoute allowedRoles={['REVIEWER', 'ADMIN']}>
                    <RecipeReview />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/recipes"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <RecipeManagement />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Navigate to="/workspace/users" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Navigate to="/workspace/users" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/recipes"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Navigate to="/workspace/recipes" replace />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
