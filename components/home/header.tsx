"use client"
import Link from "next/link"
import { useAuth } from "./use-auth"

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="NoteFlow Home">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="sr-only">NoteFlow logo</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl text-blue-700">NoteFlow</span>
        </Link>

        <nav className="flex items-center gap-6" aria-label="Primary">
          <a href="#features" className="hidden md:inline text-sm text-gray-700 hover:text-blue-700 transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hidden md:inline text-sm text-gray-700 hover:text-blue-700 transition-colors"
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="hidden md:inline text-sm text-gray-700 hover:text-blue-700 transition-colors"
          >
            Testimonials
          </a>

          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm text-gray-700 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
              
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
