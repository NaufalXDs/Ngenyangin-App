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
