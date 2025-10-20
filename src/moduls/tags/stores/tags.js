
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

// ======= Tags API =======

// Get all tags
export const getTags = async () => {
    try {
        const response = await api.get('/tags')
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};
//add tag
export const addTag = async (payload) => {
    try {
        const response = await api.post('/tags', payload)
        return response.data
    } catch (error) {
        console.error('Error adding tag:', error);
        throw error;
    }
}
//Get units droplist
export const getUnitsDroplist = async () => {
    try {
        const response = await api.get('/vehicles/dropdownList?type=0')
        return response.data;
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error
    }
}

//Get drivers droplist
export const getDriversDroplist = async () => {
    try {
        const response = await api.get('/drivers/dropdown_list')
        return response.data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error
    }
}

export const getTagById = async (id) => {
  try {
    console.log('API: Fetching tag with ID:', id);
    const response = await api.get(`/tags/${id}`);
    console.log('API: Tag response:', response.data);
    return response.data;
  } catch (err) {
    console.error('API: Error fetching tag by ID:', err);
    console.error('API: Error response:', err.response?.data);
    throw err;
  }
};

export const updateTag = async (id, payload) => {
  try {
    const response = await api.put(`/tags/${id}`, payload);
    return response.data;
  } catch (err) {
    console.error('Error updating tag:', err);
    throw err;
  }
};
export const deleteTag = async (id) => {
  try {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting tag:', err);
    throw err;
  }
};

export default api;

