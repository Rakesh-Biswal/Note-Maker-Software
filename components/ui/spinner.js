// components/ui/spinner.js
export default function Spinner({ size = "md", className = "", variant = "primary" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  const variantClasses = {
    primary: "border-blue-500 border-t-blue-200",
    secondary: "border-gray-400 border-t-gray-200",
    success: "border-green-500 border-t-green-200",
    danger: "border-red-500 border-t-red-200",
    warning: "border-yellow-500 border-t-yellow-200",
    light: "border-white border-t-gray-100"
  }

  // Professional note-themed spinner with multiple variants
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Main spinning ring */}
      <div className={`animate-spin rounded-full border-3 ${sizeClasses[size]} ${variantClasses[variant]}`} />
      
      {/* Optional: Add a subtle pulsing effect */}
      <div className={`absolute animate-ping rounded-full border-2 ${sizeClasses[size]} ${variantClasses[variant]} opacity-75`} />
      
      {/* Optional: Center dot for better visual appeal */}
      <div className={`absolute rounded-full bg-current ${size === "sm" ? "w-1 h-1" : size === "md" ? "w-1.5 h-1.5" : size === "lg" ? "w-2 h-2" : "w-2.5 h-2.5"} ${variant === "light" ? "bg-white" : "bg-opacity-60"}`} />
    </div>
  )
}

// Additional spinner variants for specific use cases
export function NoteFlowSpinner({ size = "md", className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-3 ${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : size === "lg" ? "w-8 h-8" : "w-12 h-12"} border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent`} />
      <div className="absolute text-xs font-semibold text-blue-600">
        {size === "xl" && "NF"}
      </div>
    </div>
  )
}

export function DocumentSpinner({ size = "md", className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Document-like spinner */}
      <div className={`animate-pulse rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 ${size === "sm" ? "w-4 h-5" : size === "md" ? "w-6 h-7" : size === "lg" ? "w-8 h-10" : "w-12 h-14"}`}>
        <div className={`absolute inset-0.5 bg-white rounded-md ${size === "sm" ? "border" : "border-2"} border-gray-300`}>
          <div className={`animate-pulse bg-blue-200 rounded ${size === "sm" ? "h-1 mt-1 mx-0.5" : size === "md" ? "h-1.5 mt-1.5 mx-1" : size === "lg" ? "h-2 mt-2 mx-1.5" : "h-3 mt-3 mx-2"}`} />
          <div className={`animate-pulse bg-gray-200 rounded ${size === "sm" ? "h-0.5 mt-0.5 mx-0.5" : size === "md" ? "h-1 mt-1 mx-1" : size === "lg" ? "h-1.5 mt-1.5 mx-1.5" : "h-2 mt-2 mx-2"}`} />
          <div className={`animate-pulse bg-gray-200 rounded ${size === "sm" ? "h-0.5 mt-0.5 mx-0.5" : size === "md" ? "h-1 mt-1 mx-1" : size === "lg" ? "h-1.5 mt-1.5 mx-1.5" : "h-2 mt-2 mx-2"}`} />
        </div>
      </div>
    </div>
  )
}

export function WritingSpinner({ size = "md", className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Writing animation spinner */}
      <div className={`relative ${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : size === "lg" ? "w-8 h-8" : "w-12 h-12"}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Pen icon */}
          <svg 
            className={`animate-bounce ${size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-7 h-7"}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
        <div className={`animate-spin rounded-full border-2 border-dashed border-blue-400 border-t-transparent ${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : size === "lg" ? "w-8 h-8" : "w-12 h-12"}`} />
      </div>
    </div>
  )
}

export function ProgressSpinner({ progress = 0, size = "md", className = "" }) {
  const circumference = 2 * Math.PI * 20; // Assuming radius 20 for the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        className={`animate-spin ${size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-16 h-16"}`} 
        viewBox="0 0 44 44"
      >
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {size !== "sm" && (
        <span className="absolute text-xs font-medium text-blue-600">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}