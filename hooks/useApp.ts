import { useRef, useState } from 'react'

export function useApp() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [activitiesLoaded, setActivitiesLoaded] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [endPage, setEndPage] = useState(10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  return { modalRef, activitiesLoaded, setActivitiesLoaded, from, setFrom, to, setTo, page, setPage, endPage, setEndPage, isLoadingMore, setIsLoadingMore }
}
