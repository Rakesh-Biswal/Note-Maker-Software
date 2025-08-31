"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"
import { useEffect, useState } from "react"

export function Hero() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [demoState, setDemoState] = useState('typing')
  const [typedTitle, setTypedTitle] = useState('')
  const [typedContent, setTypedContent] = useState('')
  const [notes, setNotes] = useState([])
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)

  const demoNotes = [
    {
      title: "Meeting Notes",
      content: "Discussed project timeline and deliverables with client. Follow up on Thursday."
    },
    {
      title: "Shopping List",
      content: "Milk, Eggs, Bread, Coffee, Fruits, Vegetables, Chicken"
    },
    {
      title: "Travel Plans",
      content: "Book flights to Paris, reserve hotel, create itinerary for sightseeing"
    },
    {
      title: "Book Recommendations",
      content: "Atomic Habits, Deep Work, The Psychology of Money, Thinking Fast and Slow"
    }
  ]

  useEffect(() => {
    if (isAuthenticated) return

    const demoSequence = async () => {
      // Start with typing animation
      setDemoState('typing')
      const currentNote = demoNotes[currentNoteIndex]
      
      // Type title
      for (let i = 0; i <= currentNote.title.length; i++) {
        setTypedTitle(currentNote.title.substring(0, i))
        await new Promise(resolve => setTimeout(resolve, 80))
      }
      
      // Short pause before content
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Type content
      for (let i = 0; i <= currentNote.content.length; i++) {
        setTypedContent(currentNote.content.substring(0, i))
        await new Promise(resolve => setTimeout(resolve, 40))
      }

      // Pause to show completed note
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Saving animation
      setDemoState('saving')
      await new Promise(resolve => setTimeout(resolve, 800))

      // Add note to list with animation
      setDemoState('saved')
      const newNote = {
        id: Date.now(),
        title: currentNote.title,
        content: currentNote.content,
        timestamp: new Date()
      }
      setNotes(prev => [...prev, newNote])
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Ready for next action
      setDemoState('ready')
      setTypedTitle('')
      setTypedContent('')
      setCurrentNoteIndex((prev) => (prev + 1) % demoNotes.length)

      // After creating a few notes, demonstrate deletion
      if (notes.length >= 2) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setDemoState('deleting')
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Animate deletion by removing the first note
        setNotes(prev => {
          const newNotes = [...prev]
          newNotes.shift()
          return newNotes
        })
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setDemoState('ready')
      }
    }

    const interval = setInterval(demoSequence, 8000)
    return () => clearInterval(interval)
  }, [isAuthenticated, currentNoteIndex, demoNotes, notes.length])

  const playDemo = () => {
    setNotes([])
    setCurrentNoteIndex(0)
    setTypedTitle('')
    setTypedContent('')
    setDemoState('typing')
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            {isAuthenticated ? (
              <>
                Welcome back to <span className="text-blue-700">NoteFlow</span>
              </>
            ) : (
              <>
                Organize your thoughts <span className="text-blue-700">effortlessly</span>
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            {isAuthenticated
              ? "Pick up where you left off. Your workspace, notes, and recent activity are ready."
              : "Capture ideas, keep them tidy, and find them fast. Secure sync and a delightful writing experience—on every device."}
          </p>
          <div className="flex flex-wrap gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Open Dashboard
              </button>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center" aria-label="User rating 4.9 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>4.9/5 from 2,000+ users</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
              {/* Animated Demo Container */}
              <div className="w-full max-w-md mx-auto">
                {/* Demo Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-600">NoteFlow Demo</div>
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Main Demo Content */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  {/* Note Input Area */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Create New Note</span>
                      {demoState === 'typing' && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600">Typing...</span>
                        </div>
                      )}
                      {demoState === 'saving' && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-600">Saving...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Title Input */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">Title</div>
                      <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 h-10 flex items-center">
                        {typedTitle}
                        {demoState === 'typing' && typedTitle.length < demoNotes[currentNoteIndex]?.title.length && (
                          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-blink"></span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content Input */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Content</div>
                      <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 min-h-[60px]">
                        {typedContent}
                        {demoState === 'typing' && typedContent.length < demoNotes[currentNoteIndex]?.content.length && (
                          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-blink"></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-[120px] overflow-y-auto">
                    <div className="text-sm font-medium text-gray-700 mb-2">Recent Notes ({notes.length})</div>
                    {notes.map((note, index) => (
                      <div
                        key={note.id}
                        className={`p-2 rounded-lg border transition-all duration-500 ${
                          demoState === 'deleting' && index === 0
                            ? 'bg-red-100 border-red-300 opacity-0 transform -translate-x-10'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{note.title}</div>
                            <div className="text-xs text-gray-600 truncate">{note.content}</div>
                          </div>
                          <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Status Bar */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-2">
                  <div className="flex items-center gap-2">
                    {demoState === 'typing' && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Creating note...
                      </span>
                    )}
                    {demoState === 'saving' && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        Saving to cloud...
                      </span>
                    )}
                    {demoState === 'deleting' && (
                      <span className="flex items-center gap-1 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        Removing note...
                      </span>
                    )}
                    {demoState === 'ready' && notes.length > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Ready
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Secure & private</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Real-time sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating indicators */}
          {!isAuthenticated && (
            <>
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100 animate-float">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium">Auto-save enabled</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100 animate-float animation-delay-2000">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium">Cloud sync active</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}