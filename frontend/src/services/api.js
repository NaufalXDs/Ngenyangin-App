const RAW_API_URL = import.meta.env?.VITE_API_URL || process.env.BACKEND_URL || 'http://localhost:3000';
const API_URL = RAW_API_URL.endsWith('/api/v1') ? RAW_API_URL : `${RAW_API_URL.replace(/\/+$/, '')}/api/v1`;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { message: text || 'Terjadi kesalahan pada server' };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Terjadi kesalahan pada server');
  }

  return data;
}

// Public Recipes
export const getRecipes = () => apiRequest('/recipes');
export const getRecipeBySlug = (slug) => apiRequest(`/recipes/${slug}`);

// Workspace
export const getMyRecipes = () => apiRequest('/recipes/mine');
export const updateRecipe = (id, data) => apiRequest(`/recipes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const moderateRecipe = (id, data) => apiRequest(`/recipes/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) });

// Profile
export const updateProfile = (data) => apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(data) });

// Admin
export const getAdminUsers = () => apiRequest('/admin/users');
export const createUser = (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUserAdmin = (id, data) => apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const updateUserRole = (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
export const deleteUser = (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
export const getAdminRecipes = () => apiRequest('/recipes?status=ALL');
export const getPendingRecipes = () => apiRequest('/recipes?status=PENDING');
export const adminDeleteRecipe = (id) => apiRequest(`/recipes/${id}`, { method: 'DELETE' });
export const adminModerateRecipe = (id, data) => apiRequest(`/recipes/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) });
