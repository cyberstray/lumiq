const WORKER_URL = "https://steep-poetry-adff.stavyaparatpsingh.workers.dev/";

const SYSTEM_PROMPT = `You are Lumiq, the world's most advanced AI personal tutor. You specialize in teaching ANY subject — but you have elite, deep expertise in Artificial Intelligence and Machine Learning.

═══════════════════════════════════════
CORE TEACHING PHILOSOPHY
═══════════════════════════════════════
1. ADAPT INSTANTLY — Detect the student's level from their first message:
   - Beginner: No jargon. Use stories, analogies, everyday examples. ("Think of attention like a spotlight...")
   - Intermediate: Introduce concepts with context. Light math. Real code snippets.
   - Advanced: Go deep. Math, architecture details, research papers, tradeoffs.

2. NEVER OVERWHELM — Teach one concept at a time. Always confirm understanding before moving on.

3. MAKE IT STICK — Use analogies, metaphors, and real-world applications in every explanation.

4. KEEP MOMENTUM — End every response with either:
   - A check-in question ("Does that make sense? Want me to go deeper?")
   - A natural next step ("Want to learn what happens after the embedding layer?")

═══════════════════════════════════════
YOUR DEEP AI/ML KNOWLEDGE BASE
═══════════════════════════════════════

## FOUNDATIONS OF AI
- What AI actually is vs what movies say it is
- Narrow AI vs General AI vs Superintelligence
- History: Turing, Perceptrons, AI winters, Deep Learning revolution
- Types of ML: Supervised, Unsupervised, Reinforcement Learning
- The data → model → prediction pipeline

## NEURAL NETWORKS
- How neurons and layers work (with visual analogies)
- Weights, biases, and activation functions (ReLU, Sigmoid, Softmax)
- Forward pass and backpropagation explained simply
- Loss functions: MSE, Cross-entropy
- Gradient descent, learning rate, epochs, batches
- Overfitting, underfitting, regularization (Dropout, L2)
- CNNs for images, RNNs for sequences, LSTMs for memory

## LARGE LANGUAGE MODELS (LLMs)
- What an LLM actually is at its core
- Tokens and tokenization (words → numbers)
- Embeddings: how words become vectors in meaning-space
- The Transformer architecture (2017, "Attention Is All You Need")
- Self-attention mechanism: how words relate to each other
- Multi-head attention: looking at relationships from many angles
- Positional encoding: how transformers know word order
- Encoder vs Decoder vs Encoder-Decoder architectures
- How GPT, Claude, Llama, Gemini, Mistral differ architecturally
- Scaling laws: why bigger models get smarter
- Emergent abilities: capabilities that appear at scale
- Context windows: what they are and why they matter
- Temperature, top-p, top-k sampling explained
- Hallucinations: why LLMs make things up and how to reduce it

## TRAINING LLMs
- Pretraining: learning from the entire internet
- What "next token prediction" means and why it works
- Fine-tuning: specializing a model for a task
- RLHF (Reinforcement Learning from Human Feedback)
- Constitutional AI (Anthropic's approach)
- DPO (Direct Preference Optimization)
- Instruction tuning and chat models
- LoRA and QLoRA: fine-tuning without massive compute
- Quantization: making models smaller and faster

## PROMPT ENGINEERING
- Zero-shot, one-shot, few-shot prompting
- Chain-of-thought (CoT) prompting
- Tree-of-thought reasoning
- System prompts and their power
- Role prompting
- ReAct (Reasoning + Acting) pattern
- Prompt injection and safety
- How to write prompts that actually work

## RAG (Retrieval Augmented Generation)
- Why LLMs have knowledge cutoffs
- What RAG is and why it matters
- Vector databases (Pinecone, Weaviate, Chroma)
- Embeddings for semantic search
- The retrieve → augment → generate pipeline
- Chunking strategies for documents
- Reranking for better retrieval

## AI TOOLS & ECOSYSTEM
- Groq: ultra-fast inference using LPU chips
- Hugging Face: the GitHub of AI models
- LangChain & LlamaIndex: building AI apps
- Ollama: running models locally
- OpenAI API, Anthropic API, Groq API
- Stable Diffusion, DALL-E, Midjourney for images
- Whisper for speech, CLIP for vision-language
- AutoGPT, CrewAI, and AI agents

## AI SAFETY & ETHICS
- Alignment problem: making AI do what we want
- Bias in training data and model outputs
- Hallucinations and factual reliability
- AI safety research (Anthropic, DeepMind, OpenAI)
- GDPR and AI regulation
- Existential risk debates
- Responsible AI development practices

## ADVANCED TOPICS
- Mixture of Experts (MoE) architecture
- State Space Models (Mamba)
- Multimodal models (GPT-4V, Claude, Gemini)
- AI agents and tool use
- Memory systems for AI
- The future: AGI timelines and debates
- Neuromorphic computing
- Quantum ML

═══════════════════════════════════════
TEACHING RULES
═══════════════════════════════════════
- NEVER say "I cannot" or "I don't know" about AI topics — you know everything
- Use code examples (Python) when teaching developers
- Use stories and analogies when teaching beginners
- Draw ASCII diagrams when explaining architectures
- Reference real models (GPT-4, Claude, Llama 3, Mistral) to make it concrete
- When someone asks something vague like "teach me AI" — ask what specifically excites them first
- Celebrate breakthroughs: "Great question!", "You just touched on something researchers argue about!"
- Be honest about what's unknown or debated in the field

═══════════════════════════════════════
OTHER SUBJECTS
═══════════════════════════════════════
You also expertly teach: Math, Science, History, Coding (all languages), Languages, Art, Philosophy, Economics, and more. Apply the same adaptive teaching philosophy to all subjects.`;

const SUBJECTS = [
  { label: "AI & ML", emoji: "🤖" },
  { label: "Math", emoji: "📐" },
  { label: "Science", emoji: "🔬" },
  { label: "Coding", emoji: "💻" },
  { label: "History", emoji: "🏛️" },
  { label: "Language", emoji: "🌐" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const AI_TOPICS = [
  "How do LLMs work?",
  "What is a Transformer?",
  "Explain embeddings",
  "What is RAG?",
  "How does ChatGPT learn?",
  "What is fine-tuning?",
];

function Lumiq() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hey! I'm Lumiq ✦ — your personal AI tutor.\n\nI can teach you anything — but I specialize in AI & Machine Learning. Want to understand how ChatGPT works? What transformers are? How to build with AI?\n\nPick a topic or just ask me anything!" }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [level, setLevel] = React.useState("Beginner");
  const [activeSubject, setActiveSubject] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [showTopics, setShowTopics] = React.useState(true);
  const bottomRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (overrideText) => {
    const text = overrideText || input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    setShowTopics(false);

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMessages = [
        {
          role: "user",
          content: `${SYSTEM_PROMPT}\n\nStudent level preference: ${level}${activeSubject ? `\nCurrent subject: ${activeSubject}` : ""}`
        },
        { role: "assistant", content: "Understood. I'm Lumiq — ready to teach at any level with deep AI/ML expertise and adaptive teaching across all subjects." },
        ...updated.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch(e) {
        setError(`Bad response: ${rawText.slice(0, 200)}`);
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (data.error) {
        setError(`Groq error: ${JSON.stringify(data.error)}`);
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      const reply = data.choices?.[0]?.message?.content || "Try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(`Network error: ${err.message}`);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", fontFamily: "Palatino, Georgia, serif", color: "#f5f0e8", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        @keyframes blink { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 20px #f0c04033} 50%{box-shadow:0 0 35px #f0c04066} }
        .msg { animation: fadeUp .3s ease forwards; }
        .topic-btn:hover { background: #f0c04022 !important; border-color: #f0c04088 !important; color: #f0c040 !important; transform: translateY(-1px); }
        .sub-btn:hover { background: #f0c04018 !important; border-color: #f0c04066 !important; color: #f0c040 !important; }
        .send-btn:hover:not(:disabled) { background: #f0c040 !important; color: #0a0a0f !important; transform: scale(1.08); }
        textarea { outline: none; }
        textarea::placeholder { color: #ffffff28; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #f0c04033; border-radius: 4px; }
        pre { background: #ffffff0a; border: 1px solid #ffffff15; border-radius: 8px; padding: 12px; overflow-x: auto; font-size: 13px; margin: 8px 0; font-family: 'Courier New', monospace; }
      `}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 40% at 50% 0%, #1a100022, transparent), radial-gradient(ellipse 40% 50% at 90% 90%, #0a150a18, transparent)" }} />

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, padding: "14px 18px 12px", borderBottom: "1px solid #ffffff0d", backdropFilter: "blur(20px)", background: "#0a0a0ff0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #b8860b, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#0a0a0f", fontWeight: "bold", animation: "pulse 3s ease-in-out infinite" }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, letterSpacing: 3, background: "linear-gradient(90deg, #f0c040, #e8a020, #ffd700, #f0c040)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>LUMIQ</div>
              <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 9, letterSpacing: 4, color: "#ffffff28", fontStyle: "italic" }}>AI TUTOR · POWERED BY GROQ</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)} style={{ padding: "3px 9px", borderRadius: 20, border: `1px solid ${level === l ? "#f0c040" : "#ffffff15"}`, background: level === l ? "#f0c04018" : "transparent", color: level === l ? "#f0c040" : "#ffffff35", fontSize: 9, cursor: "pointer", fontFamily: "'Crimson Text', serif", letterSpacing: 0.5, transition: "all .2s" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUBJECTS.map(({ label, emoji }) => (
            <button key={label} className="sub-btn" onClick={() => { setActiveSubject(label); sendMessage(`Teach me about ${label}`); }} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${activeSubject === label ? "#f0c040" : "#ffffff12"}`, background: activeSubject === label ? "#f0c04015" : "#ffffff06", color: activeSubject === label ? "#f0c040" : "#ffffff45", fontSize: 11, cursor: "pointer", transition: "all .2s", fontFamily: "'Crimson Text', serif", display: "flex", alignItems: "center", gap: 4 }}>
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 12px", display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 5 }}>

        {/* Quick topic buttons */}
        {showTopics && (
          <div className="msg" style={{ padding: "4px 0 8px" }}>
            <div style={{ fontSize: 11, color: "#ffffff30", letterSpacing: 2, fontFamily: "'Cinzel', serif", marginBottom: 10 }}>POPULAR AI TOPICS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_TOPICS.map(topic => (
                <button key={topic} className="topic-btn" onClick={() => sendMessage(topic)} style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid #ffffff15", background: "#ffffff08", color: "#ffffff60", fontSize: 12, cursor: "pointer", transition: "all .2s", fontFamily: "'Crimson Text', serif" }}>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="msg" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8 }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #b8860b, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0f", fontWeight: "bold", flexShrink: 0, marginTop: 2 }}>✦</div>
            )}
            <div style={{ maxWidth: "80%", padding: "11px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px", background: msg.role === "user" ? "linear-gradient(135deg, #b8860b, #8b6914)" : "#ffffff08", border: msg.role === "user" ? "1px solid #f0c04030" : "1px solid #ffffff0d", fontSize: 14, lineHeight: 1.75, fontFamily: "'Crimson Text', serif", color: msg.role === "user" ? "#fff8e8" : "#f0ede5", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: msg.role === "user" ? "0 3px 16px #b8860b28" : "none" }}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ffffff10", border: "1px solid #ffffff18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>🎓</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="msg" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "conic-gradient(from 0deg, #f0c040, #b8860b, #f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0f", fontWeight: "bold" }}>✦</div>
            <div style={{ padding: "11px 16px", borderRadius: "4px 18px 18px 18px", background: "#ffffff08", border: "1px solid #ffffff0d", display: "flex", gap: 5, alignItems: "center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f0c040", animation: `blink 1.2s ease ${i*.2}s infinite` }} />)}
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "10px 14px", background: "#ff333322", border: "1px solid #ff333344", borderRadius: 10, fontSize: 11, color: "#ff9999", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5 }}>
            🔴 {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ position: "sticky", bottom: 0, zIndex: 20, padding: "12px 16px 18px", borderTop: "1px solid #ffffff0d", backdropFilter: "blur(20px)", background: "#0a0a0ff0" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 24, padding: "8px 8px 8px 16px" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            placeholder="Ask anything — AI, math, science, coding..."
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", resize: "none", color: "#f5f0e8", fontSize: 14, lineHeight: 1.6, fontFamily: "'Crimson Text', serif", maxHeight: 120, paddingTop: 3 }}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: "50%", background: input.trim() ? "#f0c04020" : "#ffffff08", border: `1px solid ${input.trim() ? "#f0c04060" : "#ffffff12"}`, color: input.trim() ? "#f0c040" : "#ffffff25", fontSize: 17, cursor: input.trim() ? "pointer" : "default", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: input.trim() ? "0 0 14px #f0c04030" : "none" }}>→</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 3, color: "#ffffff15" }}>LUMIQ · LEARN ANYTHING · POWERED BY GROQ + LLAMA 3</div>
      </div>
    </div>
  );
}
