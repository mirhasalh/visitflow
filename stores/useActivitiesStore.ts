import { create } from 'zustand'

interface ActivitiesState {
  activities: App.Activity[]
  setActivities: (activities: App.Activity[]) => void
}

const useActivitiesStore = create<ActivitiesState>((set) => ({
  activities: [],
  setActivities: (activities) => set({ activities })
}))

export default useActivitiesStore
