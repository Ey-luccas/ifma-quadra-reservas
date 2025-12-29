import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * URL base da API backend
 * Em produção, usa /api (proxy reverso do Nginx)
 * Em desenvolvimento, pode usar variável de ambiente VITE_API_URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Cria instância do axios com configurações padrão
 * baseURL: '/api' em produção (proxy Nginx) ou VITE_API_URL em desenvolvimento
 * withCredentials: true para enviar cookies/credenciais nas requisições
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para adicionar token de autenticação nas requisições
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratar erros de autenticação
 * Redireciona para login se receber 401
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

