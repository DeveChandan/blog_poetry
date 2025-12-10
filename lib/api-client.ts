// Client-side API helper for consistent error handling
export async function apiCall<T>(url: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || `Error: ${response.status}` }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}
