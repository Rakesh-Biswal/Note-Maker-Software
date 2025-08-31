import { NextResponse } from "next/server"
import admin from "@/lib/firebaseAdmin"
import { getDb } from "@/lib/mongodb"
import { setSessionCookie } from "@/lib/jwt"

export async function POST(req) {
  try {
    const { idToken } = await req.json()
    if (!idToken) throw new Error("Missing phone auth token")

    const decoded = await admin.auth().verifyIdToken(idToken)
    const phone = decoded.phone_number
    if (!phone) throw new Error("Invalid phone token")

    const db = await getDb()
    const users = db.collection("users")
    const existing = await users.findOne({ phone })
    if (!existing) {
      return NextResponse.json(
        { ok: false, action: "signup_required", error: "No account for this phone number" },
        { status: 404 },
      )
    }

    const res = NextResponse.json({ ok: true, action: "signin", user: existing })
    await setSessionCookie({ email: existing.email || null, phone: existing.phone }, res)
    return res
  } catch (e) {
    console.error("phone/signin error:", e)
    return NextResponse.json({ ok: false, error: e.message || "Phone sign-in failed" }, { status: 400 })
  }
}
