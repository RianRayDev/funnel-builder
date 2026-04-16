import { useState } from "react"
import { useParams } from "react-router"
import { Render } from "@measured/puck"
import { puckConfig } from "@/lib/puck-config"
import { store } from "@/lib/store"
import { ComingSoonPage } from "@/components/ComingSoonPage"
import { NotFoundPage } from "@/components/NotFoundPage"

export function PublicFunnelPage() {
  const { slug } = useParams<{ slug: string }>()
  const isHomepage = !slug
  const resolvedSlug = slug || "main"
  const [project] = useState(() => store.getBySlug(resolvedSlug))

  // Homepage with no main funnel → coming soon
  if (!project && isHomepage) {
    return <ComingSoonPage />
  }

  // Slug page with no matching funnel → 404
  if (!project) {
    return <NotFoundPage />
  }

  // Render the published funnel — clean, no banner, full-screen
  return (
    <div className="min-h-screen bg-white">
      <Render config={puckConfig} data={project.content} />
    </div>
  )
}
