import { useEffect, useRef, useState } from "react";

import {
  Bot,
  X,
  Minus,
  Send,
  Sparkles,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import type { Role } from "@/lib/auth";

interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
}

interface Props {
  persona: {
    name: string;
    intro: string;
    suggestions: string[];
  };

  role: Role;

  roleColor: string;
}

export function AIAssistant({
  persona,
  roleColor,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const [minimized, setMinimized] =
    useState(false);

  const [maximized, setMaximized] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const [msgs, setMsgs] =
    useState<Msg[]>([
      {
        id: 1,
        role: "ai",
        text: persona.intro,
      },
    ]);

  const endRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [msgs, typing]);

  const detectLanguage = (
    text: string
  ) => {

    const lower =
      text.toLowerCase();

    // Hindi
    if (
      lower.includes("kaise ho") ||
      lower.includes("namaste") ||
      lower.includes("aap") ||
      lower.includes("mai")
    ) {
      return "hindi";
    }

    // Telugu
    if (
      lower.includes("miru") ||
      lower.includes("ela unnaru") ||
      lower.includes("bagunnara")
    ) {
      return "telugu";
    }

    // Spanish
    if (
      lower.includes("hola") ||
      lower.includes("gracias")
    ) {
      return "spanish";
    }

    return "english";
  };

  const send = async (
    customInput?: string
  ) => {

    const finalInput =
      customInput || input;

    if (!finalInput.trim())
      return;

    const languageMode =
      detectLanguage(
        finalInput
      );

    const userMsg: Msg = {
      id: Date.now(),
      role: "user",
      text: finalInput,
    };

    setMsgs((m) => [
      ...m,
      userMsg,
    ]);

    setInput("");

    setTyping(true);

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/ai/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message:
                finalInput,

              languageMode,
            }),
          }
        );

      const data =
        await response.json();

      setTyping(false);

      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: "ai",
        text:
          data.reply ||
          "No response from AI.",
      };

      setMsgs((m) => [
        ...m,
        aiMsg,
      ]);

    } catch (error) {

      console.log(error);

      setTyping(false);

      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "ai",
          text:
            "AI assistant failed to respond.",
        },
      ]);
    }
  };

  if (!open) {

    return (

      <button
        onClick={() =>
          setOpen(true)
        }
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-cyan-500 text-white grid place-items-center shadow-2xl"
      >

        <Bot className="h-6 w-6" />

      </button>
    );
  }

  return (

    <div
  className={`fixed z-50 rounded-2xl shadow-2xl bg-[#071224] flex flex-col overflow-hidden transition-all duration-300
  ${
    minimized
      ? "bottom-6 right-6 w-[320px] h-[80px]"
      : maximized
      ? "top-4 left-4 w-[95vw] h-[95vh]"
      : "bottom-6 right-6 w-[420px] h-[720px]"
  }`}
    >

      {/* HEADER */}

      <div
        className={`flex items-center gap-3 px-4 h-[80px] bg-gradient-to-r ${roleColor}`}
      >

        <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">

          <Bot className="text-white h-5 w-5" />

        </div>

        <div className="flex-1">

          <div className="text-white font-bold">
            {persona.name}
          </div>

          <div className="text-xs text-white/80">
            Online
          </div>

        </div>

        <button
  type="button"
  onClick={() => {

    setMaximized((prev) => !prev);

    setMinimized(false);

  }}
  className="text-white text-lg cursor-pointer hover:scale-110 transition"
>
  □
</button>

       <button
  type="button"
  onClick={() => {

    setMinimized((prev) => !prev);

    setMaximized(false);

  }}
  className="text-white cursor-pointer hover:scale-110 transition"
>

          <Minus className="h-4 w-4" />

        </button>

        <button
          onClick={() =>
            setOpen(false)
          }
          className="text-white"
        >

          <X className="h-4 w-4" />

        </button>

      </div>

      {!minimized && (
        <>

          {/* CHAT */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {msgs.map((m) => (

              <div
                key={m.id}
                className={`flex ${
                  m.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    m.role === "user"
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-white"
                  }`}
                >

                  <ReactMarkdown>
                    {m.text}
                  </ReactMarkdown>

                </div>

              </div>
            ))}

            {typing && (

              <div className="flex justify-start">

                <div className="bg-slate-800 rounded-2xl px-4 py-3 flex gap-1">

                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />

                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />

                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />

                </div>

              </div>
            )}

            <div ref={endRef} />

          </div>

         

          {/* INPUT */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
           className="p-4 flex gap-3 border-t border-white/10 bg-[#071224] sticky bottom-0"
          >

            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              placeholder="Ask anything..."
              className="flex-1 rounded-full bg-slate-900 border border-slate-700 px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
              type="submit"
              className="h-12 w-12 rounded-full bg-cyan-500 text-white grid place-items-center hover:scale-105 transition"
            >

              <Send className="h-5 w-5" />

            </button>

          </form>

           {/* SUGGESTIONS */}

          <div className="px-4 py-2 flex flex-wrap gap-2">

            {persona.suggestions.map(
              (s) => (

                <button
                  key={s}
                  onClick={() =>
                    send(s)
                  }
                  className="text-xs rounded-full bg-slate-800 px-3 py-2 text-white flex items-center gap-1 hover:bg-cyan-500/20 transition"
                >

                  <Sparkles className="h-3 w-3 text-cyan-400" />

                  {s}

                </button>
              )
            )}

          </div>

        </>
      )}
    </div>
  );
}