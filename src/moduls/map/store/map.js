
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

// Get areas
export const getAreas = async () => {
    try {
        const response = await api.get('/zones?page=1&paginate=100')
        return response.data;
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error;
    }
};

//Post area

export const postArea = async(payload) => {
    try{
        const response = await api.post('/zones' , payload)
        return response.data
    } catch(error){
        console.error('Error posting area:', error);
        throw error;
    }
}

// export const addTag = async (payload) => {
//     try {
//         const response = await api.post('/tags', payload)
//         return response.data
//     } catch (error) {
//         console.error('Error adding tag:', error);
//         throw error;
//     }}
export default api;

