// app/api/upload/route.js
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readToken } from "@/lib/jwt"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { initializeApp, getApps } from "firebase/app"
import { firebaseConfig } from "@/lib/firebaseClient"

// Initialize Firebase
function getFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }
  return getStorage()
}

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

export async function POST(request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image')
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    const storage = getFirebaseApp()
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `notes/${user.email || user.phone}/${timestamp}.${fileExtension}`
    
    const storageRef = ref(storage, fileName)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return NextResponse.json({ 
      success: true, 
      imageUrl: downloadURL,
      message: "Image uploaded successfully"
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ 
      error: "Failed to upload image",
      details: error.message 
    }, { status: 500 })
  }
}