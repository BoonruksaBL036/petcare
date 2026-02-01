import api from './api';


export async function getServices() {
  const res = await api.get('/services');
  return res.data;
}

// Create service (admin, multipart/form-data)
export async function createService({ name, description, price, file }) {
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (description) formData.append('description', description);
  if (price) formData.append('price', price);
  if (file) formData.append('file', file);
  const res = await api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
}

// Update service (admin, multipart/form-data)
export async function updateService(id, { name, description, price, file }) {
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (description) formData.append('description', description);
  if (price) formData.append('price', price);
  if (file) formData.append('file', file);
  const res = await api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
}

export async function getServiceById(id) {
  const res = await api.get(`/services/${id}`);
  return res.data;
}

export async function deleteService(id) {
  const res = await api.delete(`/services/${id}`);
  return res.data;
}

export default { getServices, getServiceById, deleteService };