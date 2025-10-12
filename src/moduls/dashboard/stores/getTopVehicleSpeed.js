import api from '../../../api/axios';

export const getVehiclesGroupedBySpeed = async () => {
    try {
        const response = await api.get('/dashboard/top_vehicle_speed');
        return response.data;
    } catch (error) {
        console.error('Error fetching top vehicle speed:', error);
        throw error;
    }
};
