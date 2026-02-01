import api from './api';

export async function createService(payload) {
  const res = await api.post('/services', payload);
  return res.data;
}

export async function updateService(id, payload) {
  const res = await api.put(`/services/${id}`, payload);
  return res.data;
}

export default { createService, updateService };