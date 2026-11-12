'use client'

import Menu from '@/components/icons/material/Menu'
import Remove from '@/components/icons/material/Remove'
import LogOutForm from '@/components/LogOutForm'
import VisitFlowLogo from '@/components/VisitFlowLogo'
import { useToastStore } from '@/stores/useToastStore'
import { useEntitiesStore } from '@/stores/useEntitiesStore'
import { useEffect, useState } from 'react'
import useUserStore from '@/stores/useUserStore'

export default function Entities() {
  const addToast = useToastStore((state) => state.addToast)
  const user = useUserStore((state) => state.user)
  const [entitiesLoaded, setEntitiesLoaded] = useState(false)
  const { entities, setEntities } = useEntitiesStore()

  const getEntities = async () => {
    const response = await fetch('/api/get-entities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page: 1, limit: 10 })
    })

    if (response.ok) {
      const data = await response.json()
      setEntities(data.entities)
    } else {
      console.error('Failed to fetch entities')
    }
    setEntitiesLoaded(true)
  }

  const onOpenMenu = () => addToast('Under development.')

  useEffect(() => {
    getEntities()
  }, [])
  return (
    <div>
      <header className="navbar bg-base-100 border-base-content/10 border-b-1">
        <div className="flex-none">
          <label htmlFor="left-drawer" className="btn btn-square btn-ghost drawer-button">
            <Menu className="h-5 w-5" />
          </label>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/app">
            <VisitFlowLogo className="h-8 w-8" />
            Visit Flow
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal gap-1 px-1">
            <li>
              <button className="btn btn-circle btn-info" popoverTarget="popover-1" style={{ anchorName: '--anchor-1' }}>
                {user ? <p className="uppercase">{user.name[0]}</p> : <div></div>}
              </button>
              <ul className="dropdown dropdown-end menu rounded-box bg-base-100 w-52 shadow-sm" popover="auto" id="popover-1" style={{ positionAnchor: '--anchor-1' }}>
                <li>{user ? <p>{user.email}</p> : <div></div>}</li>
                <li>
                  <LogOutForm />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <section className="">
          <div className="navbar bg-base-100 border-base-content/10 sticky top-0 z-10 border-b-1">
            <div className="flex-1">
              <p className="btn btn-ghost text-xl">Entities</p>
            </div>
            <div className="flex-none">
              <a className="btn" href="/app/add-entity">
                Add entity
              </a>
            </div>
          </div>
          {entitiesLoaded ? (
            <ul className="list bg-base-100">
              {entities.length === 0 ? (
                <li className="list-row rounded-none">
                  <div></div>
                  No entities found.
                </li>
              ) : (
                entities.map((entity) => (
                  <li key={entity._id} className="list-row rounded-none">
                    <div>
                      <div className="avatar avatar-placeholder">
                        <div className="bg-base-300 w-10 rounded-xl">
                          <span>{entity.segment}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>{entity.name}</div>
                      <div className="text-xs font-semibold uppercase opacity-60">{entity.region}</div>
                      <small className="opacity-60">{entity.type}</small>
                    </div>
                    <button className="btn btn-sm btn-square" onClick={onOpenMenu}>
                      <Remove className="h-4 w-4" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <ul className="list bg-base-100">
              <li className="list-row rounded-none">
                <div></div>
                <div className="grid gap-1">
                  <div className="skeleton h-4 w-32"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              </li>
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
