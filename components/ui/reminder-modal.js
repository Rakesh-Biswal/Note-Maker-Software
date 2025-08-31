// components/ui/reminder-modal.js
"use client"
import { useState } from "react"
import Spinner from "./spinner"

export default function ReminderModal({ 
  isOpen, 
  onClose, 
  note, 
  onSetReminder, 
  onRemoveReminder 
}) {
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")
  const [settingReminder, setSettingReminder] = useState(false)

  if (!isOpen) return null

  const formattedReminder = note.reminder ? {
    date: new Date(note.reminder).toLocaleDateString(),
    time: new Date(note.reminder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    full: new Date(note.reminder).toLocaleString()
  } : null

  const handleSetReminder = async () => {
    if (!reminderDate || !reminderTime) return
    
    setSettingReminder(true)
    try {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`)
      await onSetReminder(reminderDateTime.toISOString())
      setReminderDate("")
      setReminderTime("")
    } finally {
      setSettingReminder(false)
    }
  }

  const handleRemoveReminder = async () => {
    setSettingReminder(true)
    try {
      await onRemoveReminder()
    } finally {
      setSettingReminder(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        {/* Close Button - Top Right Corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {note.reminder ? "Manage Reminder" : "Set a Reminder"}
          </h3>
        </div>
        
        {/* Description Section */}
        <div className="mb-6">
          {note.reminder ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-2">
                <strong>You have a reminder set for this note.</strong> We'll send you an email notification at the scheduled time to help you remember this important note.
              </p>
              <div className="bg-white rounded-md p-3 border border-blue-100">
                <p className="text-sm font-medium text-gray-800 text-center">
                  📅 {formattedReminder?.full}
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Want to change when you're reminded? Set a new date and time below.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Get reminded about this note!</strong> Set a date and time, and we'll send you an email notification to help you remember to review or act on this note. Perfect for important deadlines, follow-ups, or just remembering to revisit your thoughts.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Reminder Date
            </label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏰ Reminder Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            💡 <strong>How it works:</strong> We'll send an email to your registered email address at the scheduled time with a link to this note. Make sure your email is verified to receive reminders!
          </p>
        </div>
        
        <div className="flex gap-3 mt-6">
          {note.reminder && (
            <button
              onClick={handleRemoveReminder}
              disabled={settingReminder}
              className="flex-1 bg-red-50 text-red-700 px-4 py-3 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {settingReminder ? <Spinner size="sm" className="text-red-700" /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {settingReminder ? "Removing..." : "Remove"}
            </button>
          )}
          
          <button
            onClick={handleSetReminder}
            disabled={settingReminder || (!reminderDate || !reminderTime)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-sm"
          >
            {settingReminder ? <Spinner size="sm" className="text-white" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {settingReminder ? "Setting..." : note.reminder ? "Update" : "Set Reminder"}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔔 You can manage all your reminders from your account settings
          </p>
        </div>
      </div>
    </div>
  )
}