import { NextResponse } from "next/server"
import { readToken } from "@/lib/jwt"

export async function GET() {
  try {
    const token = await readToken()
    
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ 
      authenticated: true,
      user: token 
    })
  } catch (error) {
    console.error("FetchMe error:", error)
    return NextResponse.json({ 
      authenticated: false,
      error: "Session check failed" 
    }, { status: 500 })
  }
}