// Interactive dashboard (JSX, client)
"use client"

import useSWR, { mutate } from "swr"
import { useState } from "react"

const fetcher = (url) => fetch(url).then((r) => r.json())

function Spinner({ className }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${className || ""}`}
    />
  )
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="rounded-md border p-4 hover:shadow-sm transition flex flex-col gap-2">
      <input
        className="text-lg font-medium focus:outline-none"
        defaultValue={note.title}
        onBlur={(e) => onEdit({ ...note, title: e.target.value })}
      />
      <textarea
        className="min-h-[80px] resize-y focus:outline-none"
        defaultValue={note.content}
        onBlur={(e) => onEdit({ ...note, content: e.target.value })}
      />
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{new Date(note.updatedAt).toLocaleString()}</span>
        <button onClick={() => onDelete(note.id)} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  )
}

export default function DashboardClient({ user }) {
  const { data, isLoading } = useSWR("/api/notes", fetcher)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  async function createNote(e) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (res.ok) {
        setTitle("")
        setContent("")
        mutate("/api/notes")
      }
    } finally {
      setCreating(false)
    }
  }

  async function editNote(note) {
    await fetch(`/api/notes/${note.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: note.title, content: note.content }),
    })
    mutate("/api/notes")
  }

  async function deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" })
    mutate("/api/notes")
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.assign("/")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-600" />
          <div>
            <div className="font-semibold">Dashboard</div>
            <div className="text-sm text-gray-600">Welcome, {user.name || "there"}</div>
          </div>
        </div>
        <button onClick={logout} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 transition">
          Log out
        </button>
      </header>

      <form onSubmit={createNote} className="rounded-md border p-4 space-y-3">
        <div className="text-sm font-medium">Create Note</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          className="w-full rounded-md border px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-blue-600 text-white px-3 py-2 flex items-center gap-2 hover:bg-blue-700 transition"
        >
          {creating ? <Spinner /> : null}
          {creating ? "Saving..." : "Create"}
        </button>
      </form>

      <section className="space-y-3">
        <div className="text-sm font-medium">Your Notes</div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner /> Loading notes...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {(data?.notes || []).map((n) => (
              <NoteCard key={n.id} note={n} onEdit={editNote} onDelete={deleteNote} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
