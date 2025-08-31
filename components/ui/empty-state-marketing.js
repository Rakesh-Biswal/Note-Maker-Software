"use client"
import { useState, useEffect } from "react"
import Spinner from "./spinner"
import AIEnhancement from "./ai-enhancement"

export default function EmptyStateMarketing({
  onCreateNote,
  onPickImage,
  removeImage,
  imagePreview,
  title,
  setTitle,
  content,
  setContent,
  loading,
  supportsSpeech,
  isRecording,
  toggleRecording,
  aiLoading,
  improveWithAI,
  enhancedContent,
  setEnhancedContent
}) {
  const [expanded, setExpanded] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [localAiLoading, setLocalAiLoading] = useState(false)

  useEffect(() => {
    if (enhancedContent && !aiLoading) {
      setContent(enhancedContent)
      setShowEnhanced(true)
      setLocalAiLoading(false)
      const timer = setTimeout(() => setShowEnhanced(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [enhancedContent, aiLoading, setContent])

  const handleAIImprove = async () => {
    if (!content.trim()) return
    
    setLocalAiLoading(true)
    try {
      await improveWithAI()
    } catch (error) {
      setLocalAiLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-200 p-4 sm:p-6">
      {/* Header Section - Always visible but compact */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Ready to Begin?
        </h2>

        <p className="text-gray-600 text-sm sm:text-base">
          Start organizing your thoughts with NoteFlow
        </p>
      </div>

      {/* Features Grid - Compact and hidden when expanded */}
      {!expanded && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="text-center p-2 sm:p-3 bg-white rounded-lg shadow-xs border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">PDF Export</p>
          </div>

          <div className="text-center p-2 sm:p-3 bg-white rounded-lg shadow-xs border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Images</p>
          </div>

          <div className="text-center p-2 sm:p-3 bg-white rounded-lg shadow-xs border border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">AI Power</p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="text-center">
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium text-sm sm:text-base shadow-sm"
          >
            Create Your First Note
          </button>
        ) : (
          <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">New Note</h3>
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onCreateNote} className="space-y-3">
              <div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Note title"
                  required
                />
              </div>

              <div className="relative">
                {localAiLoading || aiLoading ? (
                  <AIEnhancement 
                    content={content}
                    isEnhancing={localAiLoading || aiLoading}
                    enhancedContent={enhancedContent}
                    onContentChange={setContent}
                    isReadOnly={false}
                  />
                ) : (
                  <>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Write your note here..."
                    />
                    <button
                      type="button"
                      onClick={toggleRecording}
                      disabled={!supportsSpeech}
                      className={`absolute bottom-2 right-2 h-7 w-7 inline-flex items-center justify-center rounded border ${
                        supportsSpeech 
                          ? isRecording 
                            ? "bg-red-100 border-red-300 text-red-600" 
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 8a1 1 0 0 0 1-1v-2h-2v2a1 1 0 0 0 1 1Z"/>
                      </svg>
                    </button>
                  </>
                )}
                {showEnhanced && !localAiLoading && !aiLoading && (
                  <div className="absolute top-2 right-12">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Enhanced
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-gray-100 text-gray-700 px-2 py-1.5 rounded text-xs hover:bg-gray-200 transition-colors border border-gray-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPickImage}
                      className="hidden"
                    />
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 12H5V7h14v10ZM8 13l2.03 2.71L12 13l4 5H8Z"/>
                      </svg>
                      Image
                    </span>
                  </label>
                  
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-8 h-8 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAIImprove}
                  disabled={localAiLoading || aiLoading || !content.trim()}
                  className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1.5 rounded text-xs hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 min-w-[80px] justify-center"
                >
                  {(localAiLoading || aiLoading) ? (
                    <Spinner size="sm" className="text-white" />
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l1.76 3.56L18 6.27l-2.64 2.57L16.52 12l-4.52-2.38L7.48 12l1.16-3.16L6 6.27l4.24-.71L12 2z"/>
                    </svg>
                  )}
                  {(localAiLoading || aiLoading) ? "Thinking..." : "AI Enhance"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 font-medium text-sm flex items-center justify-center gap-1.5"
              >
                {loading ? <Spinner size="sm" className="text-white" /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {loading ? "Creating..." : "Create Note"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}