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

    useEffect(() => {
        if (enhancedContent && !aiLoading) {
            setContent(enhancedContent)
            setShowEnhanced(true)
            const timer = setTimeout(() => setShowEnhanced(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [enhancedContent, aiLoading, setContent])

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-gray-200">

            {/* Hide marketing info if expanded */}
            {!expanded && (
                <>
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Ready to Capture Your Ideas?
                        </h2>

                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Start your journey with NoteFlow - where your thoughts become organized, accessible, and beautiful
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Professional PDFs</h3>
                            <p className="text-sm text-gray-600">Export clean, formal documents</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Image Support</h3>
                            <p className="text-sm text-gray-600">Visual notes with images</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">AI Powered</h3>
                            <p className="text-sm text-gray-600">Smart content enhancement</p>
                        </div>
                    </div>
                </>
            )}

            {/* CTA Section */}
            <div className="text-center">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
                >
                    {expanded ? "Hide Creator" : "Create Your First Note"}
                </button>


                {expanded && (
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <form onSubmit={onCreateNote} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note Title *
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter a title for your note"
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
                                        onContentChange={setContent}
                                        isReadOnly={false}
                                    />
                                ) : (
                                    <div className="relative">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                            placeholder="Write your thoughts here..."
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleRecording}
                                            disabled={!supportsSpeech}
                                            className={`absolute bottom-3 right-3 h-10 w-10 inline-flex items-center justify-center rounded-lg border-2 ${supportsSpeech
                                                ? isRecording
                                                    ? "bg-red-100 border-red-300 text-red-600"
                                                    : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                                                : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                                } transition-colors`}
                                            title={supportsSpeech ? (isRecording ? "Stop recording" : "Start recording") : "Voice input not supported"}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 8a1 1 0 0 0 1-1v-2h-2v2a1 1 0 0 0 1 1Z" />
                                            </svg>
                                        </button>
                                        {showEnhanced && (
                                            <div className="absolute top-2 right-14">
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
                                    <label className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
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
                                            Image
                                        </span>
                                    </label>

                                    {imagePreview && (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
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
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50"
                                >
                                    {aiLoading ? <Spinner size="sm" /> : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l1.76 3.56L18 6.27l-2.64 2.57L16.52 12l-4.52-2.38L7.48 12l1.16-3.16L6 6.27l4.24-.71L12 2z" />
                                        </svg>
                                    )}
                                    {aiLoading ? "Enhancing..." : "AI Enhance"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex-1 border border-green-600 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                {loading ? <Spinner size="sm" /> : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                )}
                                {loading ? "Creating..." : "Create First Note"}
                            </button>

                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
