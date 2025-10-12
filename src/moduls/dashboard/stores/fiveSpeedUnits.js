import api from '../../../api/axios';

export const getTop5SpeedUnits = async () => {
  try {
    const response = await api.get('/dashboard/top_5_speed');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};
