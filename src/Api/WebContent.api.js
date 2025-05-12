// src/api/webContent.js
import axios from 'axios';
import api from './api.js';

export const axiosInstance = axios.create({
  baseURL: api + 'v1/content',
  headers: { 'Content-Type': 'multipart/form-data' },
});

// 1️⃣ For JSON endpoints (Services)
const jsonClient = axios.create({
  baseURL: api + 'v1/content',
  headers: { 'Content-Type': 'application/json' },
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



// BrandPartnersContent update function
export async function updateBrandPartnersContent(formData) {
  const { data } = await axiosInstance.put('/updateBrandPartnersContent', formData);
  return data.data; // returns updated BrandPartners array
}


// Services (JSON)
export async function updateServicesContent(payload) {
  const { data } = await jsonClient.put('/updateServicesContent', payload);
  return data.data;  // your updated Services array
}

// WhyChooseUsContent update function
export async function updateWhyChooseUsContent(formData) {
  const { data } = await axiosInstance.put('/updateWhyChooseUsContent', formData);
  console.log('Updated WhyChooseUsContent:', data.data); // Log the updated data
  return data.data;
}


// Update FAQs
export async function updateFAQsContent(payload) {
  const { data } = await jsonClient.put('/updateFAQsContent', payload);
  return data.data;
}