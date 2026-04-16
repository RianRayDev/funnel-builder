import { store } from "@/lib/store"
import { isStorageUrl } from "@/hooks/useStorage"

/**
 * Recursively scan a value for Supabase Storage URLs.
 * Walks objects and arrays, collects any string that matches our bucket.
 */
function collectUrls(value: unknown, urls: Set<string>): void {
  if (typeof value === "string" && isStorageUrl(value)) {
    urls.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, urls)
    return
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectUrls(v, urls)
  }
}

/**
 * Scan all projects and return every Supabase Storage URL currently in use.
 * Also returns a map of URL → project names for display.
 */
export function scanUsedImages(): { usedUrls: Set<string>; urlToProjects: Map<string, string[]> } {
  const usedUrls = new Set<string>()
  const urlToProjects = new Map<string, string[]>()
  const projects = store.list()

  for (const project of projects) {
    const projectUrls = new Set<string>()
    collectUrls(project.content, projectUrls)

    for (const url of projectUrls) {
      usedUrls.add(url)
      const existing = urlToProjects.get(url) || []
      existing.push(project.name)
      urlToProjects.set(url, existing)
    }
  }

  return { usedUrls, urlToProjects }
}
