import { useState } from "react"
import { supabase } from "@/lib/supabase"

const BUCKET = "funnel-assets"

interface UploadResult {
  url: string | null
  error: string | null
}

export interface StorageFile {
  name: string
  path: string
  publicUrl: string
  createdAt: string
}

/** Get the current user's ID, or null */
async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

/** User-scoped folder path */
async function userFolder(): Promise<string | null> {
  const uid = await getUserId()
  return uid ? `images/${uid}` : null
}

/** Standalone upload — scoped to authenticated user */
export async function uploadToStorage(file: File): Promise<UploadResult> {
  const folder = await userFolder()
  if (!folder) {
    return { url: null, error: "Not authenticated — sign in to upload images" }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data, error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    if (error.message.includes("Bucket not found")) {
      return { url: null, error: "Storage bucket 'funnel-assets' not found — create it in Supabase Dashboard → Storage" }
    }
    if (error.message.includes("new row violates") || error.message.includes("Unauthorized") || error.message.includes("security")) {
      return { url: null, error: "Upload blocked by storage policy — add an INSERT policy for authenticated users in Supabase" }
    }
    return { url: null, error: error.message }
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return { url: urlData.publicUrl, error: null }
}

/** List all images uploaded by the current user */
export async function listUserImages(): Promise<StorageFile[]> {
  const folder = await userFolder()
  if (!folder) return []

  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    sortBy: { column: "created_at", order: "desc" },
  })

  if (error || !data) return []

  return data
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => {
      const path = `${folder}/${f.name}`
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return {
        name: f.name,
        path,
        publicUrl: urlData.publicUrl,
        createdAt: f.created_at || new Date().toISOString(),
      }
    })
}

/** Extract the storage path from a Supabase public URL */
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl)
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/funnel-assets\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/** Check if a URL is from our Supabase bucket */
export function isStorageUrl(url: string): boolean {
  return extractStoragePath(url) !== null
}

/** Delete a file from storage by its public URL */
export async function deleteFromStorage(publicUrl: string): Promise<boolean> {
  const path = extractStoragePath(publicUrl)
  if (!path) return false

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return !error
}

/** Delete unused images older than N days */
export async function cleanupUnusedImages(usedUrls: Set<string>, maxAgeDays = 7): Promise<number> {
  const files = await listUserImages()
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  let deleted = 0

  for (const file of files) {
    if (usedUrls.has(file.publicUrl)) continue
    const age = new Date(file.createdAt).getTime()
    if (age < cutoff) {
      const ok = await deleteFromStorage(file.publicUrl)
      if (ok) deleted++
    }
  }

  return deleted
}

/** Re-authenticate user with password (for locked image deletion) */
export async function reauthenticate(password: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.email) return false

  const { error } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password,
  })
  return !error
}

/** Hook version for components that need reactive state */
export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File): Promise<string | null> {
    setUploading(true)
    setError(null)

    const result = await uploadToStorage(file)

    setUploading(false)

    if (result.error) {
      setError(result.error)
      return null
    }

    return result.url
  }

  return { upload, uploading, error }
}
