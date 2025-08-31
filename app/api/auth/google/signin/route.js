import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { getDb } from "@/lib/mongodb"
import { setSessionCookie } from "@/lib/jwt"

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export async function POST(req) {
  try {
    const { idToken } = await req.json()
    if (!idToken) throw new Error("Missing Google ID token")

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload?.email) throw new Error("Invalid Google token")

    const db = await getDb()
    const users = db.collection("users")

    const existing = await users.findOne({ email: payload.email })
    if (existing) {
      const res = NextResponse.json({ ok: true, action: "signin", user: existing })
      await setSessionCookie({ email: existing.email }, res)
      return res
    }

    // Not found -> return prefill data for signup
    return NextResponse.json({
      ok: true,
      action: "signup_prefill",
      user: {
        name: payload.name || "",
        email: payload.email || "",
        phone: "",
        picture: payload.picture || "",
      },
    })
  } catch (e) {
    console.error("google/signin error:", e)
    return NextResponse.json({ ok: false, error: e.message || "Google sign-in failed" }, { status: 400 })
  }
}
