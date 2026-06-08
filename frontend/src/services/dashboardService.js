import api from '../api/axios';

export const dashboardService = {
  getDashboard: () => api.get('/dashboard'),
};
