import { create } from 'zustand'

interface UIState {
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Filters
  filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
  }
  setFilter: (key: keyof UIState['filters'], value: any) => void
  clearFilters: () => void
  
  // Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // Toast notifications
  toast: {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    visible: boolean
  }
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  hideToast: () => void
  
  // Modal
  modal: {
    isOpen: boolean
    content: React.ReactNode | null
  }
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Filters
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () => set({ filters: {} }),
  
  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Toast
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
  showToast: (message, type = 'info') =>
    set({
      toast: { message, type, visible: true },
    }),
  hideToast: () =>
    set((state) => ({
      toast: { ...state.toast, visible: false },
    })),
  
  // Modal
  modal: {
    isOpen: false,
    content: null,
  },
  openModal: (content) =>
    set({
      modal: { isOpen: true, content },
    }),
  closeModal: () =>
    set({
      modal: { isOpen: false, content: null },
    }),
}))