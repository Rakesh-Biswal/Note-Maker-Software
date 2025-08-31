// Exchange Firebase ID token for app JWT session cookie and upsert user (JS)
import { NextResponse } from "next/server"
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin"
import { getDb } from "@/lib/mongodb"
import { createSessionJWT } from "@/lib/jwt"

export async function POST(req) {
  try {
    const { firebaseIdToken, profile = {} } = await req.json()
    if (!firebaseIdToken) {
      return NextResponse.json({ error: "Missing firebaseIdToken" }, { status: 400 })
    }
    const decoded = await verifyFirebaseIdToken(firebaseIdToken)
    const db = await getDb()
    const users = db.collection("users")

    const uid = decoded.uid
    const email = profile.email || decoded.email || ""
    const phone = profile.phone || decoded.phone_number || ""
    const name = profile.name || decoded.name || ""

    const now = new Date()
    const update = {
      $setOnInsert: { createdAt: now },
      $set: {
        updatedAt: now,
        uid,
        email,
        phone,
        name,
        providers: decoded.firebase?.sign_in_provider ? [decoded.firebase.sign_in_provider] : [],
      },
    }

    await users.updateOne({ uid }, update, { upsert: true })
    const user = await users.findOne({ uid }, { projection: { _id: 0 } })

    const token = await createSessionJWT({
      sub: uid,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    })

    const res = NextResponse.json({ user })
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Auth failed" }, { status: 401 })
  }
}
