import api from '../api/axios';

export const promotionService = {
  getAll: (params) => api.get('/promotions', { params }),
  getAllPromotions: () => api.get('/promotions/all'),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post('/promotions', data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
};
