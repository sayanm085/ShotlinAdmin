import axios from 'axios'
import api from './api.js' // e.g. "http://localhost:3000/api/"

const axiosInstance = axios.create({
  baseURL: api + 'v1/users',
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchUsers(params = {}) {
  const { data } = await axiosInstance.get('/getalluser', { params })
  return data.data
}
