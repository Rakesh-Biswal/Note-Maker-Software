"use client"

import { useAuth } from "@/components/home/use-auth"
import { Header } from "@/components/home/header"
import { Hero } from "@/components/home/hero"
import { Logos } from "@/components/home/logos"
import { Features } from "@/components/home/features"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { CTA } from "@/components/home/cta"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="relative mb-6">
          {/* Notebook page flipping animation */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md transform -rotate-6 animate-page-flip"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          
          {/* Writing utensil animation */}
          <div className="absolute -bottom-2 -right-2 transform rotate-45">
            <div className="w-8 h-2 bg-yellow-500 rounded-full animate-pencil-bounce"></div>
            <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Preparing Your Notes</h2>
        <p className="text-gray-500 text-sm">Just a moment while we get everything ready...</p>
        
        {/* Progress indicator */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}

// Add this to your global CSS file or use a style tag
const styles = `
  @keyframes page-flip {
    0%, 100% { transform: rotate(-6deg) translateY(0); }
    50% { transform: rotate(-8deg) translateY(-4px); }
  }
  
  @keyframes pencil-bounce {
    0%, 100% { transform: translateX(0) rotate(45deg); }
    50% { transform: translateX(4px) rotate(45deg); }
  }
  
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 60%; }
    100% { width: 100%; }
  }
  
  .animate-page-flip {
    animation: page-flip 1.5s ease-in-out infinite;
  }
  
  .animate-pencil-bounce {
    animation: pencil-bounce 1s ease-in-out infinite;
  }
  
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`
