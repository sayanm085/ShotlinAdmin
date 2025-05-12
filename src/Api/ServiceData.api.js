// src/Api/ServiceData.api.js

import axios from 'axios';
import api from './api.js'; // e.g. "http://localhost:3000/api/"

export const axiosInstance = axios.create({
  baseURL: api + 'v1/products',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch products via product-search endpoint.
 * @param {object} params
 */
export async function fetchProducts(params = {}) {
  const { data } = await axiosInstance.get('/product-search', { params });
  return data.data;  // { newProducts: [...], configProduct: {...} }
}
