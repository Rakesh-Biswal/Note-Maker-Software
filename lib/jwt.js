// JWT helpers using jose
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const cookieName = "session"

function getSecret() {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me"
  return new TextEncoder().encode(secret)
}

export async function createToken(payload) {
  // payload can include: email, phone
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function readToken() {
  const store = await cookies()
  const token = store.get(cookieName)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload
  } catch {
    return null
  }
}

export async function setSessionCookie(payload, res) {
  const token = await createToken(payload)
  res.cookies.set({
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie(res) {
  res.cookies.set({
    name: cookieName,
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    expires: new Date(0),
  })
}
