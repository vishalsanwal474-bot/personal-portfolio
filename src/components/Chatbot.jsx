import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  Trash2,
  X,
  Bot,
  User,
} from "lucide-react";
import { useContent } from "../context/ContentContext";

const SUGGESTIONS = [
  "What does Vishal do?",
  "View his projects",
  "What are his skills?",
  "What services does he offer?",
  "How can I contact him?",
];

const WELCOME =
  "Hi! I'm Vishal's portfolio assistant. Ask me about his projects, skills, experience, or services.";

function ActionButtons({ actions }) {
  if (!actions?.length) return null;

  const handleAction = (action) => {
    if (action.type === "scroll" && action.target) {
      document.getElementById(action.target)?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }
    if (action.href) {
      window.open(action.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="chatbot__actions">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => handleAction(action)}
          disabled={action.disabled}
          title={action.disabled ? "Link not set yet" : undefined}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default function Chatbot() {
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const endRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const clearChat = () => {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setError("");
  };

  const sendMessage = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;

    setError("");
    setInput("");
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch(site.chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response right now.",
          actions: data.actions || [],
        },
      ]);
    } catch (err) {
      const msg =
        err?.message ||
        "The assistant is unavailable right now. Please use the Contact section.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't reach the assistant service. You can still browse the portfolio or use the Contact section to reach Vishal.",
          actions: [
            { label: "Contact Vishal", type: "scroll", target: "contact" },
            { label: "View Projects", type: "scroll", target: "projects" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot">
      {open && (
        <div
          className="chatbot__panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Vishal's AI Assistant"
        >
          <header className="chatbot__header">
            <div className="chatbot__header-title">
              <Bot size={18} aria-hidden="true" />
              <span>Vishal&apos;s AI Assistant</span>
            </div>
            <div className="chatbot__header-actions">
              <button
                type="button"
                className="chatbot__icon-btn"
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="chatbot__icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="chatbot__messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot__bubble chatbot__bubble--${message.role}`}
              >
                <span className="chatbot__role" aria-hidden="true">
                  {message.role === "assistant" ? (
                    <Bot size={14} />
                  ) : (
                    <User size={14} />
                  )}
                </span>
                <div>
                  <p>{message.content}</p>
                  <ActionButtons actions={message.actions} />
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="chatbot__suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chatbot__bubble chatbot__bubble--assistant">
                <span className="chatbot__role" aria-hidden="true">
                  <Bot size={14} />
                </span>
                <div className="chatbot__typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <p className="chatbot__error" role="alert">
              {error}
            </p>
          )}

          <form
            className="chatbot__composer"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="chat-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question…"
              maxLength={1000}
            />
            <button
              type="submit"
              className="chatbot__send"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={`chatbot__fab ${open ? "chatbot__fab--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
