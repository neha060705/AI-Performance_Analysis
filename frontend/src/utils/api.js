import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Employee APIs
export const addEmployee = (data) => API.post('/employees', data);
export const getEmployees = () => API.get('/employees');
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const searchEmployees = (params) => API.get('/employees/search', { params });
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// AI APIs
export const getAIRecommendation = (employeeId) =>
  API.post('/ai/recommend', { employeeId });
export const getAIRankings = () => API.get('/ai/rankings');

export default API;
