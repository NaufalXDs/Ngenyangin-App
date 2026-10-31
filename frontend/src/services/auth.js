import { apiRequest } from './api.js';

export const authService = {
  signIn: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  signUp: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  getProfile: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};
