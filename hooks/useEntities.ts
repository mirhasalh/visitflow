import { useState } from 'react'

export function useEntities() {
  const [entitiesLoaded, setEntitiesLoaded] = useState(false)
  const [page, setPage] = useState(1)
  const [end, setEnd] = useState(10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [count, setCount] = useState(0)
  return { entitiesLoaded, setEntitiesLoaded, page, setPage, end, setEnd, isLoadingMore, setIsLoadingMore, count, setCount }
}
