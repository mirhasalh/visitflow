import { create } from 'zustand'

interface EntitiesState {
  entities: App.Entity[]
  setEntities: (entities: App.Entity[]) => void
}

export const useEntitiesStore = create<EntitiesState>((set) => ({
  entities: [],
  setEntities: (entities) => set({ entities })
}))
