import api from '../../../api/axios';

export const getUnitsLiveList = async () => {
  try {
    const response = await api.get('/vehicles/dashboard_tracking?page=1&paginate=50');
    return response.data;
  } catch (error) {
    console.error('Error fetching live list :', error);
    throw error;
  }
};
