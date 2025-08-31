export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY
  const sender = process.env.BREVO_SENDER_EMAIL || "rb2306114@gmail.com"
  if (!apiKey) {
    console.log("[v0] BREVO_API_KEY missing: skip email")
    return { skipped: true }
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: sender, name: "NoteFlow" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    console.log("[v0] Brevo error", res.status, text)
    throw new Error("Failed to send email")
  }
  return res.json()
}

// lib/email.js
export function signupEmailTemplate({ name, email }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NoteFlow</title>
        <style>
            body {
                font-family: 'Inter', 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .tagline {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .welcome-text {
                font-size: 18px;
                margin-bottom: 25px;
                color: #2d3748;
            }
            .features-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin: 30px 0;
            }
            .feature {
                text-align: center;
                padding: 20px;
                background: #f7fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            .feature-icon {
                width: 40px;
                height: 40px;
                margin: 0 auto 15px;
                background: #667eea;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .feature-title {
                font-weight: 600;
                margin-bottom: 8px;
                color: #2d3748;
            }
            .feature-desc {
                font-size: 14px;
                color: #718096;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }
            .security-note {
                background: #fff5f5;
                border: 1px solid #fed7d7;
                padding: 15px;
                border-radius: 8px;
                margin: 25px 0;
                font-size: 14px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f8fafc;
                color: #718096;
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-links a {
                color: #667eea;
                text-decoration: none;
                margin: 0 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📝 NoteFlow</div>
                <div class="tagline">Where Ideas Become Organized</div>
            </div>
            
            <div class="content">
                <h1>Welcome to NoteFlow${name ? ", " + name : ""}! 🎉</h1>
                
                <p class="welcome-text">
                    Thank you for joining NoteFlow – your ultimate note-taking companion. 
                    We're excited to help you organize your thoughts and ideas seamlessly.
                </p>

                <div class="features-grid">
                    <div class="feature">
                        <div class="feature-icon">📱</div>
                        <div class="feature-title">Cross-Platform Sync</div>
                        <div class="feature-desc">Access your notes anywhere, on any device</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🖼️</div>
                        <div class="feature-title">Rich Media Support</div>
                        <div class="feature-desc">Add images and attachments to your notes</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📄</div>
                        <div class="feature-title">PDF Export</div>
                        <div class="feature-desc">Download professional PDF versions</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔒</div>
                        <div class="feature-title">Secure & Private</div>
                        <div class="feature-desc">Your data is encrypted and protected</div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="https://yournoteflowapp.com/dashboard" class="cta-button">
                        Create Your First Note
                    </a>
                </div>

                <div class="security-note">
                    <strong>🔒 Account Security:</strong> Your account is registered with email: <strong>${email}</strong>. 
                    If this wasn't you, please contact our support team immediately.
                </div>

                <h3>Getting Started Guide:</h3>
                <ol style="color: #4a5568;">
                    <li>Log in to your dashboard</li>
                    <li>Create your first note using the composer</li>
                    <li>Explore formatting options and image uploads</li>
                    <li>Organize notes with tags and categories</li>
                    <li>Export notes as PDF when needed</li>
                </ol>
            </div>

            <div class="footer">
                <p>Need help? Our support team is here for you 24/7</p>
                <div class="social-links">
                    <a href="https://twitter.com/noteflow">Twitter</a> • 
                    <a href="https://facebook.com/noteflow">Facebook</a> • 
                    <a href="https://linkedin.com/company/noteflow">LinkedIn</a>
                </div>
                <p>© 2024 NoteFlow. All rights reserved.<br>
                You're receiving this email because you signed up for NoteFlow.</p>
                <p><a href="https://yournoteflowapp.com/unsubscribe" style="color: #718096;">Unsubscribe</a></p>
            </div>
        </div>
    </body>
    </html>`
}

export function noteActivityTemplate({ name, action, noteTitle, noteId, timestamp }) {
  const actionDetails = {
    create: { verb: 'created', icon: '✨', color: '#10b981', subject: 'New Note Created' },
    update: { verb: 'updated', icon: '✏️', color: '#3b82f6', subject: 'Note Updated' },
    delete: { verb: 'deleted', icon: '🗑️', color: '#ef4444', subject: 'Note Deleted' }
  };
  
  const { verb, icon, color, subject } = actionDetails[action] || actionDetails.update;
  const formattedTime = new Date(timestamp || new Date()).toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject} - NoteFlow</title>
        <style>
            body {
                font-family: 'Inter', 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 25px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                padding: 30px;
            }
            .activity-card {
                background: #f8fafc;
                border: 2px solid ${color}20;
                border-radius: 12px;
                padding: 25px;
                margin: 20px 0;
                text-align: center;
            }
            .activity-icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            .activity-title {
                font-size: 20px;
                font-weight: 600;
                color: ${color};
                margin-bottom: 10px;
            }
            .note-title {
                font-size: 18px;
                font-weight: 600;
                color: #2d3748;
                margin: 15px 0;
                padding: 10px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid ${color};
            }
            .details {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e2e8f0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #4a5568;
            }
            .action-buttons {
                text-align: center;
                margin: 25px 0;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background: ${color};
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 0 10px;
            }
            .security-alert {
                background: #fef2f2;
                border: 1px solid #fecaca;
                padding: 15px;
                border-radius: 8px;
                margin: 25px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f8fafc;
                color: #718096;
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📝 NoteFlow Activity</div>
            </div>
            
            <div class="content">
                <h2>Hello${name ? " " + name : ""},</h2>
                <p>We're letting you know about recent activity in your NoteFlow account.</p>

                <div class="activity-card">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-title">Note ${verb.charAt(0).toUpperCase() + verb.slice(1)}</div>
                    
                    <div class="note-title">
                        "${noteTitle || "Untitled Note"}"
                    </div>

                    <p>Your note was ${verb} successfully at ${formattedTime}.</p>
                </div>

                <div class="details">
                    <div class="detail-row">
                        <span class="detail-label">Activity Type:</span>
                        <span>Note ${verb}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Note Title:</span>
                        <span>${noteTitle || "Untitled Note"}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Timestamp:</span>
                        <span>${formattedTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Note ID:</span>
                        <span style="font-family: monospace; font-size: 12px;">${noteId || "N/A"}</span>
                    </div>
                </div>

                ${action !== 'delete' ? `
                <div class="action-buttons">
                    <a href="https://yournoteflowapp.com/notes/${noteId}" class="button">
                        View Note
                    </a>
                    <a href="https://yournoteflowapp.com/dashboard" class="button" style="background: #6b7280;">
                        Go to Dashboard
                    </a>
                </div>
                ` : ''}

                <div class="security-alert">
                    <strong>⚠️ Security Notice</strong>
                    <p>If you didn't perform this action, please:</p>
                    <ol style="text-align: left; margin: 10px 0; padding-left: 20px;">
                        <li>Change your password immediately</li>
                        <li>Check your recent activity</li>
                        <li>Contact our support team</li>
                    </ol>
                </div>

                <p>Happy note-taking!<br>— The NoteFlow Team</p>
            </div>

            <div class="footer">
                <p>© 2024 NoteFlow. Your productivity companion.<br>
                This is an automated message. Please do not reply to this email.</p>
                <p><a href="https://yournoteflowapp.com/notification-settings" style="color: #718096;">Manage notifications</a></p>
            </div>
        </div>
    </body>
    </html>`
    }

    export function passwordResetTemplate({ name, resetLink, expiryTime = 30 }) {
      return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - NoteFlow</title>
        <style>
            body {
                font-family: 'Inter', 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 25px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                padding: 30px;
            }
            .reset-card {
                background: #fffbeb;
                border: 2px solid #f59e0b;
                border-radius: 12px;
                padding: 25px;
                margin: 20px 0;
                text-align: center;
            }
            .reset-button {
                display: inline-block;
                background: #dc2626;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                font-size: 16px;
            }
            .warning {
                background: #fef2f2;
                border: 1px solid #fecaca;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f8fafc;
                color: #718096;
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📝 NoteFlow Password Reset</div>
            </div>
            
            <div class="content">
                <h2>Hello${name ? " " + name : ""},</h2>
                <p>We received a request to reset your NoteFlow account password.</p>

                <div class="reset-card">
                    <h3>🔒 Password Reset Request</h3>
                    <p>Click the button below to reset your password. This link will expire in ${expiryTime} minutes.</p>
                    
                    <a href="${resetLink}" class="reset-button">
                        Reset Password
                    </a>
                    
                    <p>Or copy and paste this link in your browser:<br>
                    <code style="font-size: 12px; color: #6b7280;">${resetLink}</code></p>
                </div>

                <div class="warning">
                    <strong>⚠️ Important Security Notice</strong>
                    <p>If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
                </div>

                <p>For security reasons, this link will expire in ${expiryTime} minutes.</p>
                <p>Stay secure,<br>— The NoteFlow Team</p>
            </div>

            <div class="footer">
                <p>© 2024 NoteFlow. Protecting your productivity.<br>
                This is an automated security message.</p>
            </div>
        </div>
    </body>
    </html>`
}



export function reminderEmailTemplate({ name, noteTitle, reminderDate, action }) {
  const isSet = action === "set"
  const isRemoved = action === "removed"
  
  return `
  <div style="font-family:Inter,Arial,sans-serif;padding:24px;max-width:600px;margin:0 auto;background-color:#f8fafc;">
    <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="background:linear-gradient(135deg, #3b82f6, #8b5cf6);width:60px;height:60px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 style="color:#1f2937;font-size:24px;font-weight:600;margin:0;">
          ${isSet ? 'Reminder Set Successfully' : 'Reminder Removed'}
        </h1>
      </div>

      <div style="background-color:#f1f5f9;padding:20px;border-radius:8px;margin-bottom:24px;">
        <p style="color:#64748b;margin:0;font-size:14px;line-height:1.5;">
          ${isSet 
            ? `Hello ${name}, you've successfully set a reminder for your note. We'll send you another email when it's time to review your note.`
            : `Hello ${name}, you've successfully removed the reminder from your note.`
          }
        </p>
      </div>

      <div style="background-color:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#1f2937;font-size:18px;font-weight:600;margin:0 0 12px 0;">
          ${isSet ? '📅 Reminder Details' : '📝 Note Information'}
        </h3>
        
        <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;">
          <span style="color:#64748b;font-weight:500;">Note Title:</span>
          <span style="color:#1f2937;font-weight:600;">${noteTitle || "Untitled Note"}</span>
          
          ${isSet ? `
          <span style="color:#64748b;font-weight:500;">Reminder Time:</span>
          <span style="color:#3b82f6;font-weight:600;">${reminderDate}</span>
          ` : ''}
        </div>
      </div>

      ${isSet ? `
      <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:24px;">
        <h4 style="color:#1e40af;font-size:16px;font-weight:600;margin:0 0 8px 0;display:flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What happens next?
        </h4>
        <p style="color:#374151;margin:0;font-size:14px;line-height:1.5;">
          We'll send you an email notification at the scheduled time with a direct link to this note. 
          Make sure to check your inbox!
        </p>
      </div>
      ` : ''}

      <div style="text-align:center;padding-top:24px;border-top:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:14px;margin:0 0 16px 0;">
          Need help with reminders? 
          <a href="#" style="color:#3b82f6;text-decoration:none;font-weight:500;">Visit our help center</a>
        </p>
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          This is an automated message from NoteFlow. Please do not reply to this email.
        </p>
      </div>
    </div>
  </div>`
}

// Export for cron job or reminder service
export function reminderNotificationTemplate({ name, noteTitle, noteId, noteContent }) {
  const truncatedContent = noteContent && noteContent.length > 150 
    ? noteContent.substring(0, 150) + '...' 
    : noteContent
  
  return `
  <div style="font-family:Inter,Arial,sans-serif;padding:24px;max-width:600px;margin:0 auto;background-color:#f8fafc;">
    <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="background:linear-gradient(135deg, #f59e0b, #ef4444);width:60px;height:60px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 style="color:#dc2626;font-size:24px;font-weight:600;margin:0;">
          ⏰ Reminder: Time to Review Your Note
        </h1>
      </div>

      <div style="background-color:#fef2f2;padding:20px;border-radius:8px;margin-bottom:24px;">
        <p style="color:#dc2626;margin:0;font-size:14px;line-height:1.5;font-weight:500;">
          Hello ${name}, this is your scheduled reminder to review your note.
        </p>
      </div>

      <div style="background-color:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#1f2937;font-size:18px;font-weight:600;margin:0 0 12px 0;">
          📝 ${noteTitle || "Untitled Note"}
        </h3>
        
        ${truncatedContent ? `
        <div style="background-color:#f8fafc;padding:16px;border-radius:6px;margin-bottom:16px;">
          <p style="color:#64748b;margin:0;font-size:14px;line-height:1.5;font-style:italic;">
            "${truncatedContent}"
          </p>
        </div>
        ` : ''}
        
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?note=${noteId}" 
           style="display:inline-block;background:linear-gradient(135deg, #3b82f6, #8b5cf6);color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500;font-size:14px;">
          📖 Open Note in NoteFlow
        </a>
      </div>

      <div style="text-align:center;padding-top:24px;border-top:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:14px;margin:0 0 16px 0;">
          This reminder was set by you in NoteFlow. 
          <a href="#" style="color:#3b82f6;text-decoration:none;font-weight:500;">Manage your reminders</a>
        </p>
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Don't want to receive reminders? You can disable them in your account settings.
        </p>
      </div>
    </div>
  </div>`
}