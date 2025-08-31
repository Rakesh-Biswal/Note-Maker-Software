import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { getDb } from "@/lib/mongodb"
import { setSessionCookie } from "@/lib/jwt"
import { sendEmail, signupEmailTemplate } from "@/lib/email"

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export async function POST(req) {
  try {
    const { idToken, profile } = await req.json()
    if (!idToken) throw new Error("Missing Google ID token")

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload?.email) throw new Error("Invalid Google token")

    const db = await getDb()
    const users = db.collection("users")
    const now = new Date()

    const existing = await users.findOne({ email: payload.email })
    if (existing) {
      const res = NextResponse.json({ ok: true, action: "signin", user: existing })
      await setSessionCookie({ email: existing.email }, res)
      return res
    }

    const newUser = {
      name: (profile?.name || payload.name || "").trim(),
      email: (payload.email || "").trim(),
      phone: (profile?.phone || profile?.phoneNumber || "").trim(),
      picture: profile?.picture || payload.picture || "",
      createdAt: now,
      updatedAt: now,
    }

    await users.insertOne(newUser)

    const res = NextResponse.json({ ok: true, action: "signup", user: newUser })
    await setSessionCookie({ email: newUser.email }, res)

    if (newUser.email) {
      await sendEmail({
        to: newUser.email,
        subject: "Welcome!",
        html: signupEmailTemplate({ name: newUser.name }),
      }).catch(() => {})
    }

    return res
  } catch (e) {
    console.error("google/signup error:", e)
    return NextResponse.json({ ok: false, error: e.message || "Google sign-up failed" }, { status: 400 })
  }
}
