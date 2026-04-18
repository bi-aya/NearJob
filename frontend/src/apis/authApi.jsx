import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import config from '../../Config/config'
 
const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})
 
// Interceptor request — injecte le token automatiquement sur chaque requête
api.interceptors.request.use(
  async (req) => {
    const token = await SecureStore.getItemAsync('accessToken')
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
  },
  (error) => Promise.reject(error)
)
 
// Interceptor response — refresh token si 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken')
        const res = await axios.post(`${config.BASE_URL}/auth/refresh`, { refreshToken })
        const newToken = res.data.accessToken
        await SecureStore.setItemAsync('accessToken', newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        
        return api(original)
      } catch {
        await SecureStore.deleteItemAsync('accessToken')
        await SecureStore.deleteItemAsync('refreshToken')
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
 
// ─── Fonctions auth ───────────────────────────────────────────────────
 
export const loginApi = ({ email, password }) =>
  api.post('/auth/login', { email, password })  

 
export const registerApi = ({ email, password, role, firstName, lastName }) =>
  api.post('/auth/register', { email, password, role, firstName, lastName })
 
export const getMeApi = () =>
  api.get('/auth/me')
 
export const refreshApi = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken })
 
export default api