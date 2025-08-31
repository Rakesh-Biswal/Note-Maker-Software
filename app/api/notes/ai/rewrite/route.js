import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI is not configured" }, { status: 503 })
    }

    const { text } = await req.json()
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const prompt = `Rewrite the following note into a formal, professional format with:
- A short subtitle summarizing the topic on the first line
- Then 4–10 concise bullet points
- Preserve the user's facts and intent. Do not invent details.
- Use plain text hyphen bullets ("- ") and clear, readable language.
- Avoid emojis and overuse of punctuation.

Original:
${text}`

    const result = await generateText({
      model: groq("llama-3.1-8b-instant"), // Updated model
      system: "You format user notes into clean, professional outlines.",
      prompt,
    })

    const improved = result.text
    return NextResponse.json({ text: improved })
  } catch (e) {
    console.error("AI rewrite error:", e)
    return NextResponse.json({ error: "Failed to rewrite" }, { status: 500 })
  }
}
