"use client"
import Link from "next/link"
import { useAuth } from "./use-auth"

export function CTA() {
  const { isAuthenticated } = useAuth()
  return (
    <section className="bg-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          {isAuthenticated ? "Ready to continue your work?" : "Ready to organize your thoughts?"}
        </h2>
        <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
          {isAuthenticated
            ? "Your notes are waiting. Jump back in and keep the ideas flowing."
            : "Join thousands who enjoy a clean, reliable note system that gets out of the way."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow"
            >
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow"
              >
                Get Started Free
              </Link>
              <Link
                href="/sign-in"
                className="px-6 py-3 rounded-lg border border-blue-200 text-white hover:bg-blue-600 transition-colors font-medium"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
