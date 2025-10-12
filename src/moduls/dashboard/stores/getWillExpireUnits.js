import api from '../../../api/axios';

export const getWillExpireUnits = async () => {
  try {
    const response = await api.get('/vehicles/will_expire?page=1&paginate=10');
    return response.data;
  } catch (error) {
    console.error('Error fetching will expire units:', error);
    throw error;
  }
};
