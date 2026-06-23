"use client"

function getApiBase(): string {
  if (typeof window === "undefined") return "/api"
  const cfg = (window as any).SMART_CONSULTA_CONFIG || {}
  const host = window.location.hostname
  const apiByHost = cfg.apiByHost || {}
  if (apiByHost[host]) return apiByHost[host].replace(/\/$/, "")
  if (host === "localhost" || host === "127.0.0.1")
    return (cfg.localApiBase || "http://localhost:3000/api").replace(/\/$/, "")
  return (cfg.apiBase || "/api").replace(/\/$/, "")
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sc_token") : null
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = "Bearer " + token

  const res = await fetch(getApiBase() + endpoint, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || "Erro")
  return data as T
}
