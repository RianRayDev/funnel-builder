import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Render } from "@measured/puck"
import { puckConfig } from "@/lib/puck-config"
import { supabase } from "@/lib/supabase"
import { store } from "@/lib/store"
import { ComingSoonPage } from "@/components/ComingSoonPage"
import { NotFoundPage } from "@/components/NotFoundPage"
import type { Data } from "@measured/puck"

function usePublishedFunnel(slug: string | undefined) {
  const isHomepage = !slug
  const [data, setData] = useState<{ content: Data; title: string; description: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let query = supabase.from("projects").select("content, name, slug, is_main").order("updated_at", { ascending: false })
        if (isHomepage) {
          query = query.limit(1)
        } else {
          query = query.eq("slug", slug).limit(1)
        }
        const { data: rows, error } = await query
        if (!error && rows && rows.length > 0) {
          const row = rows[0]
          const content = typeof row.content === "string" ? JSON.parse(row.content) : row.content
          const rootProps = content?.root?.props || {}
          setData({
            content,
            title: rootProps.title || row.name || "",
            description: rootProps.description || "",
          })
        } else {
          const localProject = store.getBySlug(slug || "main")
          if (localProject) {
            const rootProps = (localProject.content as any)?.root?.props || {}
            setData({
              content: localProject.content,
              title: rootProps.title || localProject.name || "",
              description: rootProps.description || "",
            })
          } else {
            setNotFound(true)
          }
        }
      } catch {
        const localProject = store.getBySlug(slug || "main")
        if (localProject) {
          const rootProps = (localProject.content as any)?.root?.props || {}
          setData({
            content: localProject.content,
            title: rootProps.title || localProject.name || "",
            description: rootProps.description || "",
          })
        } else {
          setNotFound(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [slug, isHomepage])

  return { data, loading, notFound, isHomepage }
}

function useSEO(title: string, description: string) {
  useEffect(() => {
    if (!title) return
    document.title = title

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement | null
      if (el) el.content = content
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', window.location.href)
    setMeta('meta[property="og:site_name"]', title)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('link[rel="canonical"]', window.location.href)

    let schema = document.querySelector('script[type="application/ld+json"]')
    if (!schema) {
      schema = document.createElement("script")
      schema.setAttribute("type", "application/ld+json")
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: window.location.href,
    })

    return () => {
      document.title = "Funnel Builder"
    }
  }, [title, description])
}

export function PublicFunnelPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, notFound, isHomepage } = usePublishedFunnel(slug)

  useSEO(data?.title || "", data?.description || "")

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
      </div>
    )
  }

  if (notFound && isHomepage) return <ComingSoonPage />
  if (notFound) return <NotFoundPage />
  if (!data) return <NotFoundPage />

  return (
    <div className="min-h-screen bg-white funnel-viewport">
      <Render config={puckConfig} data={data.content} />
    </div>
  )
}
