export const fetchEntities = async (page: number, limit: number, onError: (error: string) => void): Promise<App.Entity[]> => {
  try {
    const res = await fetch('/api/get-entities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, limit })
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      onError(data?.error ?? 'Something went wrong.')
      return []
    }

    const data = await res.json()
    return data.entities
  } catch (error) {
    console.error('Error fetching entities:', error)
    onError('Error fetching entities')
    return []
  }
}

export const fetchCountEntities = async (onError: (error: string) => void): Promise<number> => {
  try {
    const res = await fetch('/api/count-entities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      onError(data?.error ?? 'Something went wrong.')
      return 0
    }

    const data = await res.json()
    return data.count
  } catch (error) {
    console.error('Error counting entities:', error)
    onError('Error counting entities')
    return 0
  }
}
