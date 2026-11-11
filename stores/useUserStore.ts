import { create } from 'zustand'

interface UserStore {
  user: App.User | null
  setUser: (user: App.User | null) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

export default useUserStore
