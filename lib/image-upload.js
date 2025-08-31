// lib/image-upload.js
export async function uploadImageToFirebase(imageFile) {
  if (!imageFile) return null
  
  try {
    const { getApps, initializeApp } = await import("firebase/app")
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const { firebaseConfig } = await import("@/lib/firebaseClient")
    
    if (!getApps().length) initializeApp(firebaseConfig)
    const storage = getStorage()
    
    const key = `notes/${Date.now()}-${imageFile.name}`
    const storageRef = ref(storage, key)
    
    await uploadBytes(storageRef, imageFile)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error("Image upload error:", error)
    throw new Error("Failed to upload image")
  }
}

export function isValidImageFile(file) {
  if (!file) return false
  if (file.size > 5 * 1024 * 1024) return false // 5MB limit
  if (!file.type.startsWith('image/')) return false
  return true
}