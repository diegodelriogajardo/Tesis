// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://190.22.142.36:3000/api'
});

export default api;
