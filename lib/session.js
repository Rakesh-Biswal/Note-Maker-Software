// Session utilities built on top of jwt helpers
import { readToken } from "./jwt"
import { getDb } from "./mongodb"

export async function getCurrentUser() {
  const token = await readToken()
  if (!token) return null

  const db = await getDb()
  const users = db.collection("users")

  // We removed uid. Try lookup by email first, then by phone.
  if (token.email) {
    const u = await users.findOne({ email: token.email })
    if (u) return u
  }
  if (token.phone) {
    const u = await users.findOne({ phone: token.phone })
    if (u) return u
  }
  return null
}
