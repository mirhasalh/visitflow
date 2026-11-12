type OnError = (error: string) => void
type OnValue = (value: number) => void

export const fetchCountAvtivities = async (onError: OnError): Promise<number> => {
  try {
    const res = await fetch('/api/count-activities', {
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
    console.error('Error fetching activities:', error)
    onError('Error fetching activities')
    return 0
  }
}

export const fetchActivities = async (page: number, limit: number, onError: OnError): Promise<App.Activity[]> => {
  try {
    const res = await fetch('/api/get-activities', {
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
    return data.activities
  } catch (error) {
    console.error('Error fetching activities:', error)
    onError('Error fetching activities')
    return []
  }
}

type SearchArguments = {
  filters: App.ActivityFilters
  from: string
  to: string
  onError: OnError
  onValue: (value: any) => void
}

export const fetchSearchActivities = async ({ filters, from, to, onError, onValue }: SearchArguments): Promise<void> => {
  try {
    const res = await fetch(`/api/filter-activities?segment=${filters.segment ?? ''}&status=${filters.status ?? ''}&from=${from}&to=${to}&search=${filters.search ?? ''}&page=1&limit=10`)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      onError(data?.error ?? 'Something went wrong.')
      return
    }

    const data = await res.json()
    onValue(data)
  } catch (error) {
    console.error('Error filtering activities:', error)
    onError('Error filtering activities')
  }
}

export const fetchUpdateActivityStatus = async (activityId: string, status: string, onError: OnError, onValue: (value: any) => void): Promise<void> => {
  try {
    const res = await fetch('/api/update-activity-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId, status })
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      onError(data?.error ?? 'Something went wrong.')
      return
    }

    const data = await res.json()
    onValue(data)
  } catch (error) {
    console.error('Error updating activity status:', error)
    onError('Error updating activity status')
  }
}
