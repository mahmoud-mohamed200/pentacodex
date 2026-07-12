import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

import { SalesChatbot } from "@/components/SalesChatbot";
import {
  submitInquiryAction,
  bookDiscoveryCallAction,
  getBookingsAction,
} from "../lib/actions";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Smartphone,
  Building2,
  Users,
  BrainCircuit,
  Eye,
  MessageSquareText,
  Workflow,
  UserCog,
  Radio,
  BarChart3,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import conveyorImg from "@/assets/hero-conveyor.png";

type Service = { title: string; slug: string; Icon: LucideIcon };
type Product = { title: string; slug: string; Icon: LucideIcon };

const PRODUCTS: Product[] = [
  { title: "HR System", slug: "hr-system", Icon: UserCog },
  { title: "Social Media Listener", slug: "social-media-listener", Icon: Radio },
  { title: "Meeting Analysis", slug: "meeting-analysis", Icon: BarChart3 },
];

const SERVICES: { heading: string; items: Service[] }[] = [
  {
    heading: "Enterprise & Platforms",
    items: [
      { title: "Web Applications", slug: "web-applications", Icon: Globe },
      { title: "Mobile App Development", slug: "mobile-app-development", Icon: Smartphone },
      { title: "ERP Systems (Internal Operations)", slug: "erp-systems", Icon: Building2 },
      { title: "CRM Systems (External Interactions)", slug: "crm-systems", Icon: Users },
    ],
  },
  {
    heading: "Advanced Tech & AI",
    items: [
      { title: "AI & Machine Learning", slug: "ai-machine-learning", Icon: BrainCircuit },
      { title: "Computer Vision & Real-Time Image Processing", slug: "computer-vision", Icon: Eye },
      { title: "Natural Language Processing & LLMs", slug: "nlp-llms", Icon: MessageSquareText },
      { title: "AI Automation & API Development", slug: "ai-automation", Icon: Workflow },
    ],
  },
];

const SERVICE_DETAILS: Record<string, { label: string; description: string; Icon: LucideIcon }> = {
  "web-applications": {
    label: "Web Application",
    Icon: Globe,
    description:
      "Custom, high-performance web applications engineered with modern front-end and back-end frameworks. Built to scale seamlessly, handle heavy user traffic, and deliver a flawless, responsive user experience across desktop and mobile devices.",
  },
  "mobile-app-development": {
    label: "Mobile App",
    Icon: Smartphone,
    description:
      "Premium native and cross-platform mobile applications tailored perfectly for iOS and Android. Focused on high-speed performance, intuitive user interfaces, and seamless integration with hardware features and push notification ecosystems.",
  },
  "erp-systems": {
    label: "ERP System",
    Icon: Building2,
    description:
      "Comprehensive Enterprise Resource Planning software designed to centralize internal operations. Seamlessly integrates human resources, automated payroll, financial accounting, asset management, and supply chain logistics into one secure dashboard.",
  },
  "crm-systems": {
    label: "CRM System",
    Icon: Users,
    description:
      "Strategic Customer Relationship Management platforms built to maximize external interactions. Streamline your sales pipelines, track lead conversions, automate marketing campaigns, and empower customer support teams with real-time data.",
  },
  "ai-machine-learning": {
    label: "AI & Machine Learning",
    Icon: BrainCircuit,
    description:
      "Intelligent predictive modeling and advanced data-driven algorithms designed to automate complex decision-making, detect anomalies, forecast market trends, and uncover hidden operational insights from your data.",
  },
  "computer-vision": {
    label: "Computer Vision & Real-Time",
    Icon: Eye,
    description:
      "Cutting-edge visual processing systems capable of real-time video and image analysis. Engineered for automatic object detection, facial recognition, industrial quality inspection, and intelligent spatial tracking.",
  },
  "nlp-llms": {
    label: "Natural Language Processing & LLMs",
    Icon: MessageSquareText,
    description:
      "Custom generative AI tools, secure enterprise chatbots, and smart semantic search engines utilizing the power of Large Language Models. Automate document summarization, sentiment analysis, and intelligent text generation.",
  },
  "ai-automation": {
    label: "AI Automation & API Development",
    Icon: Workflow,
    description:
      "End-to-end workflow automation linking your existing software stack with AI capabilities. We build robust, ultra-secure RESTful/GraphQL APIs to eliminate manual tasks, sync databases, and accelerate your business productivity.",
  },
};

const searchSchema = z.object({
  order: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "pentacodex — Your ideas, built into software" },
      { name: "description", content: "Delivering solutions today, built with quality that empowers your tomorrow. pentacodex crafts premium software for ambitious teams." },
      { property: "og:title", content: "pentacodex — Your ideas, built into software" },
      { property: "og:description", content: "Delivering solutions today, built with quality that empowers your tomorrow." },
    ],
  }),
  component: Index,
});

function Index() {
  const { order } = Route.useSearch();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [contactPreset, setContactPreset] = useState<string | undefined>(undefined);
  const [estimatorDetails, setEstimatorDetails] = useState<{ details: string; budget: string } | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [bookingNotes, setBookingNotes] = useState<string | undefined>(undefined);
  const [prefilledName, setPrefilledName] = useState<string>("");
  const [prefilledEmail, setPrefilledEmail] = useState<string>("");
  const [prefilledPhone, setPrefilledPhone] = useState<string>("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (order) {
      const productLabels: Record<string, string> = {
        "hr-system": "HR System",
        "social-media-listener": "Social Media Listener",
        "meeting-analysis": "Meeting Analysis",
      };
      const productLabel = productLabels[order] || order;
      setContactPreset(productLabel);
      setContactOpen(true);
    }
  }, [order]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clientUser");
      if (saved) {
        try {
          const user = JSON.parse(saved);
          if (user.name) setPrefilledName(user.name);
          if (user.email) setPrefilledEmail(user.email);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);
  const navServicesRef = useRef<HTMLButtonElement | null>(null);
  const productsMenuRef = useRef<HTMLDivElement | null>(null);
  const productsTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        menuRef.current?.contains(t) ||
        navServicesRef.current?.contains(t)
      ) return;
      setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProductsOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        productsMenuRef.current?.contains(t) ||
        productsTriggerRef.current?.contains(t)
      ) return;
      setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [productsOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.6),_transparent_60%)]" />
        <div className="absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.35),_rgba(0,242,254,0.08)_40%,_transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#000_100%)]" />
      </div>

      {/* Navbar */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="/" className="flex items-center">
          <Logo className="h-12 w-auto" />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <button
            ref={navServicesRef}
            onClick={() => { setServicesOpen((v) => !v); setProductsOpen(false); }}
            aria-expanded={servicesOpen}
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Services
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
          </button>
          <div className="relative">
            <button
              ref={productsTriggerRef}
              onClick={() => { setProductsOpen((v) => !v); setServicesOpen(false); }}
              aria-expanded={productsOpen}
              className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Products
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
            </button>
            {productsOpen && (
              <div
                ref={productsMenuRef}
                className="absolute right-0 top-full z-40 mt-3 w-72 origin-top animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="relative overflow-hidden rounded-2xl border border-[color:var(--cyan)]/30 bg-[#0A0A0A]/95 p-2 shadow-[0_0_50px_-10px_rgba(0,242,254,0.4)] backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent" />
                  {PRODUCTS.map(({ title, slug, Icon }) => (
                    <Link
                      key={slug}
                      to="/products/$slug"
                      params={{ slug }}
                      onClick={() => setProductsOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-[#141414]"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#1A1A1A] transition-all group-hover:shadow-[0_0_18px_-2px_rgba(0,242,254,0.6)] group-hover:ring-1 group-hover:ring-[color:var(--cyan)]/50">
                        <Icon className="h-4.5 w-4.5 text-gray-300 transition-colors group-hover:text-[color:var(--cyan)]" />
                      </span>
                      <span className="text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                        {title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            to="/admin"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-[color:var(--cyan)]"
          >
            Admin Portal
          </Link>
        </nav>

        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); setContactPreset(undefined); setContactOpen(true); setServicesOpen(false); setProductsOpen(false); }}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10 hover:shadow-[0_0_30px_-5px_rgba(0,242,254,0.5)]"
        >
          Contact us
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </header>

      {/* Services mega-menu */}
      {servicesOpen && (
        <div
          ref={menuRef}
          className="absolute inset-x-0 top-[88px] z-20 origin-top animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="border-t border-[color:var(--cyan)]/40 bg-[#0A0A0A]/95 shadow-[0_0_60px_-10px_rgba(0,242,254,0.35)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent opacity-70" />
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 md:gap-12 md:px-10 md:py-14">
              {SERVICES.map((col) => (
                <div key={col.heading}>
                  <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {col.heading}
                  </div>
                  <div className="flex flex-col gap-1">
                    {col.items.map(({ title, slug, Icon }) => (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => { setActiveService(slug); setServicesOpen(false); }}
                        className="group flex w-full items-center gap-4 rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-white/10 hover:bg-[#141414]"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1A1A1A] transition-all group-hover:shadow-[0_0_20px_-2px_rgba(0,242,254,0.6)] group-hover:ring-1 group-hover:ring-[color:var(--cyan)]/50">
                          <Icon className="h-5 w-5 text-gray-300 transition-colors group-hover:text-[color:var(--cyan)]" />
                        </span>
                        <span className="text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                          {title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <section className="relative mx-auto mt-10 md:mt-20">
          {/* Glass frame */}
          <div className="glass-card relative mx-auto overflow-hidden rounded-[2.5rem] px-6 py-20 sm:py-28 md:px-16 md:py-36">
            {/* inner glow border */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] [background:linear-gradient(180deg,rgba(255,255,255,0.08),transparent_40%)]" />
            <div className="pointer-events-none absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)]/60 to-transparent" />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--cyan)] shadow-[0_0_10px_var(--cyan)]" />
                &nbsp; scalable code.intelligent design
              </div>
              <h1 className="text-glow text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {["Your", "ideas,", "built"].map((word, i) => (
                  <motion.span
                    key={`l1-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.85,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1 + i * 0.12,
                    }}
                  >
                    {word}
                    {i < 2 ? "\u00A0" : ""}
                  </motion.span>
                ))}
                <br className="hidden sm:block" />
                {["into", "software"].map((word, i) => (
                  <motion.span
                    key={`l2-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.85,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1 + 3 * 0.12 + i * 0.12,
                    }}
                  >
                    {word}
                    {i < 1 ? "\u00A0" : ""}
                  </motion.span>
                ))}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
                Delivering solutions today, built with quality that empowers your tomorrow.
              </p>

              <div className="mt-10 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => { setContactPreset(undefined); setChatbotOpen(true); }}
                  className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--cyan)]/50 bg-[#0A0A0A] px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:border-[color:var(--cyan)] hover:shadow-[0_0_40px_-5px_rgba(0,242,254,0.7)]"
                >
                  <span>Let's talk</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 [background:radial-gradient(ellipse_at_center,rgba(0,242,254,0.15),transparent_70%)]" />
                </button>
              </div>
            </div>

            {/* Conveyor graphic */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 hidden w-[55%] max-w-[720px] opacity-90 md:block lg:-bottom-16 lg:-right-16">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.25),transparent_70%)] blur-2xl" />
              <img
                src={conveyorImg}
                alt="Futuristic neon circuit conveyor with glowing server cubes"
                width={1280}
                height={896}
                className="h-auto w-full [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
              />
            </div>
          </div>

          {/* Mobile conveyor */}
          <div className="relative mx-auto mt-10 w-full max-w-md md:hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.25),transparent_70%)] blur-2xl" />
            <img
              src={conveyorImg}
              alt=""
              width={1280}
              height={896}
              className="h-auto w-full opacity-90"
              loading="lazy"
            />
          </div>

          {/* Stats / logos strip */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/5 pt-10 sm:grid-cols-3 md:mt-28">
            {[
              { v: "60+", l: "Products shipped" },
              { v: "4.9/5", l: "Client satisfaction" },
              { v: "24/7", l: "Engineering support" },
            ].map((s) => (
              <div key={s.l} className="text-center sm:text-left">
                <div className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
              </div>
            ))}
          </div>



          <div className="h-32" />
        </section>
      </main>

      {/* Floating testimonial widget removed */}
      {activeService && (
        <ServiceModal
          slug={activeService}
          onClose={() => setActiveService(null)}
          onGetStarted={(label) => {
            setActiveService(null);
            setContactPreset(label);
            setContactOpen(true);
          }}
        />
      )}
      {contactOpen && (
        <ContactModal
          initialService={contactPreset}
          initialDetails={estimatorDetails?.details}
          initialBudget={estimatorDetails?.budget}
          onClose={() => { setContactOpen(false); setEstimatorDetails(null); }}
        />
      )}
      {chatbotOpen && (
        <SalesChatbot
          onClose={() => setChatbotOpen(false)}
          onRedirectToForm={(details) => {
            setChatbotOpen(false);
            setContactPreset("Other");
            setEstimatorDetails({ details, budget: "" });
            setContactOpen(true);
          }}
          onOpenSchedule={(notes, name, email, phone) => {
            setBookingNotes(notes);
            setPrefilledName(name || "");
            setPrefilledEmail(email || "");
            setPrefilledPhone(phone || "");
            setScheduleOpen(true);
          }}
        />
      )}
      {scheduleOpen && (
        <ScheduleModal
          onClose={() => {
            setScheduleOpen(false);
            setBookingNotes(undefined);
            setPrefilledName("");
            setPrefilledEmail("");
            setPrefilledPhone("");
          }}
          initialNotes={bookingNotes}
          initialName={prefilledName}
          initialEmail={prefilledEmail}
          initialPhone={prefilledPhone}
        />
      )}
    </div>
  );
}

function ContactModal({
  onClose,
  initialService,
  initialDetails,
  initialBudget,
}: {
  onClose: () => void;
  initialService?: string;
  initialDetails?: string;
  initialBudget?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        company: (formData.get("company") as string) || undefined,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        service: formData.get("service") as string,
        details: formData.get("details") as string,
        budgetEstimate: (formData.get("budgetEstimate") as string) || undefined,
      };

      const res = await submitInquiryAction({ data: payload });
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to submit request.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-[color:var(--cyan)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,242,254,0.15)]";
  const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200 sm:p-8">
      <div
        onClick={onClose}
        className="absolute inset-0"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="relative my-auto w-full max-w-3xl origin-center animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--cyan)]/30 bg-[#0A0A0A]/95 shadow-[0_0_80px_-10px_rgba(0,242,254,0.35)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.25),transparent_70%)] blur-3xl" />

          <button
            onClick={onClose}
            aria-label="Close contact form"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-14 text-center">
                <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 shadow-[0_0_40px_-5px_rgba(0,242,254,0.6)]">
                  <CheckCircle2 className="h-8 w-8 text-[color:var(--cyan)]" />
                </div>
                <h2 className="text-glow text-2xl font-bold tracking-tight sm:text-3xl">Thank you!</h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                  We received your request and will reach out soon.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 id="contact-title" className="text-glow text-2xl font-bold tracking-tight sm:text-3xl">
                    Let's build something together
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tell us about your project — we'll get back within one business day.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                  <input type="hidden" name="budgetEstimate" value={initialBudget ?? ""} />

                  <div>
                    <label className={labelCls} htmlFor="firstName">First name</label>
                    <input id="firstName" name="firstName" required maxLength={80} className={inputCls} placeholder="Jane" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="lastName">Last name</label>
                    <input id="lastName" name="lastName" required maxLength={80} className={inputCls} placeholder="Doe" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="company">Company / business name</label>
                    <input id="company" name="company" maxLength={120} className={inputCls} placeholder="Acme Inc." />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" required maxLength={255} className={inputCls} placeholder="jane@acme.com" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="phone">Phone number</label>
                    <input id="phone" name="phone" type="tel" maxLength={40} className={inputCls} placeholder="+1 555 123 4567" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="service">Which service are you looking for?</label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        required
                        defaultValue={initialService ?? ""}
                        className={`${inputCls} appearance-none pr-10`}
                      >
                        <option value="" disabled className="bg-[#0A0A0A]">Select a service…</option>
                        {[
                          "Web Application",
                          "Mobile App",
                          "ERP System",
                          "CRM System",
                          "AI & Machine Learning",
                          "Computer Vision & Real-Time",
                          "Natural Language Processing & LLMs",
                          "AI Automation & API Development",
                          "HR System",
                          "Social Media Listener",
                          "Meeting Analysis",
                          "Other",
                        ].map((o) => (
                          <option key={o} value={o} className="bg-[#0A0A0A] text-white">{o}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="details">Project details</label>
                    <textarea
                      id="details"
                      name="details"
                      required
                      rows={5}
                      maxLength={2000}
                      className={`${inputCls} resize-none`}
                      placeholder="Tell us exactly what you need…"
                      defaultValue={initialDetails ?? ""}
                    />
                  </div>

                  {error && (
                    <div className="sm:col-span-2 text-red-500 text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="sm:col-span-2 mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[color:var(--cyan)]/20 hover:shadow-[0_0_40px_-5px_rgba(0,242,254,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{loading ? "Sending..." : "Send Request"}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceModal({
  slug,
  onClose,
  onGetStarted,
}: {
  slug: string;
  onClose: () => void;
  onGetStarted: (label: string) => void;
}) {
  const detail = SERVICE_DETAILS[slug];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!detail) return null;
  const { label, description, Icon } = detail;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200 sm:p-8">
      <div onClick={onClose} className="absolute inset-0" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-title"
        className="relative my-auto w-full max-w-2xl origin-center animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--cyan)]/40 bg-[#0A0A0A]/95 shadow-[0_0_80px_-10px_rgba(0,242,254,0.4)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.3),transparent_70%)] blur-3xl" />

          <button
            onClick={onClose}
            aria-label="Close service details"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-4 pr-10">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#1A1A1A] shadow-[0_0_24px_-4px_rgba(0,242,254,0.6)] ring-1 ring-[color:var(--cyan)]/40">
                <Icon className="h-6 w-6 text-[color:var(--cyan)]" />
              </span>
              <h2 id="service-title" className="text-glow text-2xl font-bold tracking-tight sm:text-3xl">
                {label}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              {description}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => onGetStarted(label)}
                className="group relative inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[color:var(--cyan)]/20 hover:shadow-[0_0_40px_-5px_rgba(0,242,254,0.8)]"
              >
                <span>Get Started with this Service</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({ onClose, initialNotes, initialName, initialEmail, initialPhone }: { onClose: () => void; initialNotes?: string; initialName?: string; initialEmail?: string; initialPhone?: string }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [clientName, setClientName] = useState(initialName || "");
  const [clientEmail, setClientEmail] = useState(initialEmail || "");
  const [clientPhone, setClientPhone] = useState(initialPhone || "");
  const [notes, setNotes] = useState(initialNotes || "");
  const [existingBookings, setExistingBookings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = useMemo(() => {
    const dynamicSlots = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let count = 0;
    let dateOffset = 1; // start from tomorrow
    
    while (count < 3) {
      const d = new Date();
      d.setDate(d.getDate() + dateOffset);
      
      const dayOfWeek = d.getDay();
      // Skip Friday and Saturday
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        const dayName = daysOfWeek[dayOfWeek];
        const dateString = `${months[d.getMonth()]} ${d.getDate()}`;
        
        let times = [];
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4) { // Sun, Tue, Thu
          times = ["09:30 AM", "12:00 PM", "02:30 PM", "05:00 PM"];
        } else { // Mon, Wed
          times = ["10:00 AM", "01:00 PM", "03:30 PM", "06:00 PM"];
        }
        
        dynamicSlots.push({
          day: dayName,
          date: dateString,
          times
        });
        count++;
      }
      dateOffset++;
    }
    return dynamicSlots;
  }, []);

  useEffect(() => {
    // Load booked slots on mount
    getBookingsAction()
      .then((data) => {
        setExistingBookings(data.map((b) => b.bookedSlot));
      })
      .catch((err) => console.error("Error loading slots:", err));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !clientName || !clientEmail || !clientPhone) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await bookDiscoveryCallAction({
        data: {
          clientName,
          clientEmail,
          clientPhone,
          bookedSlot: selectedSlot,
          notes,
        },
      });
      if (res.success) {
        setBooked(true);
      } else {
        setError(res.error || "Failed to book slot.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-[color:var(--cyan)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,242,254,0.15)]";
  const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200 sm:p-8">
      <div onClick={onClose} className="absolute inset-0" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-title"
        className="relative my-auto w-full max-w-2xl origin-center animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--cyan)]/30 bg-[#0A0A0A]/95 shadow-[0_0_80px_-10px_rgba(0,242,254,0.35)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.25),transparent_70%)] blur-3xl" />

          <button
            onClick={onClose}
            aria-label="Close scheduling modal"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 sm:p-10">
            {booked ? (
              <div className="flex flex-col items-center py-14 text-center">
                <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 shadow-[0_0_40px_-5px_rgba(0,242,254,0.6)]">
                  <CheckCircle2 className="h-8 w-8 text-[color:var(--cyan)]" />
                </div>
                <h2 className="text-glow text-2xl font-bold tracking-tight sm:text-3xl">You're all set!</h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                  We look forward to meeting you. A calendar invite has been sent to your email.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-[color:var(--cyan)]/60 hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="mb-8 flex items-center gap-4 pr-10">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#1A1A1A] shadow-[0_0_20px_-4px_rgba(0,242,254,0.5)] ring-1 ring-[color:var(--cyan)]/30">
                    <Calendar className="h-5 w-5 text-[color:var(--cyan)]" />
                  </span>
                  <div>
                    <h2 id="schedule-title" className="text-glow text-2xl font-bold tracking-tight sm:text-3xl">
                      Book a 15-Minute Discovery Call
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pick a time that works for you — we'll confirm instantly.
                    </p>
                  </div>
                </div>

                {/* Input Details */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                  <div>
                    <label className={labelCls} htmlFor="clientName">Your Name</label>
                    <input
                      id="clientName"
                      required
                      className={inputCls}
                      placeholder="Jane Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="clientEmail">Email Address</label>
                    <input
                      id="clientEmail"
                      type="email"
                      required
                      className={inputCls}
                      placeholder="jane@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="clientPhone">Phone Number</label>
                    <input
                      id="clientPhone"
                      type="tel"
                      required
                      className={inputCls}
                      placeholder="+1 (555) 000-0000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Scoping / Meeting Notes Field */}
                <div className="mb-6">
                  <label className={labelCls} htmlFor="notes">Meeting / Project Notes (Pre-filled from Chat)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-[color:var(--cyan)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,242,254,0.15)] resize-none"
                    placeholder="Provide any additional details or context for the call..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-6">
                  {slots.map(({ day, date, times }) => (
                    <div key={date}>
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        <span className="h-px flex-1 bg-white/5" />
                        <span>{day}, {date}</span>
                        <span className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {times.map((time) => {
                          const id = `${date} ${time}`;
                          const isAlreadyBooked = existingBookings.includes(id);
                          const active = selectedSlot === id;
                          
                          if (isAlreadyBooked) {
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled
                                className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] text-white/20 cursor-not-allowed text-sm font-medium py-2.5"
                              >
                                <Clock className="h-3.5 w-3.5 opacity-30" />
                                {time} (Booked)
                              </button>
                            );
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedSlot(active ? null : id)}
                              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                  ? "border-[color:var(--cyan)]/60 bg-[color:var(--cyan)]/10 text-white shadow-[0_0_20px_-5px_rgba(0,242,254,0.5)]"
                                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <Clock className="h-3.5 w-3.5 opacity-70" />
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-6 text-red-500 text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={!selectedSlot || loading}
                    className="group relative inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[color:var(--cyan)]/20 hover:shadow-[0_0_40px_-5px_rgba(0,242,254,0.8)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? "Confirming..." : "Confirm Booking"}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

