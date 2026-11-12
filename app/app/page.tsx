'use client'

import { useEffect } from 'react'

import LogOutForm from '@/components/LogOutForm'
import VisitFlowLogo from '@/components/VisitFlowLogo'
import Search from '@/components/icons/Search'
import Add from '@/components/icons/material/Add'
import Archive from '@/components/icons/material/Archive'
import FilterList from '@/components/icons/material/FilterList'
import Menu from '@/components/icons/material/Menu'
import MoreVert from '@/components/icons/material/MoreVert'
import { useApp } from '@/hooks/useApp'
import useActivitiesStore from '@/stores/useActivitiesStore'
import { useActivityFiltersStore } from '@/stores/useActivityFiltersStore'
import { useToastStore } from '@/stores/useToastStore'
import useUserStore from '@/stores/useUserStore'
import { blurActiveElement } from '@/utils'
import { formatDate, formatted } from '@/utils/stringFormatter'

import { fetchActivities, fetchCountAvtivities, fetchSearchActivities, fetchUpdateActivityStatus } from './helpers'

export default function App() {
  const { modalRef, activitiesLoaded, setActivitiesLoaded, from, setFrom, to, setTo, page, setPage, endPage, setEndPage, isLoadingMore, setIsLoadingMore } = useApp()
  const addToast = useToastStore((state) => state.addToast)
  const user = useUserStore((state) => state.user)
  const { activities, setActivities } = useActivitiesStore()
  const { filters, setFilters } = useActivityFiltersStore()
  const limit = 10

  const onCountAvtivities = async () => {
    await fetchCountAvtivities(
      limit,
      (error) => addToast(error),
      (value) => setEndPage(value)
    )
  }

  const onGetActivities = async (page: number): Promise<App.Activity[]> => {
    const newActivities = await fetchActivities(page, limit, (error) => addToast(error))
    return newActivities
  }

  const initActivity = async () => {
    const activities = await onGetActivities(page)
    setActivities(activities)
    setActivitiesLoaded(true)
  }

  const onLoadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    const moreActivities = await onGetActivities(nextPage)
    setActivities([...activities, ...moreActivities])
    setIsLoadingMore(false)
  }

  const openModal = () => modalRef.current?.showModal()

  const closeModal = () => modalRef.current?.close()

  const onSearch = async () => {
    await fetchSearchActivities({
      filters,
      from,
      to,
      onError: (error) => {
        addToast(error)
        closeModal()
      },
      onValue: (value) => {
        setActivities(value.items)
        closeModal()
      }
    })
  }

  const onArchive = (index: number) => {
    // TODO: fetch archive activity
    addToast(`[${index}] Under development.`)
    blurActiveElement()
  }

  const onToggleStatus = async (activityId: string, status: string) => {
    const newStatus = status === 'NOT_VISITED' ? 'VISITED' : 'NOT_VISITED'
    await fetchUpdateActivityStatus(
      activityId,
      newStatus,
      (error) => addToast(error),
      (_) => {
        const findIndex = activities.findIndex((activity) => activity._id === activityId)
        if (findIndex !== -1) {
          const updatedActivities = [...activities]
          updatedActivities[findIndex].status = newStatus
          setActivities(updatedActivities)
        }
      }
    )
    blurActiveElement()
  }

  useEffect(() => {
    const today = formatDate(new Date())
    setFrom(today)
    setTo(today)
    onCountAvtivities()
    initActivity()
  }, [])
  return (
    <div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <fieldset className="fieldset w-full">
            <label className="input w-full">
              <Search />
              <input type="search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} required placeholder="Search by entity name" />
            </label>
            <div className="flex gap-1">
              <div className="flex-1">
                <fieldset className="fieldset">
                  <label className="label" htmlFor="from">
                    From
                  </label>
                  <input className="input" id="from" name="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </fieldset>
              </div>
              <div className="flex-1">
                <fieldset className="fieldset">
                  <label className="label" htmlFor="to">
                    To
                  </label>
                  <input className="input" id="to" name="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </fieldset>
              </div>
            </div>
            <label className="label" htmlFor="segment">
              Segment
            </label>
            <select className="select w-full" name="segment" id="segment" value={filters.segment} onChange={(e) => setFilters({ ...filters, segment: e.target.value })}>
              <option value="B2G">B2G</option>
              <option value="B2B">B2B</option>
            </select>
            <label className="label" htmlFor="status">
              Status
            </label>
            <select className="select w-full" name="status" id="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="NOT_VISITED">NOT_VISITED</option>
              <option value="VISITED">VISITED</option>
            </select>
          </fieldset>
          <div className="modal-action">
            <button className="btn" type="button" onClick={onSearch}>
              Search
            </button>
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
          <a className="btn btn-ghost text-xl" href="/app">
            <VisitFlowLogo className="h-8 w-8" />
            Visit Flow
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal gap-1 px-1">
            <li>
              <button className="btn btn-square" type="button" onClick={openModal}>
                <FilterList className="h-5 w-5" />
              </button>
            </li>
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
              <p className="btn btn-ghost text-xl">Activities</p>
            </div>
            <div className="flex-none">
              <div className="tooltip tooltip-left" data-tip="Add activity">
                <a className="btn btn-square" href="/app/add-activity">
                  <Add className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          {activitiesLoaded ? (
            <ul className="list bg-base-100">
              {activities && activities.length == 0 ? (
                <li className="list-row rounded-none">
                  <div></div>
                  No activities found.
                </li>
              ) : (
                activities.map((activity, index) => (
                  <li key={activity._id} className="list-row rounded-none">
                    <div>
                      {activity.segment == 'B2G' ? (
                        <div className="tooltip tooltip-right" data-tip="Business-to-Government">
                          <div className="avatar avatar-placeholder">
                            <div className="bg-base-300 w-10 rounded-xl">
                              <span>{activity.segment}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="tooltip tooltip-right" data-tip="Business-to-Business">
                          <div className="avatar avatar-placeholder">
                            <div className="bg-base-300 w-10 rounded-xl">
                              <span>{activity.segment}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div>
                        <time dateTime={new Date(activity.visitDate).toISOString()}>{formatted(new Date(activity.visitDate).toISOString())}</time>
                      </div>
                      <div className="text-xs opacity-60">{`${activity.entityType}, ${activity.entityName}, ${activity.region}`}</div>
                      <small className="opacity-60">{activity.salesName}</small>
                    </div>
                    <div>
                      <button className={`btn-sm ${activity.status == 'NOT_VISITED' ? 'btn' : 'btn btn-success'}`}>
                        <span>{activity.status}</span>
                      </button>
                      <div className="dropdown dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-square m-1">
                          <MoreVert className="h-4 w-4" />
                        </div>
                        <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                          <li>
                            <button type="button" onClick={() => onToggleStatus(activity._id, activity.status)}>
                              {`${activity.status == 'NOT_VISITED' ? 'Mark as VISITED' : 'Mark as NOT_VISITED'}`}
                            </button>
                          </li>
                          <li>
                            <button type="button" className="text-error" onClick={() => onArchive(index)}>
                              <Archive className="h-4 w-4" />
                              Archive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ))
              )}
              <li className="list-row rounded-none">
                <div></div>
                <div className="flex justify-center">
                  <button className="btn" type="button" onClick={onLoadMore} disabled={page >= endPage || isLoadingMore}>
                    {isLoadingMore ? <span className="loading loading-spinner loading-sm"></span> : <span>{`${page >= endPage ? 'All data loaded' : 'Load more'}`}</span>}
                  </button>
                </div>
                <div></div>
              </li>
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
