import api from '../api/axios';

export const vehicleService = {
  getAll: (params) => api.get('/vehicles', { params }),
  getAllVehicles: () => api.get('/vehicles/all'),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};
