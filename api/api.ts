import axios from 'axios';

const api = axios.create({
  baseURL: "lively-stillness-production.up.railway.app",
  withCredentials: true,
});

export default api;
