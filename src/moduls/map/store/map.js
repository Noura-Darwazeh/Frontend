
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.22:8091/api',
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
    'Selected-Account': 955,
  },
});

// Attach fresh token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // remove if no token
  }
  return config;
});

// ======= Tags API =======

// Get areas
export const getAreas = async () => {
  try {
    const response = await api.get('/zones?page=1&paginate=6000')
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

//Post area

export const postArea = async (payload) => {
  try {
    const response = await api.post('/zones', payload)
    return response.data
  } catch (error) {
    console.error('Error posting area:', error);
    throw error;
  }
}
// delete area
export const deleteArea = async (id) => {
  try {
    const response = await api.delete(`/zones/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting area:', error)
    throw error
  }
}
// update area
export const updateArea = async (id, payload) => {
  try {
    const response = await api.put(`/zones/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating area:', error.response?.data || error);
    throw error;
  }
};

export default api;

