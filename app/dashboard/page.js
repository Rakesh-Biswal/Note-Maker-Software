// app/dashboard/page.js
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { readToken } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"
import NoteComposer from "@/components/note-composer"
import NotesGrid from "@/components/notes-grid"
import ProfileDropdown from "@/components/ui/profile-dropdown"

async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    return await readToken(token)
  } catch {
    return null
  }
}

function convertToPlainObject(obj) {
  if (obj && typeof obj === 'object') {
    if (obj._id && obj._id.toString) {
      obj._id = obj._id.toString()
    }
    
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object' && obj[key].toString) {
        obj[key] = obj[key].toString()
      }
    }
    return JSON.parse(JSON.stringify(obj))
  }
  return obj
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session || Object.keys(session).length === 0) redirect("/sign-in")

  const db = await getDb()
  const user = await db.collection("users").findOne({
    $or: [
      { email: session.email },
      { phone: session.phone }
    ]
  })

  const notes = await db
    .collection("notes")
    .find({
      $or: [
        { email: session.email },
        { phone: session.phone }
      ]
    })
    .sort({ updatedAt: -1 })
    .toArray()


  const plainUser = convertToPlainObject(user)
  const plainNotes = notes.map(note => convertToPlainObject(note))

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="jsx-4b6633f49b5e0764 flex items-center gap-3"><div className="jsx-4b6633f49b5e0764 h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="jsx-4b6633f49b5e0764 h-6 w-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="jsx-4b6633f49b5e0764"></path></svg></div><span className="jsx-4b6633f49b5e0764 font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">NoteFlow</span></div>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={plainUser} />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Notes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Organize your thoughts and ideas effortlessly with our powerful note-taking platform
          </p>
        </div>

        <NoteComposer notesCount={plainNotes.length} />

        <NotesGrid notes={plainNotes} />

      </section>
    </main>
  )
}