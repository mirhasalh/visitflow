declare global {
  namespace App {
    interface User {
      _id: string
      name: string
      email: string
    }
    interface Activity {
      _id: string
      entityId?: string
      entityName: string
      normalizedEntityName: string
      entityType: string
      region: string
      segment: 'B2G' | 'B2B'
      visitDate: Date
      status: 'NOT_VISITED' | 'VISITED'
      salesName?: string
      createdAt: Date
      updatedAt: Date
    }
    interface Entity {
      _id: string
      name: string
      normalizedName: string
      type: string
      segment: 'B2G' | 'B2B'
      region: string
    }
    interface ActivityFilters {
      segment?: Segment
      status?: Status
      from?: Date
      to?: Date
      search?: string
      page?: number
      limit?: number
    }
  }
}

export {}
