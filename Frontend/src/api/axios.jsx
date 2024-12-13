// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://prometeodigital.com:3003/api' // para local http:localhost:pouertoapi/api
});

export default api;
