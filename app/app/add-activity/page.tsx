'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/icons/material/Menu'
import Search from '@/components/icons/Search'
import { useToastStore } from '@/stores/useToastStore'
import useUserStore from '@/stores/useUserStore'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import ArrowInsert from '@/components/icons/material/ArrowInsert'
import { useSelectedEntityStore } from '@/stores/useSelectedEntityStore'

export default function AddActivity() {
  const router = useRouter()
  const modalRef = useRef<HTMLDialogElement>(null)
  const user = useUserStore((state) => state.user)
  const addToast = useToastStore((state) => state.addToast)
  const [pending, setPending] = useState(false)
  const [entitiesLoaded, setEntitiesLoaded] = useState(false)
  const { entities, setEntities } = useEntitiesStore()
  const [page, setPage] = useState(1)
  const [entityName, setEntityName] = useState('')
  const { selectedEntity, setSelectedEntity } = useSelectedEntityStore()

  const getEntities = async (page: number) => {
    const response = await fetch('/api/get-entities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user?._id, page, limit: 5 })
    })

    if (response.ok) {
      const data = await response.json()
      setEntities(data.entities)
    } else {
      console.error('Failed to fetch entities')
    }
    setEntitiesLoaded(true)
  }

  const onSetPage = async (page: number) => {
    setEntitiesLoaded(false)
    setPage(page + 1)
    await getEntities(page + 1)
  }

  const openModal = () => {
    modalRef.current?.showModal()
    getEntities(page)
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  const onInsert = (entity: App.Entity) => {
    setEntityName(entity.name)
    setSelectedEntity(entity)
    closeModal()
    setPage(1)
  }

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const entity = selectedEntity
    const visitDate = formData.get('visitDate') as string
    const salesName = formData.get('salesName') as string

    if (!entity) {
      addToast('Please select an entity.')
      setPending(false)
      return
    }

    try {
      const res = await fetch('/api/add-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entity,
          visitDate,
          status: 'NOT_VISITED',
          salesName,
          updatedDate: new Date().toISOString()
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        addToast(data?.error ?? 'Something went wrong.')
        return
      }

      router.push('/app')
      router.refresh()
    } catch (error) {
      console.error('Error adding activity:', error)
      addToast('An error occurred while adding the activity.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <label className="input w-full">
            <Search />
            <input type="search" required placeholder="Search" />
          </label>
          {entitiesLoaded ? (
            <ul className="list">
              {entities.map((entity) => (
                <li key={entity._id} className="list-row">
                  <div>
                    <div className="avatar avatar-placeholder">
                      <div className="bg-base-300 w-10 rounded-xl">
                        <span>{entity.segment}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>{entity.name}</div>
                    <div className="text-xs font-semibold uppercase opacity-60">
                      {entity.region} • <small className="opacity-60">{entity.type}</small>
                    </div>
                  </div>
                  <button className="btn btn-square btn-sm" type="button" onClick={() => onInsert(entity)}>
                    <ArrowInsert className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list">
              {[...Array(5)].map((_, index) => (
                <li key={index} className="list-row">
                  <div>
                    <div className="avatar avatar-placeholder">
                      <div className="skeleton w-10 rounded-xl">
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-20"></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-center">
            <div className="join">
              {[...Array(5)].map((_, index) => (
                <button key={index} className={`btn btn-sm ${page === index + 1 ? 'btn-active' : ''}`} onClick={() => onSetPage(index)}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <header className="navbar bg-base-100 border-base-content/10 border-b-1">
        <div className="flex-none">
          <label htmlFor="left-drawer" className="btn btn-square btn-ghost drawer-button">
            <Menu className="h-5 w-5" />
          </label>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/app/add-activity">
            Add activity
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
                  <label className="label" htmlFor="entityToVisit">
                    Entity to visit
                  </label>
                  <input className="input w-full" type="text" name="entityToVisit" id="entityToVisit" value={entityName} placeholder="Kantor Layanan Melati" readOnly onClick={() => openModal()} />
                  <label className="label" htmlFor="visitDate">
                    Visit date
                  </label>
                  <input type="date" className="input w-full" name="visitDate" id="visitDate" />
                  <label className="label" htmlFor="salesName">
                    Sales name
                  </label>
                  <input className="input w-full" type="text" name="salesName" id="salesName" placeholder="Tony Stark" />
                  <button type="submit" className="btn mt-4 w-full" disabled={pending}>
                    {pending ? <span className="loading loading-spinner loading-sm"></span> : 'Add activity'}
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
