import api from '../api/axios';

export const reportService = {
  getReport: (params) => api.get('/reports', { params }),
};
