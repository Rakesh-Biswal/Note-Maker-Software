import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Spinner from "@/components/ui/spinner"

export const metadata = {
  title: "NoteFlow",
  description: "Capture ideas fast. Secure, modern note-taking.",
  generator: "v0.app",
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* NoteFlow logo placeholder */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold text-2xl">NF</span>
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Spinner size="lg" variant="primary" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to NoteFlow</h2>
        <p className="text-gray-600">Loading your secure workspace...</p>
        
        {/* Optional: Loading progress indicators */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Loading notes</span>
            <span>•</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}