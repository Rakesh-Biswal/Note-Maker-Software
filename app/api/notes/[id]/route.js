import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readToken } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"
import { sendEmail, noteActivityTemplate } from "@/lib/email"

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    return await readToken(token)
  } catch {
    return null
  }
}

export async function PUT(req, { params }) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { title, content, imageUrl } = await req.json()
  const db = await getDb()

  const res = await db
    .collection("notes")
    .findOneAndUpdate(
      { id, email: user.email },
      { $set: { title, content, imageUrl: imageUrl || null, updatedAt: new Date() } },
      { returnDocument: "after", projection: { _id: 0, id: 1, title: 1, content: 1, imageUrl: 1, updatedAt: 1 } },
    )

  const u = await db.collection("users").findOne({ email: user.email })
  if (u?.email) {
    await sendEmail({
      to: u.email,
      subject: "Note updated in NoteFlow",
      html: noteActivityTemplate({ name: u.name, action: "update", noteTitle: title }),
    }).catch(() => {})
  }

  return NextResponse.json({ note: res.value })
}

export async function DELETE(req, { params }) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 })
  }

  const db = await getDb()
  const result = await db.collection("notes").deleteOne({ id, email: user.email })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
