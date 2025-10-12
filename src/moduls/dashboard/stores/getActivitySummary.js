import api from '../../../api/axios';

export const getVehiclesGroupedByStatus = async () => {
    try {
        const response = await api.get('/dashboard/vehicles_grouped_by_status');
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicles grouped by status:', error);
        throw error;
    }
};
