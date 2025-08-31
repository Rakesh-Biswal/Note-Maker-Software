"use client"

import { useEffect, useState } from "react"

export default function GoogleSignInButton({ intent }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Callback for Google Identity Services
    window.handleCredentialResponse = async (response) => {
      try {
        setLoading(true)
        const endpoint = intent === "signup" ? "/api/auth/google/signup" : "/api/auth/google/signin"

        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        })

        const data = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(data?.error || "Google auth failed")

        if (data.action === "signup_prefill") {
          // Save prefill data and redirect to sign-up
          localStorage.setItem("nf_signup_prefill", JSON.stringify(data.user || {}))
          window.location.href = "/sign-up"
          return
        }

        // Success: go to dashboard
        window.location.href = "/dashboard"
      } catch (err) {
        console.error(err)
        alert(err.message || "Google auth failed")
      } finally {
        setLoading(false)
      }
    }

    // Load GIS script once
    if (!document.getElementById("google-client-script")) {
      const s = document.createElement("script")
      s.src = "https://accounts.google.com/gsi/client"
      s.async = true
      s.defer = true
      s.id = "google-client-script"
      document.head.appendChild(s)
    }
  }, [intent])

  return (
    <div className="flex flex-col items-center">
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      />
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="continue_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      />
      {loading && <p className="text-sm text-gray-500 mt-2">Processing Google sign-in…</p>}
    </div>
  )
}
