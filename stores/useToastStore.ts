import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, message, duration }

    set((state) => ({ toasts: [...state.toasts, newToast] }))

    setTimeout(() => {
      get().removeToast(id)
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}))
