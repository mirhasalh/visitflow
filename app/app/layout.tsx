'use client'

import CorporateFare from '@/components/icons/material/CorporateFare'
import EventNote from '@/components/icons/material/EventNote'
import ToastContainer from '@/components/ToastContainer'
import { useEffect } from 'react'
import useUserStore from '@/stores/useUserStore'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const onGetCurrentUser = async () => {
    try {
      const res = await fetch('/api/get-current-user', { credentials: 'include' })
      const data = await res.json()
      const currentUser = data.user as App.User
      useUserStore.getState().setUser(currentUser)
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  useEffect(() => {
    if (useUserStore.getState().user == null) {
      onGetCurrentUser()
    }
  }, [])

  return (
    <div className="drawer">
      <ToastContainer />
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="left-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <li>
            <a href="/app">
              <EventNote className="h-4 w-4" />
              Activities
            </a>
          </li>
          <li>
            <a href="/app/entities">
              <CorporateFare className="h-4 w-4" />
              Entities
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
