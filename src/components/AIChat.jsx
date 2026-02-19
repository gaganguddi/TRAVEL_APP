import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { chatWithAI } from "../services/gemini";

export default function AIChat({ destination, country }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hi! I'm WanderAI 🌍 Ask me anything about **${destination}, ${country}** — the best places to visit, local food, hidden gems, travel tips, or anything else!`,
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
        try {
            const reply = await chatWithAI(newMessages, destination, country);
            setMessages([...newMessages, { role: "assistant", content: reply }]);
        } catch {
            setMessages([...newMessages, {
                role: "assistant",
                content: "Sorry, I had trouble connecting. Please try again!",
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const suggestions = [
        `Best time to visit ${destination}?`,
        "Local food I must try?",
        "Hidden gems and off-beat spots?",
        "Budget travel tips?",
    ];

    return (
        <div className="aichat">
            {/* Header */}
            <div className="aichat__header">
                <div className="aichat__avatar">
                    <Bot size={18} />
                </div>
                <div>
                    <p className="aichat__title">WanderAI Assistant</p>
                    <p className="aichat__subtitle">Powered by Gemini ✨</p>
                </div>
                <div className="aichat__status" />
            </div>

            {/* Messages */}
            <div className="aichat__messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`aichat__row ${msg.role === "user" ? "aichat__row--user" : ""}`}>
                        {msg.role === "assistant" && (
                            <div className="aichat__msg-avatar ai">
                                <Sparkles size={12} />
                            </div>
                        )}
                        <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                            {msg.content}
                        </div>
                        {msg.role === "user" && (
                            <div className="aichat__msg-avatar user">
                                <User size={12} />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="aichat__row">
                        <div className="aichat__msg-avatar ai"><Sparkles size={12} /></div>
                        <div className="chat-bubble-ai aichat__typing">
                            <Loader2 size={14} className="spin-icon" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
                <div className="aichat__suggestions">
                    {suggestions.map((s, i) => (
                        <button key={i} className="aichat__suggestion" onClick={() => { setInput(s); }}>
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="aichat__input-row">
                <textarea
                    className="aichat__input"
                    placeholder={`Ask about ${destination}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                />
                <button className="aichat__send btn btn-primary" onClick={send} disabled={!input.trim() || loading}>
                    {loading ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
                </button>
            </div>

            <style>{`
        .aichat {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 520px;
        }
        .aichat__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(99,102,241,0.05);
          flex-shrink: 0;
        }
        .aichat__avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .aichat__title { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
        .aichat__subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .aichat__status {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent-green);
          margin-left: auto;
          box-shadow: 0 0 8px var(--accent-green);
          flex-shrink: 0;
        }
        .aichat__messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
        }
        .aichat__row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .aichat__row--user { justify-content: flex-end; }
        .aichat__msg-avatar {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 0.7rem;
        }
        .aichat__msg-avatar.ai { background: var(--gradient-primary); color: white; }
        .aichat__msg-avatar.user { background: var(--bg-card); border: 1px solid var(--border-normal); color: var(--text-secondary); }
        .aichat__typing { display: flex; align-items: center; gap: 8px; color: var(--text-muted); }
        .spin-icon { animation: spin 1s linear infinite; }
        .aichat__suggestions {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }
        .aichat__suggestion {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-accent);
          background: rgba(99,102,241,0.08);
          color: var(--accent-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .aichat__suggestion:hover { background: rgba(99,102,241,0.2); }
        .aichat__input-row {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-subtle);
          flex-shrink: 0;
          align-items: flex-end;
        }
        .aichat__input {
          flex: 1;
          resize: none;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.88rem;
          outline: none;
          transition: var(--transition);
          overflow-y: hidden;
        }
        .aichat__input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .aichat__input::placeholder { color: var(--text-muted); }
        .aichat__send { padding: 12px 16px; border-radius: var(--radius-md); }
      `}</style>
        </div>
    );
}
