import { useState } from "react"
import { supabase } from "@/lib/supabase"

const BUCKET = "funnel-assets"

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File, folder?: string): Promise<string | null> {
    setUploading(true)
    setError(null)

    const ext = file.name.split(".").pop()
    const name = `${folder || "images"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { data, error: uploadError } = await supabase.storage.from(BUCKET).upload(name, file, {
      cacheControl: "3600",
      upsert: false,
    })

    setUploading(false)

    if (uploadError) {
      setError(uploadError.message)
      return null
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return urlData.publicUrl
  }

  return { upload, uploading, error }
}
