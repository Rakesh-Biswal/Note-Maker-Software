"use client"
import { useRef, useState, useMemo, useEffect } from "react"
import Spinner from "./ui/spinner"
import ReminderModal from "./ui/reminder-modal"
import { uploadImageToFirebase } from "@/lib/image-upload"
import { downloadNotePDF } from "@/lib/pdf-export"

export default function NoteCard({ note, onUpdated, onDeleted }) {
  const [title, setTitle] = useState(note.title || "")
  const [content, setContent] = useState(note.content || "")
  const [imageUrl, setImageUrl] = useState(note.imageUrl || "")
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState({ show: false, kind: "info", msg: "" })
  const [imgLoading, setImgLoading] = useState(!!note.imageUrl)
  const [expanded, setExpanded] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [settingReminder, setSettingReminder] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [showReminderTag, setShowReminderTag] = useState(false)
  const fileInputRef = useRef(null)
  const TRUNCATE_AT = 220

  const id = note.id

  function notify(kind, msg) {
    setToast({ show: true, kind, msg })
    setTimeout(() => setToast({ show: false, kind, msg: "" }), 2000)
  }

  function onPickImage(e) {
    const f = e.target.files?.[0]
    if (!f) return

    if (f.size > 5 * 1024 * 1024) {
      notify("error", "Image size should be less than 5MB")
      return
    }

    if (!f.type.startsWith('image/')) {
      notify("error", "Please select an image file")
      return
    }

    setImageFile(f)
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result || "")
    reader.readAsDataURL(f)
  }

  useEffect(() => {
    // Only show the tag if there's no reminder set and we're not in edit mode
    if (!note.reminder && !editing) {
      setShowReminderTag(true)
      const timer = setTimeout(() => {
        setShowReminderTag(false)
      }, 17000) // 7 seconds

      return () => clearTimeout(timer)
    }
  }, [note.reminder, editing])

  async function save() {
    try {
      setSaving(true)
      let uploadedUrl = imageUrl?.startsWith("http") ? imageUrl : null

      if (imageFile) {
        uploadedUrl = await uploadImageToFirebase(imageFile)
      }

      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          imageUrl: uploadedUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update")

      notify("success", "Note saved successfully")
      setEditing(false)
      setImageFile(null)
      setImageUrl(data.note?.imageUrl || imageUrl || "")
      setShowDelete(false)
      onUpdated?.({ ...note, ...data.note })
    } catch (e) {
      notify("error", e.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    const ok = window.confirm("Are you sure you want to delete this note permanently?")
    if (!ok) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete")

      notify("success", "Note deleted successfully")
      onDeleted?.(id)
      setTimeout(() => window.location.reload(), 400)
    } catch (e) {
      notify("error", e.message)
    } finally {
      setDeleting(false)
    }
  }

  async function handleSetReminder(reminder) {
    try {
      setSettingReminder(true)
      const res = await fetch(`/api/notes/${id}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminder }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to set reminder")

      notify("success", "Reminder set successfully")
      setShowReminderModal(false)
      onUpdated?.({ ...note, reminder })
    } catch (e) {
      notify("error", e.message)
    } finally {
      setSettingReminder(false)
    }
  }

  async function handleRemoveReminder() {
    try {
      setSettingReminder(true)
      const res = await fetch(`/api/notes/${id}/reminder`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to remove reminder")

      notify("success", "Reminder removed")
      setShowReminderModal(false)
      onUpdated?.({ ...note, reminder: null })
    } catch (e) {
      notify("error", e.message)
    } finally {
      setSettingReminder(false)
    }
  }

  async function exportPdf() {
    try {
      setExportingPdf(true)
      await downloadNotePDF({
        title: title || "Untitled Note",
        content,
        imageUrl: imageUrl !== "https://blocks.astratic.com/img/general-img-landscape.png" ? imageUrl : null
      })
      notify("success", "PDF downloaded successfully")
    } catch (e) {
      notify("error", e.message || "Failed to export PDF")
    } finally {
      setExportingPdf(false)
    }
  }

  const { isTruncatable, previewText } = useMemo(() => {
    const raw = content || ""
    const needsTrim = raw.length > TRUNCATE_AT
    return {
      isTruncatable: needsTrim,
      previewText: needsTrim ? raw.slice(0, TRUNCATE_AT) + "…" : raw,
    }
  }, [content])


  const formattedReminder = useMemo(() => {
    if (!note.reminder) return null
    const date = new Date(note.reminder)

    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      full: date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  }, [note.reminder])

  const displayImageUrl = imageUrl || "https://blocks.astratic.com/img/general-img-landscape.png"
  const isPlaceholderImage = !imageUrl

  return (
    <div className="border rounded-lg p-4 transition bg-white shadow-sm hover:shadow-md relative">
      
      <div className="absolute top-3 right-3">
        {editing ? (
          <button
            onClick={() => {
              setEditing(false)
              setTitle(note.title || "")
              setContent(note.content || "")
              setImageUrl(note.imageUrl || "")
              setImageFile(null)
              setExpanded(false)
              setShowDelete(false)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Cancel editing"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : note.reminder ? (
          <div className="relative group">
            <button
              onClick={() => setShowReminderModal(true)}
              className="text-green-600 hover:text-green-800 transition-colors"
              title={`Reminder set for ${formattedReminder?.full}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Reminder: {formattedReminder?.full}
            </div>
          </div>
        ) : (
          <div className="relative">
            
            {showReminderTag && (
              <div className="absolute -top-8 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg shadow-lg animate-bounce">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Reminder</span>
                </div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
              </div>
            )}

            <button
              onClick={() => {
                setShowReminderModal(true)
                setShowReminderTag(false) 
              }}
              className="text-gray-400 hover:text-blue-600 transition-colors relative"
              title="Set reminder"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`w-full font-medium mb-2 outline-none ${editing ? "border-b" : "border-b border-transparent"}`}
        readOnly={!editing}
        placeholder="Untitled Note"
      />

      {/* Image Display Section */}
      <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border">
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner size="md" />
          </div>
        )}
        <img
          src={displayImageUrl}
          alt={isPlaceholderImage ? "Note placeholder" : "Note attachment"}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgLoading(false)
            if (imageUrl) {
              setImageUrl("")
            }
          }}
          className={`w-full h-full object-cover transition-all duration-300 ${imgLoading ? "opacity-0" : "opacity-100"
            } ${isPlaceholderImage ? "opacity-70" : ""}`}
        />

        {isPlaceholderImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20">
            <div className="text-black text-center p-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">No image added</p>
              <p className="text-xs opacity-80">Click edit to add an image</p>
            </div>
          </div>
        )}
      </div>

      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-sm text-gray-700 outline-none min-h-24 border rounded-md p-2 resize-none"
          readOnly={false}
          placeholder="Write your note content here..."
        />
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
          {expanded ? content || "" : previewText}
          {isTruncatable && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="ml-2 text-blue-600 hover:underline font-medium"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {editing && (
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Note Image</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors border border-gray-300">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPickImage}
                className="hidden"
                disabled={saving}
              />
              {imageUrl ? "Change Image" : "Add Image"}
            </label>
            {imageUrl && !isPlaceholderImage && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl("")
                  setImageFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={saving}
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!editing ? (
          <button
            onClick={() => {
              setEditing(true)
              setShowDelete(true)
            }}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        ) : (
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium border border-gray-300"
          >
            {saving ? <Spinner size="sm" className="text-gray-700" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        )}

        {!editing && (
          <button
            onClick={exportPdf}
            disabled={exportingPdf}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium border border-gray-300"
          >
            {exportingPdf ? <Spinner size="sm" className="text-gray-700" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {exportingPdf ? "Exporting..." : "Export PDF"}
          </button>
        )}

        {showDelete && (
          <button
            onClick={remove}
            disabled={deleting}
            className="flex items-center gap-2 bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 text-sm font-medium border border-gray-300"
          >
            {deleting ? <Spinner size="sm" className="text-red-600" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        note={note}
        onSetReminder={handleSetReminder}
        onRemoveReminder={handleRemoveReminder}
      />

      {toast.show && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${toast.kind === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
          }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

export function NoteCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="h-6 w-2/3 rounded bg-gray-200 animate-pulse mb-3" />
      <div className="relative w-full h-48 rounded-lg overflow-hidden border mb-3">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}