// mongodb.js

import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || ""
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
} as MongoClientOptions

export type EquipmentType = "head" | "body" | "arm" | "waist" | "leg"

export type Armor = {
  _id?: ObjectId
  name: string
  rarity: number
  equipment_type: EquipmentType
  defense: number
  resistance: { fire: number, water: number, thunder: number, ice: number, dragon: number }
  skills: { name: string, level: number }[]
  slots: number[]
  score?: number
}
/**
 * 装飾品
 */
export type Ornament = {
  _id?: ObjectId
  name: string
  rarity: number
  skill: { name: string, level: number }
  slot: number
}
/**
 * 護石
 */
export type Talisman = {
  _id?: ObjectId
  name: string
  rarity: number
  skills: { name: string, level: number }[]
  slots: number[]
}
/**
 * スキルの型
 */
export type Skill = {
  _id?: ObjectId
  /** スキル名 */
  name: string
  slot: number
  max_level: number
  type: string
  kana: string
  description: string
  request_level?: number
  level?: number
}
export type ArmorSet = {
  head: Armor
  body: Armor
  arm: Armor
  waist: Armor
  leg: Armor
  armor_array: Armor[]
  talisman?: Talisman
  ornaments?: Ornament[]
  score?: number
  is_fulfill_request?: boolean
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     global._mongoClientPromise = client.connect()
//   }
//   clientPromise = global._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>
}
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}
// if (!globalWithMongo._mongoClientPromise) {
//   client = new MongoClient(uri)
//   globalWithMongo._mongoClientPromise = client.connect()
// }
clientPromise = globalWithMongo._mongoClientPromise

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise as Promise<MongoClient>

