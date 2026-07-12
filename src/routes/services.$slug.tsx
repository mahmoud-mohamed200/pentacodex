import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const title = titleize(params.slug);
    return {
      meta: [
        { title: `${title} — pentacodex Services` },
        { name: "description", content: `Learn how pentacodex delivers ${title.toLowerCase()} for ambitious teams.` },
        { property: "og:title", content: `${title} — pentacodex Services` },
        { property: "og:description", content: `Learn how pentacodex delivers ${title.toLowerCase()} for ambitious teams.` },
      ],
    };
  },
  component: ServicePage,
});

function titleize(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function ServicePage() {
  const { slug } = Route.useParams();
  const title = titleize(slug);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.6),_transparent_60%)]" />
        <div className="absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.25),_transparent_70%)] blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <h1 className="text-glow mt-8 text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          This is a placeholder page for our {title} service. Detailed content is coming soon.
        </p>
      </div>
    </div>
  );
}