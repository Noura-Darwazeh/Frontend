import api from '../../../api/axios';

export const getVehiclesGroupedBySpeed = async () => {
    try {
        const response = await api.get('/dashboard/vehicles_grouped_by_speed');
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicles grouped by speed:', error);
        throw error;
    }
};
