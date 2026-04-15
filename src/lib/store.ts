import type { Project } from "@/types"
import type { Data } from "@measured/puck"

const STORAGE_KEY = "funnel-builder-projects"

function getProjects(): Project[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function uniqueSlug(base: string, exclude?: string): string {
  const projects = getProjects()
  let slug = base
  let counter = 1
  while (projects.some((p) => p.slug === slug && p.id !== exclude)) {
    slug = `${base}-${counter}`
    counter++
  }
  return slug
}

function defaultContent(): Data {
  return {
    content: [],
    root: { props: { title: "Untitled Page" } },
  }
}

export const store = {
  list(): Project[] {
    return getProjects().sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  },

  get(id: string): Project | undefined {
    return getProjects().find((p) => p.id === id)
  },

  getBySlug(slug: string): Project | undefined {
    if (slug === "main") return getProjects().find((p) => p.is_main)
    return getProjects().find((p) => p.slug === slug)
  },

  getMain(): Project | undefined {
    return getProjects().find((p) => p.is_main)
  },

  create(name: string): Project {
    const projects = getProjects()
    const slug = uniqueSlug(toSlug(name))
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      slug,
      status: "draft",
      is_main: false,
      thumbnail_url: null,
      content: defaultContent(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    projects.push(project)
    saveProjects(projects)
    return project
  },

  update(id: string, data: Partial<Project>): Project | undefined {
    const projects = getProjects()
    const idx = projects.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    projects[idx] = { ...projects[idx], ...data, updated_at: new Date().toISOString() }
    saveProjects(projects)
    return projects[idx]
  },

  setMain(id: string) {
    const projects = getProjects()
    for (const p of projects) p.is_main = p.id === id
    saveProjects(projects)
  },

  delete(id: string) {
    const projects = getProjects().filter((p) => p.id !== id)
    saveProjects(projects)
  },

  duplicate(id: string): Project | undefined {
    const original = this.get(id)
    if (!original) return undefined
    const copy = this.create(original.name + " (Copy)")
    this.update(copy.id, { content: structuredClone(original.content) })
    return this.get(copy.id)
  },
}
