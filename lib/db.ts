import { MongoClient, Db, ObjectId, Filter } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

const clientPromise = globalForMongo._mongoClientPromise ?? (globalForMongo._mongoClientPromise = new MongoClient(uri).connect())

export const getDb = async (): Promise<Db> => {
  const client = await clientPromise
  return client.db(process.env.DATABASE_NAME)
}

export const getUserByEmail = async (email: string) => {
  const db = await getDb()
  return db.collection('users').findOne({ email })
}

export const getUserById = async (id: string): Promise<App.User | null> => {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  const user = await db.collection('users').findOne<{ _id: ObjectId; name: string; email: string }>({ _id: new ObjectId(id) }, { projection: { name: 1, email: 1 } })

  if (!user) return null

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email
  }
}

export const createUser = async (user: { name: string; email: string; password: string }): Promise<{ id: string } | null> => {
  const db = await getDb()
  try {
    const result = await db.collection('users').insertOne({
      ...user,
      createdAt: new Date()
    })
    return { id: result.insertedId.toString() }
  } catch (err: any) {
    if (err?.code === 11000) return null
    throw err
  }
}

export const getEntities = async (userId: string, page: number, limit: number) => {
  const db = await getDb()
  return db
    .collection('entities')
    .find({ userId: new ObjectId(userId) })
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray()
}

export const addEntity = async (userId: string, entity: { name: string; type: string; segment: 'B2G' | 'B2B'; region: string }) => {
  const db = await getDb()
  const normalizedName = entity.name.trim().toLowerCase()
  try {
    const result = await db.collection('entities').insertOne({
      ...entity,
      normalizedName,
      userId: new ObjectId(userId),
      createdAt: new Date()
    })
    return { id: result.insertedId.toString() }
  } catch (err: any) {
    if (err?.code === 11000) return null
    throw err
  }
}

// TODO: count total for pagination set up
// const total = await db.collection("entities").countDocuments({ owner: userId });

export const countEntities = async (userId: string) => {
  const db = await getDb()
  return db.collection('entities').countDocuments({ userId: new ObjectId(userId) })
}

// export const countActivities = async (userId: string) => {
//   const db = await getDb()
//   return db.collection('activities').countDocuments({ userId: new ObjectId(userId) })
// }

export const addActivity = async (userId: string, entity: App.Entity, visitDate: string, status: 'NOT_VISITED' | 'VISITED', salesName: string, updatedDate: string) => {
  const db = await getDb()
  const normalizedEntityName = entity.name.trim().toLowerCase()
  try {
    const result = await db.collection('activities').insertOne({
      userId: new ObjectId(userId),
      entityId: new ObjectId(entity._id),
      entityName: entity.name,
      normalizedEntityName,
      entityType: entity.type,
      region: entity.region,
      segment: entity.segment,
      visitDate: new Date(visitDate),
      status,
      salesName,
      createdAt: new Date(),
      updatedAt: new Date(updatedDate)
    })
    return { id: result.insertedId.toString() }
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getActivities = async (userId: string, page: number, limit: number) => {
  const db = await getDb()
  return db
    .collection('activities')
    .find({ userId: new ObjectId(userId) })
    .sort({ visitDate: 1, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray()
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const filterActivities = async (userId: string, filters: App.ActivityFilters) => {
  const { segment, status, from, to, search } = filters
  const page = Math.max(filters.page ?? 1, 1)
  const limit = Math.min(Math.max(filters.limit ?? 20, 1), 100)

  const query: Filter<App.Activity> = { userId: new ObjectId(userId) }

  if (segment) query.segment = segment
  if (status) query.status = status

  if (from || to) {
    query.visitDate = {
      ...(from && { $gte: from }),
      ...(to && { $lte: to })
    }
  }

  const normalized = search?.trim().toLowerCase()
  if (normalized) {
    query.normalizedEntityName = { $regex: `^${escapeRegex(normalized)}` }
  }

  const collection = (await getDb()).collection<App.Activity>('activities')

  const [items, total] = await Promise.all([
    collection
      .find(query)
      .sort({ visitDate: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query)
  ])

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
}

export const countActivities = async (userId: string) => {
  const db = await getDb()
  return db.collection('activities').countDocuments({ userId: new ObjectId(userId) })
}

export const updateActivityStatus = async (activityId: string, status: 'NOT_VISITED' | 'VISITED') => {
  if (!ObjectId.isValid(activityId)) return null

  const db = await getDb()
  const result = await db.collection('activities').updateOne({ _id: new ObjectId(activityId) }, { $set: { status, updatedAt: new Date() } })

  return result.modifiedCount > 0
}
