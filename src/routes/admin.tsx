import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getInquiriesAction,
  getBookingsAction,
  updateInquiryStatusAction,
} from "../lib/actions";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Mail,
  Phone,
  ShieldAlert,
  User,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Lead Portal — pentacodex" },
      { name: "description", content: "Lead and inquiry administration console." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inquiries" | "bookings">("inquiries");

  // Simple passcode security
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Invalid admin access credentials.");
    }
  };

  useEffect(() => {
    if (!authorized) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [inqs, bks] = await Promise.all([
          getInquiriesAction(),
          getBookingsAction(),
        ]);
        // Sort inquiries and bookings by date (newest first)
        setInquiries(inqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setBookings(bks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authorized]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await updateInquiryStatusAction({ data: { id, status } });
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } catch (err) {
      console.error("Error changing status:", err);
    }
  };

  if (!authorized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background px-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.6),_transparent_60%)]" />
          <div className="absolute left-1/2 top-[20%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.15),_transparent_70%)] blur-3xl" />
        </div>

        <div className="w-full max-w-md rounded-3xl border border-[color:var(--cyan)]/30 bg-[#0A0A0A]/95 p-8 shadow-[0_0_50px_-10px_rgba(0,242,254,0.3)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1A1A1A] shadow-[0_0_20px_-4px_rgba(0,242,254,0.5)] ring-1 ring-[color:var(--cyan)]/30 mb-4">
              <ShieldAlert className="h-5 w-5 text-[color:var(--cyan)]" />
            </span>
            <h1 className="text-glow text-xl font-bold tracking-tight text-white">Pentacodex Portal Security</h1>
            <p className="mt-1 text-xs text-muted-foreground">Please enter client manager passcode to proceed.</p>
          </div>

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-center text-white outline-none focus:border-[color:var(--cyan)] focus:bg-white/[0.06]"
                placeholder="Passcode (use admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {authError && (
              <div className="text-red-500 text-center text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full group relative inline-flex items-center justify-center gap-2 rounded-xl border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[color:var(--cyan)]/20 hover:shadow-[0_0_30px_-5px_rgba(0,242,254,0.7)]"
            >
              <span>Verify Access</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,40,80,0.6),_transparent_60%)]" />
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.2),_transparent_70%)] blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-glow text-lg font-bold tracking-tight text-white">Pentacodex Administration</h1>
              <p className="text-xs text-muted-foreground">Manage lead inquiries and discovery bookings.</p>
            </div>
          </div>
          <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "inquiries" ? "bg-[color:var(--cyan)]/25 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "bookings" ? "bg-[color:var(--cyan)]/25 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Bookings ({bookings.length})
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--cyan)] border-t-transparent" />
            <span>Loading admin database records...</span>
          </div>
        ) : activeTab === "inquiries" ? (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center text-muted-foreground">
                No inquiries submitted yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="glass-card rounded-3xl border border-white/5 p-6 relative overflow-hidden transition-all hover:border-white/10"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    inq.status === "new"
                      ? "bg-blue-500"
                      : inq.status === "contacted"
                      ? "bg-yellow-500"
                      : inq.status === "proposal_sent"
                      ? "bg-purple-500"
                      : inq.status === "won"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`} />

                  <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between pl-2">
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {inq.firstName} {inq.lastName}
                        </h3>
                        {inq.company && (
                          <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-white/70">
                            {inq.company}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(inq.createdAt).toLocaleDateString()} at{" "}
                          {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Contact metadata */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-white/75">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-[color:var(--cyan)]" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4 text-[color:var(--cyan)]" />
                            <a href={`tel:${inq.phone}`} className="hover:underline">
                              {inq.phone}
                            </a>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-[color:var(--cyan)]" />
                          <span>Service: {inq.service}</span>
                        </span>
                      </div>

                      {/* Budget */}
                      {inq.budgetEstimate && (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/25 px-3 py-1.5 text-sm font-semibold text-white">
                          Estimated Budget: {inq.budgetEstimate}
                        </div>
                      )}

                      {/* Project Details */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Project Specification & Details
                        </div>
                        <p className="text-sm bg-black/40 border border-white/5 rounded-xl p-4 text-white/80 leading-relaxed whitespace-pre-line">
                          {inq.details}
                        </p>
                      </div>
                    </div>

                    {/* Status Controller */}
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pipeline Status
                      </label>
                      <div className="relative">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none appearance-none"
                        >
                          <option value="new" className="bg-[#0A0A0A]">🔵 New</option>
                          <option value="contacted" className="bg-[#0A0A0A]">🟡 Contacted</option>
                          <option value="proposal_sent" className="bg-[#0A0A0A]">🟣 Proposal Sent</option>
                          <option value="won" className="bg-[#0A0A0A]">🟢 Won</option>
                          <option value="lost" className="bg-[#0A0A0A]">🔴 Lost</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center text-muted-foreground">
                No discovery call bookings found.
              </div>
            ) : (
              bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#1A1A1A] shadow-[0_0_20px_-4px_rgba(0,242,254,0.4)] ring-1 ring-[color:var(--cyan)]/30">
                      <Clock className="h-5 w-5 text-[color:var(--cyan)]" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {bk.clientName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <a href={`mailto:${bk.clientEmail}`} className="hover:underline">
                            {bk.clientEmail}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90">
                      📅 {bk.bookedSlot}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Booked {new Date(bk.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
