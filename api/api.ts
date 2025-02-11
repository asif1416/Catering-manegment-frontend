import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-phi-one-40.vercel.app/",
  withCredentials: true,
});

export default api;
