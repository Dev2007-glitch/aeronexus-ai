import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Plane, Sparkles, Mail, Lock, User as UserIcon, Shield, Wrench, Coffee, Briefcase, ScanLine } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth";
import { ROLE_META } from "@/lib/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AeroNexus AI Portal" },
      { name: "description", content: "Sign in to AeroNexus aviation operations portal." },
    ],
  }),
  component: LoginPage,
});

const ROLE_ICONS: Record<Role, typeof Plane> = {
  passenger: ScanLine, pilot: Plane, crew: Coffee,
  maintenance: Wrench, security: Shield, admin: Briefcase,
};

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState<Role>("passenger");
  const [remember, setRemember] = useState(true);

  if (user) return <Navigate to="/app" />;

 const submit = async (e: FormEvent) => {

  e.preventDefault();

  if (mode === "forgot") {
    toast.success("Reset link sent to " + email);
    setMode("login");
    return;
  }

  if (!email || !pw) {
    toast.error("Enter email and password");
    return;
  }

  try {

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const endpoint =
  mode === "signup"
    ? `${apiUrl}/api/auth/signup`
    : `${apiUrl}/api/auth/login`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password: pw,
    name,
    role,
  }),
});

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    login(
      data.user.email,
      data.user.role,
      data.user.name
    );

    toast.success(`Welcome aboard, ${data.user.name}`);

    navigate({ to: "/app" });

  } catch (error) {

    console.log(error);

    toast.error("Server connection failed");

  }

};

  const demo = (r: Role) => {
    login(`${r}@aeronexus.io`, r, ROLE_META[r].label + " Demo");
    toast.success(`Logged in as demo ${ROLE_META[r].label}`);
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-hero)" }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.7 0.18 235 / 0.5), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.72 0.16 195 / 0.4), transparent 50%)" }} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center glow" style={{ background: "var(--gradient-primary)" }}>
            <Plane className="h-6 w-6 text-primary-foreground -rotate-45" />
          </div>
          <div>
            <div className="font-display text-xl font-bold">AeroNexus</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase">AI Portal</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Next-gen aviation operations</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Command the skies.<br />
            <span className="gradient-text">Powered by AI.</span>
          </h1>
          <p className="text-muted-foreground max-w-md">
            One unified portal for passengers, pilots, crew, maintenance, security and operations.
            Real-time intelligence at every altitude.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {(["6", "120K", "99.98%"] as const).map((v, i) => (
              <div key={i} className="glass rounded-xl p-3 text-center">
                <div className="text-xl font-bold gradient-text">{v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {["Roles", "Flights/day", "Uptime"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">© AeroNexus Systems · ICAO-grade infrastructure</div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="glass-strong w-full max-w-md rounded-2xl p-8 animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Plane className="h-5 w-5 text-primary-foreground -rotate-45" />
            </div>
            <div className="font-display text-lg font-bold">AeroNexus</div>
          </div>

          <h2 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to your operations console." :
             mode === "signup" ? "Join the AeroNexus network." :
             "We'll email you a recovery link."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field icon={UserIcon} label="Full name" value={name} onChange={setName} placeholder="Alex Sterling" />
            )}
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@airline.com" />
            {mode !== "forgot" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="mt-1.5 relative">
                  <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="w-full rounded-lg bg-input/50 border border-border pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode !== "forgot" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Select your role</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(Object.keys(ROLE_META) as Role[]).map((r) => {
                    const Icon = ROLE_ICONS[r];
                    const active = role === r;
                    return (
                      <button key={r} type="button" onClick={() => setRole(r)}
                        className={`group rounded-lg border p-2.5 text-left transition-all ${
                          active ? "border-primary bg-primary/10 glow" : "border-border hover:border-primary/50 hover:bg-accent/5"
                        }`}>
                        <Icon className={`h-4 w-4 mb-1 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-[11px] font-medium">{ROLE_META[r].label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-border bg-input accent-primary" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button type="button" onClick={() => setMode("forgot")} className="text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit"
              className="w-full rounded-lg py-2.5 font-semibold text-primary-foreground transition-all hover:opacity-90 glow"
              style={{ background: "var(--gradient-primary)" }}>
              {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>New here? <button onClick={() => setMode("signup")} className="text-primary hover:underline">Create account</button></>
            ) : (
              <button onClick={() => setMode("login")} className="text-primary hover:underline">Back to sign in</button>
            )}
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Demo accounts</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ROLE_META) as Role[]).map((r) => (
              <button key={r} onClick={() => demo(r)}
                className="rounded-lg border border-border bg-card/40 px-2 py-1.5 text-[11px] hover:border-primary/50 hover:bg-accent/5 transition-all">
                {ROLE_META[r].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text", placeholder }: {
  icon: typeof Mail; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1.5 relative">
        <Icon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-lg bg-input/50 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
