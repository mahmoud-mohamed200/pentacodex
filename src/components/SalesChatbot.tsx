import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, User, X, ArrowRight } from "lucide-react";
import { interactChatbotAction, getChatbotSummaryAction } from "../lib/actions";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: string[];
}

interface SalesChatbotProps {
  onClose: () => void;
  onRedirectToForm: (details: string) => void;
  onOpenSchedule: (notes?: string, prefilledName?: string, prefilledEmail?: string) => void;
}

export function SalesChatbot({ onClose, onRedirectToForm, onOpenSchedule }: SalesChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Welcome to Pentacodex! 👋\n\nI am the intelligent Virtual Assistant for our engineering team. How can I help you technically develop your business today?",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [chatStep, setChatStep] = useState<string>("chat");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender: "bot" | "user", text: string, options?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender, text, options },
    ]);
  };

  const submitMessageToBackend = async (userText: string, currentStep: string) => {
    setLoading(true);

    try {
      const formattedHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await interactChatbotAction({
        data: {
          message: userText,
          step: currentStep,
          history: formattedHistory
        }
      });

      setChatStep(response.nextStep);
      addMessage("bot", response.reply, response.options);
    } catch (err) {
      console.error(err);
      addMessage(
        "bot",
        "Sorry, I encountered a connection issue. Please try again or reach out to us directly using the contact form."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal.trim();
    setInputVal("");
    addMessage("user", userText);

    submitMessageToBackend(userText, chatStep);
  };

  // Build a summary from conversation history for the contact form
  const buildConversationSummary = () => {
    const userMessages = messages.filter(m => m.sender === "user").map(m => m.text);
    const botMessages = messages.filter(m => m.sender === "bot").map(m => m.text);
    
    let summary = "=== Pentacodex Chatbot — Conversation Summary ===\n\n";
    messages.forEach((msg) => {
      const label = msg.sender === "user" ? "Client" : "Pentacodex AI";
      summary += `${label}: ${msg.text}\n\n`;
    });
    return summary;
  };

  const extractClientInfo = () => {
    let name = "";
    let email = "";
    let phone = "";
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const nameRegex = /(?:my name is|i am|اسمى|اسمي|معاك)\s+([a-zA-Zأ-ي\s]{2,30})/i;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,14}\b/;
    
    for (const msg of messages) {
      if (msg.sender === "user") {
        if (!email) {
          const emailMatch = msg.text.match(emailRegex);
          if (emailMatch) {
            email = emailMatch[0];
          }
        }
        if (!name) {
          const nameMatch = msg.text.match(nameRegex);
          if (nameMatch && nameMatch[1]) {
            name = nameMatch[1].trim();
          }
        }
        if (!phone) {
          const phoneMatch = msg.text.match(phoneRegex);
          if (phoneMatch) {
            phone = phoneMatch[0].trim();
          }
        }
      }
    }

    if (typeof window !== "undefined" && (!name || !email)) {
      const saved = localStorage.getItem("clientUser");
      if (saved) {
        try {
          const user = JSON.parse(saved);
          if (!name && user.name) name = user.name;
          if (!email && user.email) email = user.email;
        } catch (e) {}
      }
    }

    return { name, email, phone };
  };

  const handleOpenBooking = async () => {
    setLoading(true);
    let summaryText = "";
    try {
      const formattedHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));
      const res = await getChatbotSummaryAction({ data: { history: formattedHistory } });
      summaryText = res.summary;
    } catch (err) {
      console.error("AI summary failed, falling back to chat log summary:", err);
      summaryText = buildConversationSummary();
    } finally {
      setLoading(false);
    }
    
    const { name, email, phone } = extractClientInfo();
    onOpenSchedule(summaryText, name, email, phone);
  };

  const handleRedirectToForm = async () => {
    setLoading(true);
    let summaryText = "";
    try {
      const formattedHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));
      const res = await getChatbotSummaryAction({ data: { history: formattedHistory } });
      summaryText = res.summary;
    } catch (err) {
      console.error("AI summary failed, falling back to chat log summary:", err);
      summaryText = buildConversationSummary();
    } finally {
      setLoading(false);
    }
    onRedirectToForm(summaryText);
  };

  const renderMessageContent = (text: string) => {
    // Look for pattern like [Book a Call](book-call)
    const regex = /\[([^\]]+)\]\(book-call\)/;
    const match = text.match(regex);
    
    if (match) {
      const parts = text.split(regex);
      const linkText = match[1];
      return (
        <div className="space-y-2">
          <span className="whitespace-pre-line">{parts[0]}</span>
          <button
            type="button"
            onClick={handleOpenBooking}
            className="flex items-center gap-2 rounded-xl bg-[color:var(--cyan)] hover:bg-[color:var(--cyan)]/85 px-4 py-2 text-xs font-bold text-black transition-all shadow-[0_0_15px_-3px_rgba(0,242,254,0.4)] mt-1.5 mb-1.5"
          >
            <span>📅 {linkText}</span>
          </button>
          {parts[2] && <span className="whitespace-pre-line">{parts[2]}</span>}
        </div>
      );
    }
    return <span className="whitespace-pre-line">{text}</span>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div onClick={onClose} className="absolute inset-0" aria-hidden />
      
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-[580px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[color:var(--cyan)]/30 bg-[#0A0A0A]/95 shadow-[0_0_80px_-10px_rgba(0,242,254,0.4)] backdrop-blur-xl animate-in zoom-in-95 duration-300"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1A1A1A] ring-1 ring-[color:var(--cyan)]/30 shadow-[0_0_15px_-4px_rgba(0,242,254,0.5)]">
              <Bot className="h-5 w-5 text-[color:var(--cyan)]" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Pentacodex Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  {loading ? "Typing..." : "Online"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Chat"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold ${
                msg.sender === "user" ? "bg-white/10 text-white" : "bg-[color:var(--cyan)]/10 text-[color:var(--cyan)] border border-[color:var(--cyan)]/25"
              }`}>
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-[75%]">
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/20 text-white"
                    : "bg-[#141414] text-white/90 border border-white/5"
                }`}>
                  {renderMessageContent(msg.text)}
                </div>

                {/* Option Pill Buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          addMessage("user", opt);
                          submitMessageToBackend(opt, chatStep);
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/80 transition-all hover:border-[color:var(--cyan)]/50 hover:bg-[color:var(--cyan)]/5 hover:text-white flex items-center gap-1.5"
                      >
                        {opt}
                        {opt === "Proceed to Contact Form" && <ArrowRight className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--cyan)]/10 text-[color:var(--cyan)] border border-[color:var(--cyan)]/25">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl px-4 py-3 bg-[#141414] text-white/40 border border-white/5 text-sm animate-pulse">
                Assistant is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Footer Input */}
        <div className="border-t border-white/5 bg-black/40 p-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRedirectToForm}
            className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            📋 Transfer to Contact Form
          </button>
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              required
              disabled={loading}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/40 outline-none focus:border-[color:var(--cyan)] focus:bg-white/[0.06] disabled:opacity-55"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="absolute right-2 grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--cyan)]/10 text-white border border-[color:var(--cyan)]/35 hover:bg-[color:var(--cyan)]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
