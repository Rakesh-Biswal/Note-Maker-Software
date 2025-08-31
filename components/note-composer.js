"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Spinner from "./ui/spinner"
import EmptyStateMarketing from "./ui/empty-state-marketing"
import RegularNoteComposer from "./ui/note-composer-regular"
import { uploadImageToFirebase } from "@/lib/image-upload"

export default function NoteComposer({ notesCount: initialCount }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [notesCount, setNotesCount] = useState(typeof initialCount === "number" ? initialCount : null)
  const [toast, setToast] = useState({ show: false, kind: "info", msg: "" })
  const [aiLoading, setAiLoading] = useState(false)
  const [supportsSpeech, setSupportsSpeech] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [enhancedContent, setEnhancedContent] = useState("")
  const recognitionRef = useRef(null)

  const showEmptyMarketing = useMemo(() => notesCount === 0, [notesCount])

  useEffect(() => {
    if (typeof window === "undefined") return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setSupportsSpeech(!!SR)
  }, [])

  useEffect(() => {
    if (typeof initialCount === "number") return
    let active = true
    async function check() {
      try {
        setChecking(true)
        const res = await fetch("/api/notes", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load notes")
        const data = await res.json()
        if (active) setNotesCount(Array.isArray(data.notes) ? data.notes.length : 0)
      } catch {
        if (active) setNotesCount(0)
      } finally {
        if (active) setChecking(false)
      }
    }
    check()
    return () => {
      active = false
    }
  }, [initialCount])

  function notify(kind, msg) {
    setToast({ show: true, kind, msg })
    setTimeout(() => setToast({ show: false, kind, msg: "" }), 3000)
  }

  function onPickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image size should be less than 5MB")
      return
    }
    
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result || "")
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview("")
  }

  function toggleRecording() {
    if (!supportsSpeech) {
      notify("error", "Voice input not supported in this browser")
      return
    }
    
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
      setIsRecording(false)
      return
    }
    
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      const rec = new SR()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = "en-US"
      
      rec.onresult = (event) => {
        let chunk = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i]
          chunk += res[0]?.transcript || ""
        }
        if (chunk.trim()) {
          setContent((prev) => (prev ? prev + " " : "") + chunk.trim())
        }
      }
      
      rec.onerror = () => {
        notify("error", "Microphone error. Please try again.")
        setIsRecording(false)
      }
      
      rec.onend = () => {
        setIsRecording(false)
      }
      
      recognitionRef.current = rec
      setIsRecording(true)
      rec.start()
    } catch {
      setIsRecording(false)
      notify("error", "Unable to start voice input")
    }
  }

  async function improveWithAI() {
    if (!content.trim()) {
      notify("error", "Please write or dictate something to improve")
      return
    }
    
    try {
      setAiLoading(true)
      setEnhancedContent("")
      
      const res = await fetch("/api/notes/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      })
      
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "AI is unavailable right now")
      }
      
      if (typeof data.text === "string" && data.text.trim()) {
        setEnhancedContent(data.text.trim())
        notify("success", "Content enhanced with AI")
      } else {
        throw new Error("Unexpected AI response")
      }
    } catch (e) {
      notify("error", e.message || "Failed to improve with AI")
    } finally {
      setAiLoading(false)
    }
  }

  async function createNote(e) {
    e.preventDefault()
    if (!title.trim()) {
      notify("error", "Title is required")
      return
    }
    
    try {
      setLoading(true)
      let imageUrl = null
      
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile)
      }

      const finalContent = enhancedContent || content
      
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: finalContent, 
          imageUrl 
        }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create note")

      // Reset form
      setTitle("")
      setContent("")
      setEnhancedContent("")
      setImageFile(null)
      setImagePreview("")
      
      notify("success", "Note created successfully!")
      
      // Refresh to show new note
      setTimeout(() => window.location.reload(), 1000)
    } catch (e) {
      notify("error", e.message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="bg-white rounded-xl p-6 flex items-center justify-center gap-3 text-gray-600">
        <Spinner size={20} />
        <span>Checking your notes...</span>
      </div>
    )
  }

  if (showEmptyMarketing) {
    return (
      <>
        <EmptyStateMarketing
          onCreateNote={createNote}
          onPickImage={onPickImage}
          removeImage={removeImage}
          imagePreview={imagePreview}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          loading={loading}
          supportsSpeech={supportsSpeech}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          aiLoading={aiLoading}
          improveWithAI={improveWithAI}
          enhancedContent={enhancedContent}
          setEnhancedContent={setEnhancedContent}
        />
        
        {toast.show && (
          <div className={`mt-4 p-3 rounded-lg ${
            toast.kind === "error" 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {toast.msg}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <RegularNoteComposer
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        imagePreview={imagePreview}
        onPickImage={onPickImage}
        removeImage={removeImage}
        onCreateNote={createNote}
        loading={loading}
        supportsSpeech={supportsSpeech}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        aiLoading={aiLoading}
        improveWithAI={improveWithAI}
        enhancedContent={enhancedContent}
        setEnhancedContent={setEnhancedContent}
      />
      
      {toast.show && (
        <div className={`mt-4 p-3 rounded-lg ${
          toast.kind === "error" 
            ? "bg-red-50 text-red-700 border border-red-200" 
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {toast.msg}
        </div>
      )}
    </>
  )
}