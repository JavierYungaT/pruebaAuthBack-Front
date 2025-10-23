import axios from 'axios';

const API_URL = 'http://localhost:7086/api/auth';
const API_BASE = 'http://localhost:7086/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
          const { accessToken } = response.data;

          localStorage.setItem('accessToken', accessToken);

          // Reintentar la petición
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
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
 * @param {Object} userData - {email, username, password}
 */
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

/**
 * Login con email y password
 * @param {Object} credentials - {email, password}
 * @returns {Object} - {accessToken, refreshToken, expiresIn}
 */
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  const { accessToken, refreshToken, expiresIn } = response.data;
  
  // Guardar tokens en localStorage
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('tokenExpiresIn', expiresIn);
  
  return response.data;
};

/**
 * Refresh del access token
 * @param {string} refreshToken 
 */
export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
  const { accessToken } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  
  return response.data;
};

/**
 * Logout - invalida el refresh token
 */
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    await axios.post(`${API_URL}/logout`, { refreshToken });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Limpiar localStorage siempre
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresIn');
  }
};

/**
 * Solicitar recuperación de contraseña (envía OTP/token por email)
 * @param {string} email 
 */
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

/**
 * Resetear contraseña con token/código
 * @param {Object} data - {token, newPassword}
 */
export const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL}/reset-password`, data);
  return response.data;
};

// ============================================
// WEBAUTHN ENDPOINTS (Passkeys)
// ============================================

/**
 * Iniciar registro de WebAuthn (obtener challenge)
 */
export const webAuthnRegisterOptions = async () => {
  const response = await api.post('/auth/webauthn/register/options');
  return response.data;
};

/**
 * Verificar registro de WebAuthn
 * @param {Object} credential - Respuesta del navegador
 */
export const webAuthnRegisterVerify = async (credential) => {
  const response = await api.post('/auth/webauthn/register/verify', credential);
  return response.data;
};

/**
 * Iniciar autenticación WebAuthn (obtener challenge)
 */
export const webAuthnAuthOptions = async () => {
  const response = await axios.post(`${API_URL}/webauthn/authenticate/options`);
  return response.data;
};

/**
 * Verificar autenticación WebAuthn
 * @param {Object} credential - Respuesta del navegador
 */
export const webAuthnAuthVerify = async (credential) => {
  const response = await axios.post(`${API_URL}/webauthn/authenticate/verify`, credential);
  const { accessToken, refreshToken } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
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
 * @param {string} userId 
 * @param {boolean} block 
 */
export const blockUser = async (userId, block = true) => {
  const response = await api.put(`/users/${userId}/block`, { block });
  return response.data;
};

/**
 * Cambiar credenciales de usuario
 * @param {string} userId 
 * @param {Object} credentials - {oldPassword, newPassword}
 */
export const changeUserCredentials = async (userId, credentials) => {
  const response = await api.put(`/users/${userId}/credentials`, credentials);
  return response.data;
};

/**
 * Obtener audit logs (admin)
 * @param {Object} params - {userId?, action?, from?, to?}
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
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

/**
 * Obtener el access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Obtener el refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Exportar la instancia de axios configurada para uso en otros componentes
export { api };

export default api;