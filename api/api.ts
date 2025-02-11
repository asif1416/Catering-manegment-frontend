import axios from 'axios';

const api = axios.create({
  baseURL: "https://lively-stillness-production.up.railway.app/",
  withCredentials: true,
});

export default api;
