// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://192.168.100.22:8091/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Selected-Account': 955,
//   },
// });

// // Attach fresh token before every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     delete config.headers.Authorization; // remove if no token
//   }
//   return config;
// });

// export const getVehicles = async () => {
//   try {
//     const response = await api.get('/vehicles');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching vehicles:', error);
//     throw error;
//   }
// };

// export const getVehicleById = async (id) => {
//   try{
//     const response = await api.get(`/vehicles/${id}`);
//     return response.data.result;
//   } catch (error){
//     console.error('Error fetching vehicle by ID:', error);
//     throw error;
//   }
// };

// export default api;



import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.22:8091/api',
  timeout: 10000,
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

// ======= Vehicles API =======

// Get all vehicles
export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    throw error;
  }
};

// Add a new vehicle
export const addVehicle = async (data) => {
  try {
    const response = await api.post('/vehicles', data);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

// Update an existing vehicle
export const updateVehicle = async (id, data) => {
  try {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

// Delete a vehicle
export const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

export default api;

