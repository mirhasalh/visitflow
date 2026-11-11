'use client'

import { useToastStore } from '@/stores/useToastStore'
import Close from './icons/material/Close'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="alert border-base-content/10 border-1 shadow-none" role="alert">
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="btn btn-ghost btn-circle">
            <Close className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
