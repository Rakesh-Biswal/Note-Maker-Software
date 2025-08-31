// components/ui/note-composer-regular.jsx
"use client"
import { useState, useEffect } from "react"
import Spinner from "./spinner"
import AIEnhancement from "./ai-enhancement"

export default function RegularNoteComposer({
    title,
    setTitle,
    content,
    setContent,
    imagePreview,
    onPickImage,
    removeImage,
    onCreateNote,
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
    const [usingEnhanced, setUsingEnhanced] = useState(false)

    // Update content when enhanced content is available
    useEffect(() => {
        if (enhancedContent && !aiLoading) {
            setContent(enhancedContent)
            setUsingEnhanced(true)
            setShowEnhanced(true)
            // Auto-hide the enhanced badge after 3 seconds
            const timer = setTimeout(() => setShowEnhanced(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [enhancedContent, aiLoading, setContent])

    const handleContentChange = (newContent) => {
        setContent(newContent)
        if (usingEnhanced && newContent !== enhancedContent) {
            setUsingEnhanced(false)
            setEnhancedContent("")
        }
    }

    if (!expanded) {
        return (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800">Create a new note</h3>
                        <p className="text-sm text-gray-600">Unlimited free quota available</p>
                    </div>
                    <button
                        onClick={() => setExpanded(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                    >
                        New Note
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Create New Note</h3>
                <button
                    onClick={() => {
                        setExpanded(false)
                        setEnhancedContent("")
                        setUsingEnhanced(false)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={onCreateNote} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Title *
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter note title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Content
                    </label>
                    {aiLoading ? (
                        <AIEnhancement
                            content={content}
                            isEnhancing={aiLoading}
                            enhancedContent={enhancedContent}
                            onContentChange={handleContentChange}
                            isReadOnly={false}
                        />
                    ) : (
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="Write your note content..."
                            />
                            <button
                                type="button"
                                onClick={toggleRecording}
                                disabled={!supportsSpeech}
                                className={`absolute bottom-2 right-2 h-8 w-8 inline-flex items-center justify-center rounded-lg border ${supportsSpeech
                                    ? isRecording
                                        ? "bg-red-100 border-red-300 text-red-600"
                                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                                    : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                    } transition-colors`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 8a1 1 0 0 0 1-1v-2h-2v2a1 1 0 0 0 1 1Z" />
                                </svg>
                            </button>
                            {showEnhanced && (
                                <div className="absolute top-2 right-12">
                                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Enhanced
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors border border-gray-300">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onPickImage}
                                className="hidden"
                            />
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 12H5V7h14v10ZM8 13l2.03 2.71L12 13l4 5H8Z" />
                                </svg>
                                Add Image
                            </span>
                        </label>

                        {imagePreview && (
                            <div className="relative">
                                <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded border" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={improveWithAI}
                        disabled={aiLoading || !content.trim()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {aiLoading ? <Spinner size="sm" /> : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l1.76 3.56L18 6.27l-2.64 2.57L16.52 12l-4.52-2.38L7.48 12l1.16-3.16L6 6.27l4.24-.71L12 2z" />
                            </svg>
                        )}
                        {aiLoading ? "Processing..." : "AI Enhance"}
                    </button>

                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !title.trim()}
                        className="flex-1 border border-green-600 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        )}
                        {loading ? "Creating..." : "Create"}
                    </button>

                </div>
            </form>
        </div>
    )
}