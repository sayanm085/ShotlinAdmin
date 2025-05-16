// src/Api/ServiceData.api.js

import axios from 'axios';
import api from './api.js'; // e.g. "http://localhost:3000/api/"

// existing instance
export const axiosInstance = axios.create({
  baseURL: api + 'v1/products',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch paginated/searchable list
 */
export async function fetchProducts(params = {}) {
  const { data } = await axiosInstance.get('/product-search', { params });
  return data.data;
}

/**
 * Upload new product
 */
export async function uploadProduct(formData) {
  const { data } = await axiosInstance.post('/product-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

/**
 * Fetch single product by id
 */
export async function fetchProductDetails(id) {
  const { data } = await axiosInstance.get(`/product-details/${id}`);
  return data.data;
}

/**
 * Update existing product
 */
export async function updateProduct(id, formData) {
  const { data } = await axiosInstance.put(`/product-update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id) {
  const { data } = await axiosInstance.delete(`/product-delete/${id}`)
  return data
}