import axios from 'axios';

const API_BASE_URL = process.env.API_URL || 'https://api.petamigos.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = getAuthToken(); // Función para obtener token del storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de API

// Breeding Matchmaker
export const getBreedingMatches = (params) => 
  api.get('/breeding/matches', { params });

export const recordSwipe = (data) => 
  api.post('/breeding/swipe', data);

export const processMatchPayment = (data) => 
  api.post('/breeding/match/pay', data);

// Memory Lane
export const getMemoryLane = (params) => 
  api.get(`/memory/${params.petId}`);

export const shareMemory = (data) => 
  api.post(`/memory/share/${data.memoryId}`);

// Pet Aging Clock
export const getPetAgingData = (params) => 
  api.get(`/pets/${params.petId}/aging-data`);

// Onboarding
export const createPetProfile = (data) => 
  api.post('/pets/create-update', data);

// Helper function (implementar con AsyncStorage)
function getAuthToken() {
  // return AsyncStorage.getItem('authToken');
  return null; // Placeholder
}

export default api;

