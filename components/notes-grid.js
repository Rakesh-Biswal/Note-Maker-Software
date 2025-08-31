"use client"
import NoteCard from "./note-card"

export default function NotesGrid({ notes }) {
  return (
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.length === 0 && (
        <div className="text-muted-foreground">No notes yet. Create your first note above.</div>
      )}
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onUpdated={() => {}}
          onDeleted={() => {
            location.reload()
          }}
        />
      ))}
    </div>
  )
}
