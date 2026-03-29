/* ============================================================
   ADPRESS — API.JS
   Handles all frontend to backend communication
============================================================ */

const API_URL = 'https://adpress-backend.vercel.app/api';

/* ── Save and Get Token ── */
const saveToken = (token) => localStorage.setItem('adpress_token', token);
const getToken = () => localStorage.getItem('adpress_token');
const removeToken = () => localStorage.removeItem('adpress_token');

/* ── Save and Get User ── */
const saveUser = (user) => localStorage.setItem('adpress_user', JSON.stringify(user));
const getUser = () => JSON.parse(localStorage.getItem('adpress_user') || '{}');
const removeUser = () => localStorage.removeItem('adpress_user');

/* ── Base Fetch Helper ── */
const apiFetch = async (endpoint, method = 'GET', body = null, auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

/* ══════════════════════════════════
   AUTH APIs
══════════════════════════════════ */

/* ── Register ── */
const registerUser = async (userData) => {
  const data = await apiFetch('/auth/register', 'POST', userData);
  saveToken(data.token);
  saveUser(data.user);
  return data;
};

/* ── Login ── */
const loginUser = async (email, password) => {
  const data = await apiFetch('/auth/login', 'POST', { email, password });
  saveToken(data.token);
  saveUser(data.user);
  return data;
};

/* ── Logout ── */
const logoutUser = () => {
  removeToken();
  removeUser();
  localStorage.removeItem('booking');
  window.location.href = 'login.html';
};

/* ── Check if logged in ── */
const isLoggedIn = () => !!getToken();

/* ── Protect page - redirect if not logged in ── */
const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
};

/* ══════════════════════════════════
   BOOKING APIs
══════════════════════════════════ */

/* ── Create Booking ── */
const createBooking = async (bookingData) => {
  return await apiFetch('/bookings', 'POST', bookingData, true);
};

/* ── Get All Bookings ── */
const getBookings = async () => {
  return await apiFetch('/bookings', 'GET', null, true);
};

/* ── Get Single Booking ── */
const getBooking = async (id) => {
  return await apiFetch(`/bookings/${id}`, 'GET', null, true);
};

/* ── Cancel Booking ── */
const cancelBooking = async (id) => {
  return await apiFetch(`/bookings/${id}/cancel`, 'PUT', null, true);
};