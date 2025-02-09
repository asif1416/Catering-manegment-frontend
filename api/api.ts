import axios from 'axios';

const api = axios.create({
  baseURL: "http://lively-stillness-production.up.railway.app/",
  withCredentials: true,
});

export default api;
