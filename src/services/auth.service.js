import api from './api';

export async function login(phone, password) {
  const res = await api.post('/users/login', { phone, password });
  return res.data;
}

export async function register({ name, phone, password }) {
  const payload = { name, phone, password };
  const res = await api.post('/users/register', payload);
  return res.data;
}

export default { login, register };