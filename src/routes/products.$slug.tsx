import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingCart, Shield, Sparkles, Zap } from "lucide-react";
import hrSystemImg from "@/assets/hr-system.png";
import socialListenerImg from "@/assets/social-media-listener.png";
import meetingAnalysisImg from "@/assets/meeting-analysis.png";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const title = titleize(params.slug);
    return {
      meta: [
        { title: `${title} — Pentacodex Products` },
        { name: "description", content: `Explore ${title} by Pentacodex — a premium product built for ambitious teams.` },
        { property: "og:title", content: `${title} — Pentacodex Products` },
        { property: "og:description", content: `Explore ${title} by Pentacodex.` },
      ],
    };
  },
  component: ProductPage,
});

function titleize(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

const PRODUCT_DETAILS: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string;
    image: string;
    features: string[];
    benefits: { title: string; desc: string; icon: any }[];
  }
> = {
  "hr-system": {
    title: "HR System",
    tagline: "Modern Employee Management & Workplace Automation",
    description: "Streamline your company operations with a unified HR platform. Automate attendance tracking, check-ins, employee directories, calendar schedules, leaves, and payroll calculations—all housed within a premium, high-performance web dashboard.",
    image: hrSystemImg,
    features: [
      "Dynamic Employee Directory & Profiles",
      "Automated attendance tracking and check-ins",
      "Punctuality analytics & automated absence reports",
      "Interactive company calendar & workshop scheduling",
      "Leave requesting and payroll approval workflows",
    ],
    benefits: [
      { title: "Reduce Overhead", desc: "Automate administrative paperwork and save up to 15 hours per week.", icon: Zap },
      { title: "Secure Data", desc: "Enterprise-grade role permissions ensuring strict employee privacy.", icon: Shield },
      { title: "Real-time Metrics", desc: "Interactive dashboards highlighting attendance trends and absentees.", icon: Sparkles },
    ],
  },
  "social-media-listener": {
    title: "Social Media Listener",
    tagline: "Real-time Brand Monitoring & Sentiment Analysis",
    description: "Listen to what the world is saying about your brand in real time. Track posts, hashtags, and mentions across major platforms, analyze positive vs. negative sentiment trends, and leverage AI keyword clustering to capture customer intents.",
    image: socialListenerImg,
    features: [
      "Global Social Activity multi-channel feeds tracking",
      "AI-driven Positive vs. Negative sentiment breakdowns",
      "Popular Keywords frequency and topic clouds",
      "Interactive timeline feed for real-time brand mentions",
      "Automated negative comment alerts and reports",
    ],
    benefits: [
      { title: "Proactive PR", desc: "Get alerted immediately on negative spikes to manage brand image.", icon: Shield },
      { title: "Market Insights", desc: "Capture viral keywords and trending customer demands instantly.", icon: Sparkles },
      { title: "Omnichannel Coverage", desc: "Monitor Twitter/X, Facebook, Instagram, LinkedIn, and TikTok in one feed.", icon: Zap },
    ],
  },
  "meeting-analysis": {
    title: "Meeting Analysis",
    tagline: "AI Meeting Transcripts, Actions & Insights",
    description: "Turn every meeting into structured database intelligence. Automatically record, transcribe, list key decisions, assign action items, and analyze speaker talk-time percentages to optimize team productivity.",
    image: meetingAnalysisImg,
    features: [
      "Real-time audio-to-text transcript highlighting key phrases",
      "Automated task items generator with assignees and due dates",
      "Speaker talk-time distribution analytics",
      "Topic cluster categories and meeting keywords tags",
      "Integration with Google Meet, Zoom, and MS Teams",
    ],
    benefits: [
      { title: "Never Forget Actions", desc: "AI automatically drafts tasks and syncs them to your CRM/HR tools.", icon: Sparkles },
      { title: "Optimize Time", desc: "Track speaker contribution and reduce meeting overhead by 25%.", icon: Zap },
      { title: "Searchable Knowledge", desc: "Keep a secure, searchable registry of all company meetings.", icon: Shield },
    ],
  },
};

function ProductPage() {
  const { slug } = Route.useParams();
  const product = PRODUCT_DETAILS[slug];

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 text-[color:var(--cyan)] hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-foreground">
      {/* Dynamic background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.4),_transparent_60%)]" />
        <div className="absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.18),_transparent_75%)] blur-3xl" />
      </div>

      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="text-glow text-xs font-bold uppercase tracking-wider text-[color:var(--cyan)]">
            Pentacodex Products
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)]/20 bg-[color:var(--cyan)]/5 px-4 py-1.5 text-xs font-semibold text-[color:var(--cyan)] tracking-wider uppercase mb-6 self-start">
              Product Overview
            </div>
            
            <h1 className="text-glow text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              {product.title}
            </h1>
            
            <p className="mt-3 text-lg font-medium text-white/80">
              {product.tagline}
            </p>

            <p className="mt-6 text-sm md:text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="mt-8 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Key Features Included:</h3>
              <ul className="space-y-2.5">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[color:var(--cyan)]/10 text-[color:var(--cyan)] border border-[color:var(--cyan)]/25">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Action Button */}
            <div className="mt-10">
              <Link
                to="/"
                search={{ order: slug }}
                className="group relative inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[color:var(--cyan)]/20 hover:shadow-[0_0_40px_-5px_rgba(0,242,254,0.8)]"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Order Now — Request Setup</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Screenshot Mockup */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-2 shadow-[0_0_50px_-15px_rgba(0,242,254,0.3)] transition-all hover:border-[color:var(--cyan)]/40 hover:shadow-[0_0_60px_-10px_rgba(0,242,254,0.5)]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.05] rounded-3xl" />
              <img
                src={product.image}
                alt={`${product.title} Dashboard UI Mockup`}
                width={800}
                height={600}
                className="rounded-2xl w-full h-auto object-cover border border-white/5 transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mt-20 border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {product.benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="glass-card relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-all hover:border-[color:var(--cyan)]/25">
                  <div className="flex items-center gap-3.5 mb-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] border border-white/10 text-[color:var(--cyan)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{benefit.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}