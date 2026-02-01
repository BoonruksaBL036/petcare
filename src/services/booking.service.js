import api from './api';

function buildQuery(params){
  if(!params) return '';
  const keys = Object.keys(params);
  if(keys.length === 0) return '';
  return '?' + keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
}


export async function getBookings(params) {
  const q = buildQuery(params);
  const res = await api.get(`/bookings${q}`);
  return res.data;
}

export async function getBookingsByUser(userId) {
  const res = await api.get(`/bookings/user/${userId}`);
  return res.data;
}

export async function createBooking(payload) {
  const res = await api.post('/bookings', payload);
  return res.data;
}

export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

export async function updateBooking(id, payload) {
  const res = await api.put(`/bookings/${id}`, payload);
  return res.data;
}

export async function deleteBooking(id) {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
}

export default { getBookings, getBookingsByUser, createBooking, getBookingById, updateBooking, deleteBooking };