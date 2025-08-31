import { NextResponse } from "next/server"
import admin from "@/lib/firebaseAdmin"
import { getDb } from "@/lib/mongodb"
import { setSessionCookie } from "@/lib/jwt"
import { sendEmail, signupEmailTemplate } from "@/lib/email"

export async function POST(req) {
  try {
    const { idToken, profile } = await req.json()
    if (!idToken) throw new Error("Missing phone auth token")

    const decoded = await admin.auth().verifyIdToken(idToken)
    const phone = decoded.phone_number
    if (!phone) throw new Error("Invalid phone token")

    const db = await getDb()
    const users = db.collection("users")
    const now = new Date()

    const existsByPhone = await users.findOne({ phone })
    if (existsByPhone) {
      return NextResponse.json(
        { ok: false, action: "signin_required", error: "Account already exists with this phone" },
        { status: 409 },
      )
    }

    // Prevent duplicate email if provided
    if (profile?.email) {
      const existsByEmail = await users.findOne({ email: profile.email })
      if (existsByEmail) {
        return NextResponse.json(
          { ok: false, action: "signin_required", error: "Account already exists with this email" },
          { status: 409 },
        )
      }
    }

    const newUser = {
      name: (profile?.name || "").trim(),
      email: (profile?.email || "").trim(),
      phone: phone.trim(),
      picture: (profile?.picture || "").trim(),
      createdAt: now,
      updatedAt: now,
    }

    await users.insertOne(newUser)

    const res = NextResponse.json({ ok: true, action: "signup", user: newUser })
    await setSessionCookie({ email: newUser.email || null, phone: newUser.phone }, res)

    if (newUser.email) {
      await sendEmail({
        to: newUser.email,
        subject: "Welcome!",
        html: signupEmailTemplate({ name: newUser.name }),
      }).catch(() => {})
    }

    return res
  } catch (e) {
    console.error("phone/signup error:", e)
    return NextResponse.json({ ok: false, error: e.message || "Phone sign-up failed" }, { status: 400 })
  }
}
