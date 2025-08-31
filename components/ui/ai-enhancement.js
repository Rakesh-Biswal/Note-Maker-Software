// components/ui/ai-enhancement.jsx
"use client"
import { useEffect, useState } from "react"

export default function AIEnhancement({ 
  content, 
  isEnhancing, 
  enhancedContent, 
  onContentChange,
  isReadOnly = false 
}) {
  const [displayedContent, setDisplayedContent] = useState(content)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isEnhancing) {
      setIsAnimating(true)
      // Simulate AI processing animation
      const words = content.split(' ')
      let currentIndex = 0
      
      const interval = setInterval(() => {
        if (currentIndex <= words.length) {
          setDisplayedContent(words.slice(0, currentIndex).join(' ') + '...')
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    } else if (enhancedContent) {
      // Animate the enhanced content appearing
      setDisplayedContent(enhancedContent)
      setTimeout(() => setIsAnimating(false), 500)
    } else {
      setDisplayedContent(content)
      setIsAnimating(false)
    }
  }, [content, isEnhancing, enhancedContent])

  const handleContentChange = (e) => {
    if (!isReadOnly && onContentChange) {
      onContentChange(e.target.value)
    }
  }

  return (
    <div className="relative">
      <textarea
        value={displayedContent}
        onChange={handleContentChange}
        readOnly={isReadOnly}
        className={`w-full border rounded-lg px-4 py-3 min-h-32 transition-all duration-300 ${
          isAnimating 
            ? "bg-blue-50 border-blue-300 shadow-lg" 
            : "bg-white border-gray-300"
        } ${isEnhancing ? "animate-pulse" : ""} ${
          isReadOnly ? "cursor-not-allowed opacity-90" : ""
        }`}
        placeholder="Your enhanced content will appear here..."
      />
      
      {isEnhancing && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">AI is enhancing your content...</p>
            <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
          </div>
        </div>
      )}
      
      {isAnimating && !isEnhancing && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Enhanced
          </div>
        </div>
      )}
    </div>
  )
}