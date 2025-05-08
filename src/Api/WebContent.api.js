// src/api/webContent.js
import axios from 'axios';
import api from './api.js';

export const axiosInstance = axios.create({
  baseURL: api + 'v1/content',
  headers: { 'Content-Type': 'multipart/form-data' },
});

// GET
export async function fetchWebContent() {
  const { data } = await axiosInstance.get('/webcontent-get');
  return data.data;
}

// ⚠️ Change from POST to PUT here:
export async function updateHeroContent(formData) {
  const { data } = await axiosInstance.put('/updateHeroContent', formData);
  return data.data;
}
