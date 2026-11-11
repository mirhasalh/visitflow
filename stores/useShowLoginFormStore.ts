import { create } from 'zustand'

interface ShowLoginFormState {
  showLoginForm: boolean
  setShowLoginForm: (value: boolean) => void
}

const useShowLoginFormStore = create<ShowLoginFormState>((set) => ({
  showLoginForm: true,
  setShowLoginForm: (value: boolean) => set({ showLoginForm: value })
}))

export default useShowLoginFormStore
