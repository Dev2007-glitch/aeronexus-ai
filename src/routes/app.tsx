import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, Search, Settings as SettingsIcon, LogOut, ChevronDown, Plane, Circle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SIDEBAR, ROLE_META, AI_PERSONA } from "@/lib/roles";
import { Sidebar } from "@/components/Sidebar";
import { AIAssistant } from "@/components/AIAssistant";
import { SectionRenderer } from "@/components/SectionRenderer";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Operations Console — AeroNexus" },
      { name: "description", content: "Role-based aviation operations dashboard." },
    ],
  }),
  component: AppShell,
});

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const role = user?.role ?? "passenger";
  const items = useMemo(() => SIDEBAR[role], [role]);

  if (!user) return <Navigate to="/login" />;

  const persona = AI_PERSONA[user.role];
  const meta = ROLE_META[user.role];

  const handleNav = (id: string) => {
    if (id === "logout") { logout(); toast.success("Signed out"); navigate({ to: "/login" }); return; }
    setSection(id);
  };

  const current = items.find((i) => i.id === section) ?? items[0];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-hero)" }}>
      <Sidebar
        role={user.role}
        items={items}
        active={section}
        onSelect={handleNav}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="glass-strong sticky top-0 z-30 border-b border-border/50">
          <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{meta.label}</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="font-medium truncate">{current.label}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-1.5 w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search flights, crew, aircraft…"
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">⌘K</kbd>
            </div>

            <div className="flex items-center gap-1.5 text-xs glass rounded-full px-3 py-1.5">
              <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">All systems operational</span>
            </div>

            <button className="relative h-9 w-9 rounded-full grid place-items-center hover:bg-accent/10">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
            </button>

            <button onClick={() => handleNav("settings")} className="h-9 w-9 rounded-full grid place-items-center hover:bg-accent/10">
              <SettingsIcon className="h-4 w-4" />
            </button>

            <div className="relative">
              <button onClick={() => setShowProfile((s) => !s)}
                className="flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1 hover:bg-accent/10">
                <Avatar name={user.name} />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium leading-tight">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground">{user.id}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 w-60 glass-strong rounded-xl p-2 animate-fade-up shadow-2xl">
                  <div className="px-3 py-2 border-b border-border/50">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    <div className={`mt-2 inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${meta.color}`}>
                      {meta.label}
                    </div>
                  </div>
                  <button onClick={() => { setShowProfile(false); handleNav("profile"); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent/10">View profile</button>
                  <button onClick={() => { setShowProfile(false); handleNav("settings"); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent/10">Settings</button>
                  <button onClick={() => handleNav("logout")}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-end justify-between flex-wrap gap-4 animate-fade-up">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{current.label}</h1>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full text-white bg-gradient-to-r ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{meta.tagline}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Plane className="h-3.5 w-3.5 -rotate-45 text-primary" />
                Live · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
            </div>

            <SectionRenderer key={`${user.role}-${section}`} role={user.role} section={section} onNavigate={handleNav} user={user} />
          </div>
        </main>
      </div>

      <AIAssistant persona={persona} role={user.role} roleColor={meta.color} />
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full grid place-items-center text-xs font-bold text-primary-foreground"
      style={{ background: "var(--gradient-primary)" }}>
      {initials}
    </div>
  );
}
