import { create } from 'zustand'

interface ActivityFiltersState {
  filters: App.ActivityFilters
  setFilters: (filters: App.ActivityFilters) => void
  resetFilters: () => void
}

export const useActivityFiltersStore = create<ActivityFiltersState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} })
}))
