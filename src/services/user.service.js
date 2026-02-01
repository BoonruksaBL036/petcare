import api from './api';

// สมัครสมาชิก
export async function register(payload) {
  const res = await api.post('/users/register', payload);
  return res.data;
}

// ล็อกอิน
export async function login(payload) {
  const res = await api.post('/users/login', payload);
  return res.data;
}

// ดู/แก้ไข/ลบผู้ใช้ตาม id
export async function getUserById(id, token) {
  const res = await api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function updateUser(id, payload, token) {
  const res = await api.put(`/users/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function deleteUser(id, token) {
  const res = await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export default { register, login, getUserById, updateUser, deleteUser };