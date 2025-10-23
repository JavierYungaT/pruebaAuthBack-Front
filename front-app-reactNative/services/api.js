import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const API_URL = 'http://localhost:7086/api/auth';
const API_URL = 'http://192.168.18.76:7086/api/auth';

const API_BASE = 'http://192.168.18.76:7086/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
          const { accessToken } = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // Aquí podrías navegar al login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Registrar nuevo usuario
 */
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

/**
 * Login con email y password
 */
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  const { accessToken, refreshToken, expiresIn } = response.data;
  
  // Guardar tokens en AsyncStorage
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  await AsyncStorage.setItem('tokenExpiresIn', expiresIn.toString());
  
  return response.data;
};

/**
 * Refresh del access token
 */
export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
  const { accessToken } = response.data;
  
  await AsyncStorage.setItem('accessToken', accessToken);
  
  return response.data;
};

/**
 * Logout - invalida el refresh token
 */
export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  try {
    await axios.post(`${API_URL}/logout`, { refreshToken });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Limpiar AsyncStorage siempre
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'tokenExpiresIn']);
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

/**
 * Resetear contraseña con token
 */
export const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL}/reset-password`, data);
  return response.data;
};

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

/**
 * Obtener datos del usuario autenticado
 */
export const getCurrentUser = async () => {
  const response = await api.get(`${API_BASE}/users/me`);
  return response.data;
};

/**
 * Bloquear/desbloquear usuario (admin)
 */
export const blockUser = async (userId, block = true) => {
  const response = await api.put(`/users/${userId}/block`, { block });
  return response.data;
};

/**
 * Cambiar credenciales de usuario
 */
export const changeUserCredentials = async (userId, credentials) => {
  const response = await api.put(`/users/${userId}/credentials`, credentials);
  return response.data;
};

/**
 * Obtener audit logs (admin)
 */
export const getAuditLogs = async (params = {}) => {
  const response = await api.get('/audit', { params });
  return response.data;
};

// ============================================
// HELPERS
// ============================================

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return !!token;
};

/**
 * Obtener el access token
 */
export const getAccessToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

/**
 * Obtener el refresh token
 */
export const getRefreshToken = async () => {
  return await AsyncStorage.getItem('refreshToken');
};

export { api };
export default api;