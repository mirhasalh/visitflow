import { create } from 'zustand'

interface SelectedEntityState {
  selectedEntity: App.Entity | null
  setSelectedEntity: (entity: App.Entity | null) => void
}

export const useSelectedEntityStore = create<SelectedEntityState>((set) => ({
  selectedEntity: null,
  setSelectedEntity: (entity) => set({ selectedEntity: entity })
}))
