// MongoDB connection helper (JS)
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { ignoreUndefined: true })
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export async function getDb() {
  const conn = await clientPromise
  return conn.db() // default DB from uri
}
