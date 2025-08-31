import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readToken } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"
import { sendEmail, noteActivityTemplate } from "@/lib/email"
import crypto from "crypto"

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    const payload = await readToken(token)
    if (!payload?.email) return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = await getDb()
  const notes = await db
    .collection("notes")
    .find({ email: user.email })
    .sort({ updatedAt: -1 })
    .project({ _id: 0 })
    .toArray()

  // ✅ Convert dates to strings before returning
  const safeNotes = notes.map(n => ({
    ...n,
    createdAt: n.createdAt?.toISOString(),
    updatedAt: n.updatedAt?.toISOString(),
  }))

  return NextResponse.json({ notes: safeNotes })
}

export async function POST(req) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, content, imageUrl } = await req.json()
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 })

  const db = await getDb()
  const now = new Date()
  const doc = {
    id: crypto.randomUUID(),
    email: user.email,
    title,
    content: content || "",
    imageUrl: imageUrl || null,
    createdAt: now,
    updatedAt: now,
  }

  await db.collection("notes").insertOne(doc)

  const u = await db.collection("users").findOne({ email: user.email })
  if (u?.email) {
    await sendEmail({
      to: u.email,
      subject: "Note created in NoteFlow",
      html: noteActivityTemplate({ name: u.name, action: "create", noteTitle: title }),
    }).catch(() => {})
  }

  // ✅ return with dates as strings
  return NextResponse.json(
    {
      note: {
        ...doc,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      },
    },
    { status: 201 },
  )
}
