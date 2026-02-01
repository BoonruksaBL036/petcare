import api from './api';


export async function getPets() {
  const res = await api.get('/pets');
  return res.data;
}


export async function getPetsByUser(userId) {
  const res = await api.get(`/pets/user/${userId}`);
  return res.data;
}


export async function getPetById(id) {
  const res = await api.get(`/pets/${id}`);
  return res.data;
}


export async function createPet(payload) {
  const res = await api.post('/pets', payload);
  return res.data;
}


export async function updatePet(id, payload) {
  const res = await api.put(`/pets/${id}`, payload);
  return res.data;
}


export async function deletePet(id) {
  const res = await api.delete(`/pets/${id}`);
  return res.data;
}

export default { getPets, getPetsByUser, getPetById, createPet, updatePet, deletePet };