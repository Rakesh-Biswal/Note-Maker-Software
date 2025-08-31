"use client"
import { useEffect, useRef, useState } from "react"
import { getRecaptchaVerifier, sendOtpToPhone } from "@/lib/firebaseClient"
import GoogleSignInButton from "@/components/GoogleSignInButton"

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", picture: "" })
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [confirmation, setConfirmation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, kind: "info", msg: "" })
  const recaptchaId = "signup-recaptcha-container"
  const recaptchaRef = useRef(null)

  // Prefill from Google unknown-email flow
  useEffect(() => {
    if (!recaptchaRef.current) recaptchaRef.current = getRecaptchaVerifier(recaptchaId)
    try {
      const pref = localStorage.getItem("nf_signup_prefill")
      if (pref) {
        const data = JSON.parse(pref)
        setForm((f) => ({
          ...f,
          name: data?.name || f.name,
          email: data?.email || f.email,
          picture: data?.picture || f.picture,
        }))
        localStorage.removeItem("nf_signup_prefill")
      }
    } catch {}
  }, [])

  function notify(kind, msg) {
    setToast({ show: true, kind, msg })
    setTimeout(() => setToast({ show: false, kind, msg: "" }), 5000)
  }

  // Format phone number with country code if missing
  const formatPhoneNumber = (phoneNumber) => {
    let formattedPhone = phoneNumber.trim();

    // Remove any non-digit characters except +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, '');

    // If doesn't start with +, add +91 as default (India)
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    return formattedPhone;
  }

  // Validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber.trim()) {
      return "Phone number is required";
    }

    const digitsOnly = phoneNumber.replace(/[^\d]/g, '');

    if (digitsOnly.length < 10) {
      return "Phone number is too short";
    }

    return null;
  }

  async function onSendOtp(e) {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Validate required fields
      if (!form.name.trim()) {
        notify("error", "Please enter your name");
        return;
      }
      
      if (!form.email.trim()) {
        notify("error", "Please enter your email");
        return;
      }
      
      if (!form.phone.trim()) {
        notify("error", "Please enter your phone number");
        return;
      }

      // Validate phone number
      const validationError = validatePhoneNumber(form.phone);
      if (validationError) {
        notify("error", validationError);
        return;
      }

      // Format phone number
      const formattedPhone = formatPhoneNumber(form.phone);
      
      const conf = await sendOtpToPhone(formattedPhone, recaptchaRef.current)
      setConfirmation(conf)
      setOtpStep(true)
      notify("success", "OTP sent to your phone")
    } catch (err) {
      // Handle Firebase errors with user-friendly messages
      let errorMessage = "Failed to send OTP. Please try again.";

      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format. Please check and try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "We're experiencing high demand. Please try again in a few minutes.";
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage = "Security check failed. Please refresh the page and try again.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage = "Phone sign-in is not enabled. Please contact support.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      notify("error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function onVerifyOtp(e) {
    e.preventDefault()
    try {
      setLoading(true)
      if (!confirmation) {
        notify("error", "OTP session expired. Please request a new code.");
        setOtpStep(false);
        return;
      }
      
      if (otp.some((d) => !d)) {
        notify("error", "Please enter all 6 digits of the verification code.");
        return;
      }
      
      const code = otp.join("")
      const res = await confirmation.confirm(code)
      const idToken = await res.user.getIdToken()
      const r = await fetch("/api/auth/phone/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          profile: { 
            name: form.name, 
            email: form.email, 
            phone: form.phone, 
            picture: form.picture 
          },
        }),
      })
      
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.error || "Verification failed");
      }

      notify("success", "Welcome to NoteFlow!")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (err) {
      // Handle OTP verification errors
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (err.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid verification code. Please check and try again.";
      } else if (err.code === "auth/code-expired") {
        errorMessage = "Verification code has expired. Please request a new one.";
      } else if (err.code === "auth/credential-already-in-use") {
        errorMessage = "This phone number is already associated with another account.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      notify("error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function setOtpDigit(i, v) {
    if (!/^\d?$/.test(v)) return
    const next = otp.slice()
    next[i] = v
    setOtp(next)
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
    
    // Auto-focus to previous input on backspace
    if (!v && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  }

  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);

      // Focus on the last input
      if (newOtp.length === 6) {
        document.getElementById(`otp-5`)?.focus();
      }
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await onSendOtp({ preventDefault: () => {} });
      notify("success", "New OTP sent to your phone");
    } catch (error) {
      // Error handling is already done in onSendOtp
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join NoteFlow to organize your thoughts</p>
          </div>

          {!otpStep ? (
            <form className="space-y-5" onSubmit={onSendOtp}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+</span>
                  </div>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter 10 digit Mobile number 
                </p>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium rounded-lg py-3.5 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP…
                  </span>
                ) : "Verify Mobile"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or prefill with</span>
                </div>
              </div>
              
              <GoogleSignInButton intent="signup" />

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={onVerifyOtp}>
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">Enter verification code</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    We've sent a 6-digit code to {form.phone}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => setOtpDigit(index, e.target.value)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      maxLength={1}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      disabled={loading}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                  disabled={loading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the Terms and Privacy Policy
                </label>
              </div>
              
              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium rounded-lg py-3.5 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying…
                  </span>
                ) : "Create Account"}
              </button>
            </form>
          )}

          {toast.show && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${toast.kind === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"}`}
            >
              <div className="flex items-start">
                {toast.kind === "error" ? (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{toast.msg}</span>
              </div>
            </div>
          )}
          
          <div id={recaptchaId} className="hidden" />
        </div>

        {/* Image Section - Visible on desktop only */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <img 
            src="/images/notetakerui.png" 
            alt="NoteFlow App Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  )
}