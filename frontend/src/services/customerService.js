import api from '../api/axios';

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getAllCustomers: () => api.get('/customers/all'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};
