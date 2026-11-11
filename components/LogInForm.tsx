'use client'

import useShowLoginFormStore from '@/stores/useShowLoginFormStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToastStore } from '@/stores/useToastStore'
import useUserStore from '@/stores/useUserStore'

export default function LogInForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  const setShowLoginForm = useShowLoginFormStore((state) => state.setShowLoginForm)
  const setUser = useUserStore((state) => state.setUser)

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: new FormData(e.currentTarget)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        addToast(data?.error ?? 'Something went wrong.')
        return
      }

      const data: { user: App.User } = await res.json()
      setUser(data.user)
      router.push('/app')
      router.refresh()
    } catch {
      addToast('Network error. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="w-full min-w-0 flex-1" onSubmit={onSubmit} aria-labelledby="login-title">
      <fieldset className="fieldset w-full">
        <legend id="login-title" className="fieldset-legend hidden">
          Log in to your account
        </legend>
        <label htmlFor="login-email" className="label">
          Email
        </label>
        <input id="login-email" name="email" type="email" className="input w-full" placeholder="you@example.com" autoComplete="email" inputMode="email" required />
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <input id="login-password" name="password" type="password" className="input w-full" placeholder="Password" autoComplete="current-password" minLength={8} required />
        <button type="submit" className="btn btn-neutral mt-4 w-full" disabled={pending}>
          Login
        </button>
        <div className="divider" role="separator" aria-label="or">
          OR
        </div>
        <button type="button" className="btn w-full" onClick={() => setShowLoginForm(false)}>
          Create a new account
        </button>
      </fieldset>
    </form>
  )
}
