import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// NOTE: This file exports a plain axios instance.
// For advanced usage, you can later add interceptors in a custom hook.

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export default api;