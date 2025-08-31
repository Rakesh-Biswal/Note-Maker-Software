// lib/pdf-export.js
export async function generateProfessionalPDF({ title, content, imageUrl }) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 48
  let y = margin

  // Set brand colors
  const primaryColor = '#2563eb' // blue-600
  const secondaryColor = '#4b5563' // gray-600
  const accentColor = '#10b981' // green-500

  // Header with branding
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, 595, 80, 'F')
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.text("NoteFlow", margin, 50)
  
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255, 0.8)
  doc.text("Professional Note-Taking Platform", margin, 70)

  // Main content area
  y = 100

  // Note title
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(primaryColor)
  doc.text(title || "Untitled Note", margin, y)
  y += 30

  // Divider
  doc.setDrawColor(primaryColor)
  doc.setLineWidth(2)
  doc.line(margin, y, 595 - margin, y)
  y += 20

  // Note content
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  doc.setTextColor(secondaryColor)

  if (content) {
    const lines = doc.splitTextToSize(content, 595 - margin * 2)
    for (let i = 0; i < lines.length; i++) {
      if (y > 742) {
        doc.addPage()
        y = margin
      }
      doc.text(lines[i], margin, y)
      y += 16
    }
    y += 10
  } else {
    doc.setFontStyle("italic")
    doc.text("No content provided", margin, y)
    y += 20
    doc.setFontStyle("normal")
  }

  // Image section
  if (imageUrl && imageUrl !== "https://blocks.astratic.com/img/general-img-landscape.png") {
    try {
      if (y > 642) {
        doc.addPage()
        y = margin
      }

      let dataUrl = imageUrl
      if (!imageUrl.startsWith("data:")) {
        const img = await fetch(imageUrl)
        const blob = await img.blob()
        dataUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }

      // Image with border and caption
      doc.setDrawColor(200)
      doc.setLineWidth(1)
      doc.rect(margin, y, 595 - margin * 2, 200)
      
      doc.addImage(dataUrl, "JPEG", margin + 2, y + 2, 595 - margin * 2 - 4, 196, undefined, "FAST")
      y += 210

      // Image caption
      doc.setFontSize(10)
      doc.setTextColor(secondaryColor)
      doc.text("Attached Image", margin, y)
      y += 20
    } catch (error) {
      console.error("Failed to add image to PDF:", error)
    }
  }

  // Add marketing section if content is short
  if (y < 500) {
    // Add decorative element
    doc.setFillColor(primaryColor)
    doc.rect(margin, y, 595 - margin * 2, 3, 'F')
    y += 20

    // Marketing message
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(primaryColor)
    doc.text("Powered by NoteFlow", margin, y)
    y += 20

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(secondaryColor)
    
    const marketingText = [
      "NoteFlow helps you organize your thoughts, ideas, and inspiration in one place.",
      "With features like:",
      "• Professional PDF exports",
      "• Image attachments",
      "• Smart reminders",
      "• Cloud synchronization",
      "• 100% free forever"
    ]

    for (const line of marketingText) {
      if (y > 742) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 16
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(secondaryColor)
    doc.text(`Page ${i} of ${pageCount}`, 595 - margin, 842 - 20, { align: "right" })
    
    // Copyright and branding
    doc.text("Generated with NoteFlow - Your Professional Note-Taking Companion", margin, 842 - 20)
    doc.text(new Date().toLocaleDateString(), 595 / 2, 842 - 20, { align: "center" })
  }

  return doc
}

export async function downloadNotePDF({ title, content, imageUrl }) {
  try {
    const doc = await generateProfessionalPDF({ title, content, imageUrl })
    const fileName = `${(title || "note").replace(/[^a-z0-9]/gi, '_').toLowerCase()}_noteflow.pdf`
    doc.save(fileName)
    return true
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error("Failed to generate PDF")
  }
}