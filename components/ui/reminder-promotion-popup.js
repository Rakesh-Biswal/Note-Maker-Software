// components/ui/reminder-promotion-popup.jsx
"use client"
import { useState, useEffect } from "react"

const LOCAL_STORAGE_KEY = "reminderPopupDismissed"

export default function ReminderPromotionPopup({ isOpen, onClose, onSetReminder }) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!dismissed && isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setShouldShow(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true")
    setIsVisible(false)
    setTimeout(() => onClose(), 300) // wait for animation
  }

  const handleSetReminder = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true")
    onSetReminder()
  }

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`relative bg-white rounded-2xl p-6 w-full max-w-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="animate-pulse">
                  <div className="w-12 h-2 bg-blue-200 rounded-full mx-auto mb-1"></div>
                  <div className="w-8 h-2 bg-blue-200 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center lg:text-left">
              ⏰ Never Forget Important Notes
            </h2>

            <div className="space-y-4 mb-6">
              {[
                {
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                  text: "Email reminders delivered straight to your inbox at the perfect time",
                },
                {
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  text: "Perfect for deadlines, follow-ups, and important reminders",
                },
                {
                  iconBg: "bg-purple-100",
                  iconColor: "text-purple-600",
                  text: "100% free and easy to set up in seconds",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-6 h-6 ${item.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-4 h-4 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={idx === 0 ? "M5 13l4 4L19 7" : idx === 1 ? "M13 10V3L4 14h7v7l9-11h-7z" : "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"}
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSetReminder}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Set
              </button>

              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium text-center"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              You can always set reminders later from any note
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
