const API_URL = process.env.BACKEND_URL;

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

// Workspace
export const getMyRecipes = () => apiRequest('/recipes/mine');
export const moderateRecipe = (id, data) => apiRequest(`/recipes/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) });

// Profile
export const updateProfile = (data) => apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(data) });

// Admin
export const getAdminUsers = () => apiRequest('/admin/users');
export const updateUserRole = (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
export const deleteUser = (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
export const getAdminRecipes = () => apiRequest('/recipes?status=ALL');
export const adminDeleteRecipe = (id) => apiRequest(`/recipes/${id}`, { method: 'DELETE' });
export const adminModerateRecipe = (id, data) => apiRequest(`/recipes/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) });
