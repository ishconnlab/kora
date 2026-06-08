import api from '../api/axios';

export const promotionVehicleService = {
  getAll: (params) => api.get('/promotion-vehicles', { params }),
  getByPromotion: (promotionId) => api.get(`/promotion-vehicles/${promotionId}`),
  assign: (data) => api.post('/promotion-vehicles', data),
  remove: (id) => api.delete(`/promotion-vehicles/${id}`),
  updatePerformance: (id, data) => api.put(`/promotion-vehicles/${id}/performance`, data),
};
