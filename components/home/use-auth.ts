"use client"
import useSWR from "swr"

type AuthResponse = { authenticated?: boolean; user?: { id?: string; name?: string } }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthResponse>("/api/auth/fetchme", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })
  const isAuthenticated = Boolean(data?.authenticated)
  return { isAuthenticated, user: data?.user, isLoading, error, refresh: mutate }
}
