// app/api/notes/[id]/reminder/route.js
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readToken } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { sendEmail, reminderEmailTemplate } from "@/lib/email"

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

export async function POST(req, { params }) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { reminder } = await req.json()
  
  if (!reminder) {
    return NextResponse.json({ error: "Reminder date is required" }, { status: 400 })
  }

  const db = await getDb()
  
  try {
    // Get the note first to check if it exists and get its title
    const note = await db.collection("notes").findOne({ id })
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    const result = await db.collection("notes").findOneAndUpdate(
      { id },
      { 
        $set: { 
          reminder: new Date(reminder),
          updatedAt: new Date()
        } 
      },
      { returnDocument: "after" }
    )

    // Get user details for email
    const userDetails = await db.collection("users").findOne({
      $or: [
        { email: user.email },
        { phone: user.phone }
      ]
    })

    // Send confirmation email if user has email
    if (userDetails?.email) {
      const reminderDate = new Date(reminder)
      const formattedDate = reminderDate.toLocaleString()
      
      await sendEmail({
        to: userDetails.email,
        subject: `Reminder set for your note: ${note.title || "Untitled Note"}`,
        html: reminderEmailTemplate({
          name: userDetails.name || "User",
          noteTitle: note.title || "Untitled Note",
          reminderDate: formattedDate,
          action: "set"
        })
      }).catch(error => {
        console.error("Failed to send reminder confirmation email:", error)
        // Don't throw error, just log it
      })
    }

    return NextResponse.json({ 
      success: true, 
      reminder: result.value?.reminder || null 
    })
  } catch (error) {
    console.error("Reminder set error:", error)
    return NextResponse.json({ error: "Failed to set reminder" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const db = await getDb()
  
  try {
    // Get the note first to check if it exists and get its title
    const note = await db.collection("notes").findOne({ id })
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    const result = await db.collection("notes").findOneAndUpdate(
      { id },
      { 
        $unset: { reminder: "" },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: "after" }
    )

    // Get user details for email
    const userDetails = await db.collection("users").findOne({
      $or: [
        { email: user.email },
        { phone: user.phone }
      ]
    })

    // Send cancellation email if user has email
    if (userDetails?.email) {
      await sendEmail({
        to: userDetails.email,
        subject: `Reminder removed for your note: ${note.title || "Untitled Note"}`,
        html: reminderEmailTemplate({
          name: userDetails.name || "User",
          noteTitle: note.title || "Untitled Note",
          action: "removed"
        })
      }).catch(error => {
        console.error("Failed to send reminder removal email:", error)
        // Don't throw error, just log it
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reminder remove error:", error)
    return NextResponse.json({ error: "Failed to remove reminder" }, { status: 500 })
  }
}