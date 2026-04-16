import type { Data } from "@measured/puck"

export interface Project {
  id: string
  name: string
  slug: string
  status: "building" | "ready" | "published"
  is_main: boolean
  thumbnail_url: string | null
  content: Data
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  role: "admin" | "client"
  avatar_url: string | null
}
