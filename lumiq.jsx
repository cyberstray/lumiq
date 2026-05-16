const WORKER_URL = "https://steep-poetry-adff.stavyaparatpsingh.workers.dev/";

const SYSTEM_PROMPT = `You are Lumiq, an elite AI personal tutor. You adapt to the student's level, break down complex topics, use real-world examples, and always end with a follow-up question to check understanding.`;

const SUBJECTS = [
  { label: "Math", emoji: "📐" },
  { label: "Science", emoji: "🔬" },
  { label: "Coding", emoji: "💻" },
  { label: "History", emoji: "🏛️" },
  { label: "Language", emoji: "🌐" },
  { label: "Art", emoji: "🎨" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function Lumiq() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hey! I'm Lumiq ✦ — your personal AI tutor.\n\nPick a subject or ask me anything!" }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [level, setLevel] = React.useState("Beginner");
  const [activeSubject, setActiveSubject] = React.useState(null);
  const [error, setError] = React.useState(null);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (overrideText) => {
    const text = overrideText || input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMessages = [
        { role: "user", content: `System: ${SYSTEM_PROMPT}\nLevel: ${level}${activeSubject ? `\nSubject: ${activeSubject}` : ""}` },
        { role: "assistant", content: "Understood! I'm Lumiq, ready to tutor." },
        ...updated.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const rawText = await res.text();
      const data = JSON.parse(rawText);

      if (data.error) {
        setError(`Error: ${JSON.stringify(data.error)}`);
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      const reply = data.choices?.[0]?.message?.content || "Try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    app: { minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", fontFamily: "Palatino, serif", color: "#f5f0e8" },
    header: { padding: "16px 20px 12px", borderBottom: "1px solid #ffffff0e", background: "#0d0d0dee" },
    logo: { fontSize: 22, fontWeight: "bold", letterSpacing: 3, color: "#f0c040", marginBottom: 4 },
    subtitle: { fontSize: 10, color: "#ffffff30", letterSpacing: 4 },
    levels: { display: "flex", gap: 6, margin: "12px 0 10px" },
    subjects: { display: "flex", gap: 6, flexWrap: "wrap" },
    messages: { flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 },
    inputRow: { padding: "12px 16px 20px", borderTop: "1px solid #ffffff0e", background: "#0d0d0dee", display: "flex", gap: 10, alignItems: "flex-end" },
    footer: { textAlign: "center", fontSize: 9, letterSpacing: 3, color: "#ffffff18", marginTop: 8 }
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #c8860a, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#0d0d0d", fontWeight: "bold" }}>✦</div>
          <div>
            <div style={styles.logo}>LUMIQ</div>
            <div style={styles.subtitle}>YOUR AI TUTOR</div>
          </div>
        </div>
        <div style={styles.levels}>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${level === l ? "#f0c040" : "#ffffff18"}`, background: level === l ? "#f0c04018" : "transparent", color: level === l ? "#f0c040" : "#ffffff40", fontSize: 10, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={styles.subjects}>
          {SUBJECTS.map(({ label, emoji }) => (
            <button key={label} onClick={() => { setActiveSubject(label); sendMessage(`I want to learn ${label}`); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${activeSubject === label ? "#f0c040" : "#ffffff15"}`, background: activeSubject === label ? "#f0c04015" : "#ffffff06", color: activeSubject === label ? "#f0c040" : "#ffffff50", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #c8860a, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0d0d0d", fontWeight: "bold", flexShrink: 0, marginTop: 2 }}>✦</div>
            )}
            <div style={{ maxWidth: "78%", padding: "11px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px", background: msg.role === "user" ? "linear-gradient(135deg, #b8860b, #8b6914)" : "#ffffff09", border: msg.role === "user" ? "1px solid #f0c04033" : "1px solid #ffffff0e", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #c8860a, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0d0d0d", fontWeight: "bold" }}>✦</div>
            <div style={{ padding: "11px 16px", borderRadius: "4px 18px 18px 18px", background: "#ffffff09", border: "1px solid #ffffff0e", display: "flex", gap: 5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f0c040", animation: `blink 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {error && <div style={{ padding: "10px 14px", background: "#ff444422", border: "1px solid #ff444444", borderRadius: 10, fontSize: 12, color: "#ff9999", fontFamily: "monospace", wordBreak: "break-all" }}>🔴 {error}</div>}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}} placeholder="Ask Lumiq anything..." rows={1} style={{ flex: 1, background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 20, padding: "10px 16px", color: "#f5f0e8", fontSize: 14, fontFamily: "Palatino, serif", resize: "none", outline: "none" }} />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() ? "#f0c04022" : "#ffffff0a", border: `1px solid ${input.trim() ? "#f0c04066" : "#ffffff15"}`, color: input.trim() ? "#f0c040" : "#ffffff30", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
      <div style={styles.footer}>LUMIQ · POWERED BY GROQ AI</div>
    </div>
  );
}
