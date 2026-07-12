import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import * as React from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "pentacodex" },
      { name: "description", content: "Your ideas, built into software. pentacodex crafts premium software solutions for ambitious teams." },
      { name: "author", content: "pentacodex" },
      { property: "og:title", content: "pentacodex" },
      { property: "og:description", content: "Your ideas, built into software. pentacodex crafts premium software solutions for ambitious teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isSubRouteAdmin = router.state.location.pathname.startsWith("/admin");

  const [client, setClient] = React.useState<{ name: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clientUser");
      if (saved) {
        try {
          setClient(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem("clientUser");
        }
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (user: { name: string; email: string }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("clientUser", JSON.stringify(user));
    }
    setClient(user);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--cyan)] border-t-transparent" />
      </div>
    );
  }

  // Bypass authentication only for admin panel
  if (!client && !isSubRouteAdmin) {
    return <ClientLoginGateway onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

function ClientLoginGateway({ onLogin }: { onLogin: (user: { name: string; email: string }) => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const handleGoogleSignInClick = () => {
    setShowPopup(true);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith("@gmail.com")) {
      setError("Only Gmail addresses (@gmail.com) are allowed to access this workspace.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPopup(false);
      onLogin({ name: name.trim(), email: trimmedEmail });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] px-6 text-white overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.6),_transparent_60%)]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.15),_transparent_70%)] blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-[color:var(--cyan)]/25 bg-[#0A0A0A]/90 p-8 text-center shadow-[0_0_50px_-10px_rgba(0,242,254,0.3)] backdrop-blur-xl relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)]/50 to-transparent" />
        
        {/* Brand Logo & Intro */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-auto mb-6">
            <svg viewBox="0 0 100 100" className="h-full w-auto">
              <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="none" stroke="url(#cyan-grad)" strokeWidth="3" />
              <path d="M50 25 L70 40 L70 60 L50 75 L30 60 L30 40 Z" fill="url(#cyan-grad)" opacity="0.15" />
              <path d="M50 35 L60 45 L60 55 L50 65 L40 55 L40 45 Z" fill="url(#cyan-grad)" opacity="0.4" />
              <defs>
                <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#4facfe" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h1 className="text-glow text-2xl font-bold tracking-tight">Pentacodex Workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Welcome! Please sign in using your Gmail account to explore products, chat with our AI, and book calls.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleGoogleSignInClick}
            className="w-full flex items-center justify-center gap-3.5 rounded-xl border border-white/10 bg-white px-5 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="mt-6 text-[10px] text-muted-foreground uppercase tracking-widest">
          Secured Gateway Connection
        </div>
      </div>

      {/* Simulated Google Sign-In Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white text-[#202124] shadow-2xl p-6 relative border border-gray-200">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Google Brand Header */}
            <div className="flex flex-col items-center text-center mt-2">
              <svg className="h-6 w-auto mb-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <h2 className="text-xl font-medium tracking-tight">Sign in with Google</h2>
              <p className="text-xs text-gray-500 mt-1">to continue to Pentacodex Workspace</p>
            </div>

            {/* Login inputs */}
            <form onSubmit={handleSignInSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-[#202124] placeholder-gray-400 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] disabled:opacity-50"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-[#202124] placeholder-gray-400 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] disabled:opacity-50"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-xs text-[#d93025] bg-[#fce8e6] rounded-md p-2 text-center font-medium">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="text-sm font-semibold text-[#1a73e8] hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-sm font-semibold bg-[#1a73e8] text-white hover:bg-[#1557b0] px-5 py-2.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
