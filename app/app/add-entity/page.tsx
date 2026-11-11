'use client'

import Menu from '@/components/icons/material/Menu'
import useUserStore from '@/stores/useUserStore'
import { useToastStore } from '@/stores/useToastStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddEntity() {
  const router = useRouter()
  const addToast = useToastStore((state) => state.addToast)
  const [pending, setPending] = useState(false)
  const user = useUserStore((state) => state.user)

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    try {
      const res = await fetch('/api/add-entity', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?._id,
          name: event.currentTarget.entityName.value,
          type: event.currentTarget.type.value,
          segment: event.currentTarget.segment.value,
          region: event.currentTarget.region.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        addToast(data?.error ?? 'Something went wrong.')
        return
      }

      router.push('/app/entities')
      router.refresh()
    } catch {
      addToast('Network error. Please try again.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div>
      <header className="navbar bg-base-100 border-base-content/10 border-b-1">
        <div className="flex-none">
          <label htmlFor="left-drawer" className="btn btn-square btn-ghost drawer-button">
            <Menu className="h-5 w-5" />
          </label>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/app/add-entity">
            Add entity
          </a>
        </div>
        <div className="flex-none"></div>
      </header>
      <main>
        <section className="hero bg-base-200 min-h-screen">
          <div className="hero-content w-full text-center">
            <div className="w-full max-w-md">
              <form className="w-full min-w-0 flex-1" onSubmit={onSubmit}>
                <fieldset className="fieldset w-full">
                  <label className="label" htmlFor="entityName">
                    Name
                  </label>
                  <input className="input w-full" type="text" name="entityName" id="entityName" placeholder="Kantor Layanan Melati" />
                  <label className="label" htmlFor="type">
                    Type
                  </label>
                  <input className="input w-full" type="text" name="type" id="type" placeholder="Instansi" />
                  <label className="label" htmlFor="segment">
                    Segment
                  </label>
                  <select className="select w-full" name="segment" id="segment">
                    <option value="">Select segment</option>
                    <option value="B2G">B2G</option>
                    <option value="B2B">B2B</option>
                  </select>
                  <label className="label" htmlFor="region">
                    Region
                  </label>
                  <input className="input w-full" type="text" name="region" id="region" placeholder="Jakarta" />
                  <button type="submit" className="btn mt-4 w-full" disabled={pending}>
                    {pending ? <span className="loading loading-spinner loading-sm"></span> : 'Add entity'}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
