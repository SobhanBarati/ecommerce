import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (will be implemented in auth milestone)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        // Will implement auth redirect later
        // window.location.href = '/login'
      }
    }
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    
    return Promise.reject(error)
  }
)

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message || error.message || 'خطایی رخ داده است'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'خطایی ناشناخته رخ داده است'
}