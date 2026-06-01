import { Plane, ChevronLeft, ChevronRight } from "lucide-react";
import type { NavItem } from "@/lib/roles";
import { ROLE_META } from "@/lib/roles";
import type { Role } from "@/lib/auth";

interface Props {
  role: Role;
  items: NavItem[];
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const BADGES: Record<string, string> = {
  notifications: "3", threats: "2", faults: "5", incidents: "1", reports: "12", live: "•",
};

export function Sidebar({ role, items, active, onSelect, collapsed, onToggle }: Props) {
  const meta = ROLE_META[role];
  return (
    <aside className={`${collapsed ? "w-[72px]" : "w-64"} hidden md:flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300`}>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg grid place-items-center shrink-0 glow" style={{ background: "var(--gradient-primary)" }}>
          <Plane className="h-5 w-5 text-primary-foreground -rotate-45" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display font-bold text-sidebar-foreground leading-none">AeroNexus</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">AI Portal</div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full inline-block text-white bg-gradient-to-r ${meta.color}`}>
            {meta.label}
          </div>
          <div className="text-xs text-muted-foreground mt-2">{meta.tagline}</div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          const isLogout = it.id === "logout";
          const badge = BADGES[it.id];
          return (
            <button key={it.id} onClick={() => onSelect(it.id)}
              title={collapsed ? it.label : undefined}
              className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground border border-primary/30"
                  : isLogout
                    ? "text-rose-300 hover:bg-rose-500/10"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}>
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate flex-1 text-left">{it.label}</span>}
              {!collapsed && badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">{badge}</span>
              )}
              {isActive && !collapsed && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
            </button>
          );
        })}
      </nav>

      <button onClick={onToggle}
        className="m-2 flex items-center justify-center gap-2 rounded-lg py-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
      </button>
    </aside>
  );
}
