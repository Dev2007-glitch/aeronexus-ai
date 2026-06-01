import { useEffect, useRef, useState } from "react";
import { Bot, X, Minus, Send, Sparkles } from "lucide-react";
import type { Role } from "@/lib/auth";
import ReactMarkdown from "react-markdown";

interface Msg { id: number; role: "user" | "ai"; text: string; }

interface Props {
  persona: { name: string; intro: string; suggestions: string[] };
  role: Role;
  roleColor: string;
}


export function AIAssistant({ persona, role, roleColor }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 1, role: "ai", text: persona.intro }]);
  const [input, setInput] = useState("");
  const [languageMode, setLanguageMode] = useState("auto");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ id: 1, role: "ai", text: persona.intro }]);
  }, [persona.intro]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const detectLanguage = (text: string) => {

  const lower = text.toLowerCase();

  if (
    lower.includes("namaste") ||
    lower.includes("kaise") ||
    lower.includes("mai") ||
    lower.includes("mera")
  ) {
    return "hindi";
  }

  if (
    lower.includes("hola") ||
    lower.includes("gracias")
  ) {
    return "spanish";
  }

  if (
    lower.includes("miru") ||
    lower.includes("ela") ||
    lower.includes("unnaru")
  ) {
    return "telugu";
  }

  return "english";
};

const send = async (text: string) => {

  if (!text.trim()) return;

  const userMsg: Msg = {
    id: Date.now(),
    role: "user",
    text,
  };

  setMsgs((m) => [...m, userMsg]);

  setInput("");

  setTyping(true);

   const lower = text.toLowerCase();
   const detectedLanguage = detectLanguage(text);

 

  try {

    const response = await fetch(
      "http://localhost:5000/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  message: text,
  languageMode: detectedLanguage,
}),
      }
    );

    const data = await response.json();

    setTyping(false);

    setMsgs((m) => [
      ...m,
      {
        id: Date.now(),
        role: "ai",
        text: data.reply,
      },
    ]);

  } catch (error) {

    console.log(error);

    setTyping(false);

    setMsgs((m) => [
      ...m,
      {
        id: Date.now(),
        role: "ai",
        text: "AI assistant failed to respond.",
      },
    ]);

  }

};

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full grid place-items-center text-primary-foreground animate-pulse-glow"
        style={{ background: "var(--gradient-primary)" }}
        aria-label="Open AI assistant">
        <Bot className="h-6 w-6" />
      </button>
    );
  }

return (
  <div
    className={`fixed z-50 glass-strong rounded-2xl shadow-2xl transition-all duration-300 flex flex-col animate-slide-in overflow-hidden ${
      maximized
        ? "top-4 left-4 w-[95vw] h-[95vh]"
        : minimized
        ? "bottom-6 right-6 w-72 h-14"
        : "bottom-6 right-6 w-[420px] h-[650px] max-h-[85vh]"
    }`}
  >

    {/* HEADER */}
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-gradient-to-r ${roleColor}`}
    >

      <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center backdrop-blur">
        <Bot className="h-5 w-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-white truncate">
          {persona.name}
        </div>

        <div className="text-xs text-white/80 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
          Online
        </div>
      </div>

      {/* MAXIMIZE */}
      <button
        onClick={() => setMaximized((m) => !m)}
        className="h-8 w-8 rounded-full grid place-items-center hover:bg-white/20 text-white transition"
      >
        {maximized ? "🗗" : "🗖"}
      </button>

      {/* MINIMIZE */}
      <button
        onClick={() => setMinimized((m) => !m)}
        className="h-8 w-8 rounded-full grid place-items-center hover:bg-white/20 text-white transition"
      >
        <Minus className="h-4 w-4" />
      </button>

      {/* CLOSE */}
      <button
        onClick={() => setOpen(false)}
        className="h-8 w-8 rounded-full grid place-items-center hover:bg-white/20 text-white transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    {!minimized && (
      <>
        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4 bg-[#071224]">

          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user"
                  ? "justify-end"
                  : "justify-start"
              } animate-fade-up`}
            >

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-lg ${
                  m.role === "user"
                    ? "bg-cyan-500 text-white rounded-br-sm"
                    : "bg-slate-800 text-slate-100 rounded-bl-sm"
                }`}
              >

                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {m.text}
                  </ReactMarkdown>
                </div>

              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl px-4 py-3 flex gap-1">
                <span
                  className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* SUGGESTIONS */}
        {msgs.length <= 2 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#071224]">

            {persona.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs rounded-full bg-slate-800 px-3 py-1.5 hover:bg-cyan-500/20 flex items-center gap-1 transition"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                {s}
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-4 border-t border-border/30 flex gap-3 bg-[#071224]"
        >

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 rounded-full bg-slate-900 border border-slate-700 px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="h-12 w-12 rounded-full grid place-items-center text-white bg-cyan-500 hover:scale-105 transition"
          >
            <Send className="h-5 w-5" />
          </button>

        </form>
      </>
    )}
  </div>
);
}
