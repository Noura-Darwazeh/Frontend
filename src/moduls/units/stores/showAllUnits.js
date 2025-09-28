import axios from 'axios';
const api = axios.create({
  baseURL: 'http://192.168.100.22:8091/api',
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
    'Selected-Account': 955,
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data; 
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error; 
  }
};

export default api;