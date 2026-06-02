import type { Role, AuthUser } from "@/lib/auth";
import { ROLE_META } from "@/lib/roles";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import {
  Plane, Clock, MapPin, Cloud, Fuel, Users, AlertTriangle, CheckCircle2, Activity,
  TrendingUp, Wrench, Shield, Camera, Bot, Coffee, Bell, Sparkles, ScanLine,
  FileText, Globe, Phone, Mail, ArrowUpRight, Gauge, Radio, Lock, Eye,
} from "lucide-react";
import type { ReactNode } from "react";

interface Props { role: Role; section: string; onNavigate: (id: string) => void; user: AuthUser; }

export function SectionRenderer({ role, section, user }: Props) {
  // Universal sections
  if (section === "profile") return <ProfileSection user={user} />;
  if (section === "settings") return <SettingsSection />;
  if (section === "notifications") return <NotificationsSection />;
  if (section === "support") return <SupportSection />;
  if (section === "ai") return <AISection role={role} />;

  // Role + dashboard
  const key = `${role}.${section}`;
  const renderer = SECTIONS[key] || SECTIONS[`${role}.dashboard`];
  return <div className="animate-fade-up">{renderer()}</div>;
}

// ---------- Reusable primitives ----------
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>
);

const Stat = ({ label, value, delta, icon: Icon, color = "text-primary" }: {
  label: string; value: string; delta?: string; icon: typeof Plane; color?: string;
}) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-2">{value}</div>
        {delta && <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {delta}</div>}
      </div>
      <div className={`h-10 w-10 rounded-xl grid place-items-center bg-secondary ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);

const SectionTitle = ({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      <h3 className="font-display font-semibold">{title}</h3>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
    {action}
  </div>
);

const Empty = ({ icon: Icon, title, sub }: { icon: typeof Plane; title: string; sub: string }) => (
  <Card className="flex flex-col items-center justify-center text-center py-12">
    <div className="h-14 w-14 rounded-2xl grid place-items-center mb-3" style={{ background: "var(--gradient-primary)" }}>
      <Icon className="h-7 w-7 text-primary-foreground" />
    </div>
    <h3 className="font-display font-semibold text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-sm">{sub}</p>
  </Card>
);

// ---------- Mock data ----------
const trafficData = Array.from({ length: 12 }, (_, i) => ({
  name: ["00","02","04","06","08","10","12","14","16","18","20","22"][i],
  flights: 80 + Math.round(Math.sin(i / 2) * 40 + Math.random() * 30),
  delays: Math.round(5 + Math.random() * 15),
}));
const revenueData = Array.from({ length: 7 }, (_, i) => ({
  d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  v: 800 + Math.round(Math.random() * 600),
}));

// ---------- Section catalog ----------
type Render = () => ReactNode;
const SECTIONS: Record<string, Render> = {

  // ====================== PASSENGER ======================
  "passenger.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Next flight" value="2h 14m" icon={Plane} color="text-primary" />
        <Stat label="Status" value="On time" delta="Gate B24" icon={CheckCircle2} color="text-emerald-400" />
        <Stat label="Miles YTD" value="48,210" delta="+12% vs Q2" icon={TrendingUp} color="text-accent" />
        <Stat label="Tier" value="Platinum" icon={Sparkles} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-primary)" }} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-white/80">Boarding Pass</div>
              <div className="text-xs">AN-204 · 18A</div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-4xl font-bold font-display">JFK</div>
                <div className="text-xs text-white/80">New York · 14:35</div>
              </div>
              <Plane className="h-8 w-8 -rotate-45 animate-float" />
              <div className="text-right">
                <div className="text-4xl font-bold font-display">LHR</div>
                <div className="text-xs text-white/80">London · 02:50+1</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6 text-xs">
              {[["Gate","B24"],["Seat","18A"],["Group","2"],["Class","Business"]].map(([k,v]) => (
                <div key={k}><div className="text-white/70 text-[10px] uppercase">{k}</div><div className="font-semibold">{v}</div></div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Weather at LHR" sub="In 8h 12m" />
          <div className="flex items-center gap-3">
            <Cloud className="h-10 w-10 text-info" />
            <div>
              <div className="text-3xl font-bold">14°</div>
              <div className="text-xs text-muted-foreground">Cloudy · 12 km/h NE</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            {["09","12","15","18"].map((h, i) => (
              <div key={h} className="rounded-lg bg-secondary py-2">
                <div className="text-[10px] text-muted-foreground">{h}:00</div>
                <div className="text-sm font-semibold mt-1">{12 + i}°</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle title="Flight timeline" sub="Real-time status" />
          <ol className="relative border-l border-border/60 pl-5 space-y-4">
            {[
              { t: "12:00", l: "Check-in opens", done: true },
              { t: "13:55", l: "Boarding begins · Gate B24", done: true },
              { t: "14:25", l: "Boarding closes", done: false, now: true },
              { t: "14:50", l: "Departure", done: false },
              { t: "02:50+1", l: "Arrival LHR", done: false },
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`absolute -left-[7px] h-3 w-3 rounded-full ${s.done ? "bg-emerald-400" : s.now ? "bg-primary animate-pulse" : "bg-muted"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.l}</div>
                  <div className="text-xs text-muted-foreground">{s.t}</div>
                </div>
                {s.now && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">Now</span>}
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <SectionTitle title="Baggage tracking" />
          <div className="space-y-3">
            {[
              { tag: "AN204-001", s: "Loaded on aircraft", pct: 75 },
              { tag: "AN204-002", s: "Security cleared", pct: 50 },
            ].map((b) => (
              <div key={b.tag} className="rounded-xl bg-secondary p-3">
                <div className="flex justify-between text-xs">
                  <span className="font-mono">{b.tag}</span>
                  <span className="text-muted-foreground">{b.s}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: "var(--gradient-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Smart automation" sub="AI handles it so you don't have to" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { t: "Auto re-book on delay", on: true, i: Plane },
            { t: "Multilingual boarding pass", on: true, i: Globe },
            { t: "Lounge access alerts", on: false, i: Bell },
          ].map((x) => (
            <div key={x.t} className="rounded-xl bg-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><x.i className="h-4 w-4 text-primary" /><span className="text-sm">{x.t}</span></div>
              <div className={`h-5 w-9 rounded-full ${x.on ? "bg-primary" : "bg-muted"} relative`}>
                <span className={`absolute top-0.5 ${x.on ? "right-0.5" : "left-0.5"} h-4 w-4 rounded-full bg-white transition-all`} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),

  "passenger.flights": () => (
    <Card>
      <SectionTitle title="Available flights" sub="JFK → LHR · Next 7 days" />
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground border-b border-border/50">
          <tr><th className="text-left py-2">Flight</th><th className="text-left">Depart</th><th className="text-left">Arrive</th><th className="text-left">Duration</th><th className="text-right">Price</th></tr>
        </thead>
        <tbody>
          {[
            ["AN-204","14:50","02:50","7h 00m","$1,240"],
            ["AN-206","18:30","06:35","7h 05m","$1,180"],
            ["AN-208","22:15","10:25","7h 10m","$980"],
          ].map((r) => (
            <tr key={r[0]} className="border-b border-border/30 hover:bg-accent/5">
              <td className="py-3 font-mono">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td>
              <td className="text-right font-semibold">{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  ),

  "passenger.bookings": () => (
    <div className="grid md:grid-cols-2 gap-4">
      {[
        { c: "AN-204", r: "JFK → LHR", d: "Aug 12", st: "Confirmed" },
        { c: "AN-330", r: "LHR → CDG", d: "Aug 15", st: "Confirmed" },
        { c: "AN-512", r: "CDG → JFK", d: "Aug 22", st: "Pending" },
      ].map((b) => (
        <Card key={b.c}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-xs text-muted-foreground">{b.c}</div>
              <div className="text-lg font-bold mt-1">{b.r}</div>
              <div className="text-xs text-muted-foreground mt-1">{b.d}</div>
            </div>
            <span className={`text-[10px] uppercase px-2 py-1 rounded-full ${b.st === "Confirmed" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>{b.st}</span>
          </div>
        </Card>
      ))}
    </div>
  ),

  "passenger.checkin": () => (
    <Card className="text-center py-12">
      <ScanLine className="h-12 w-12 mx-auto text-primary mb-3" />
      <h3 className="text-xl font-bold">Check-in available</h3>
      <p className="text-sm text-muted-foreground mt-2">Flight AN-204 · seat 18A pre-selected</p>
      <button className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Check in now</button>
    </Card>
  ),

  "passenger.trips": () => SECTIONS["passenger.bookings"](),
  "passenger.services": () => (
    <div className="grid md:grid-cols-3 gap-4">
      {["Lounge Access","Car Rental","Hotel Booking","Travel Insurance","Pre-order Meals","Wifi Package"].map((s) => (
        <Card key={s} className="hover:border-primary/40 cursor-pointer transition-all"><div className="font-semibold">{s}</div><div className="text-xs text-muted-foreground mt-1">Available for your trip</div></Card>
      ))}
    </div>
  ),
  "passenger.live": () => <LiveUpdates />,
  "passenger.integrations": () => <IntegrationsList />,
  "passenger.documents": () => <DocumentsList />,

  // ====================== PILOT ======================
  "pilot.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Flight" value="AN-204" icon={Plane} />
        <Stat label="Aircraft" value="B777-300ER" icon={Plane} color="text-accent" />
        <Stat label="Fuel" value="142.3 t" delta="Within plan" icon={Fuel} color="text-emerald-400" />
        <Stat label="Status" value="GREEN" icon={CheckCircle2} color="text-emerald-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle title="Flight route" sub="JFK → LHR · FL370" />
          <div className="h-48 rounded-xl bg-secondary relative overflow-hidden">
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="route" x1="0" x2="1"><stop offset="0%" stopColor="oklch(0.7 0.18 235)" /><stop offset="100%" stopColor="oklch(0.72 0.16 195)" /></linearGradient>
              </defs>
              <path d="M40 150 Q 200 20 360 100" fill="none" stroke="url(#route)" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="40" cy="150" r="6" fill="oklch(0.72 0.16 195)" />
              <circle cx="360" cy="100" r="6" fill="oklch(0.7 0.18 235)" />
              <text x="40" y="170" fill="#9aa" fontSize="10">JFK</text>
              <text x="345" y="120" fill="#9aa" fontSize="10">LHR</text>
              <g transform="translate(200,72) rotate(-15)"><polygon points="0,-6 12,0 0,6 3,0" fill="#fff" /></g>
            </svg>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 text-center">
            {[["Distance","3,459 nm"],["ETE","6h 52m"],["Wind","P-035 kt"],["Tracks","NAT-D"]].map(([k,v]) => (
              <div key={k} className="rounded-lg bg-secondary py-2"><div className="text-[10px] text-muted-foreground">{k}</div><div className="text-sm font-semibold mt-1">{v}</div></div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Pre-flight checklist" />
          <div className="space-y-2">
            {["Cockpit prep","Fuel verified","Weight & balance","Weather review","NOTAMs reviewed","Crew briefing"].map((c, i) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i < 4} className="accent-primary" />
                <span className={i < 4 ? "text-muted-foreground line-through" : ""}>{c}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle title="Active NOTAMs" />
          <div className="space-y-2">
            {[
              { c: "EGLL", t: "RWY 27L closed 22:00-04:00 UTC", sev: "med" },
              { c: "KJFK", t: "Taxiway B between Z and Y closed", sev: "low" },
            ].map((n, i) => (
              <div key={i} className="rounded-lg bg-secondary p-3 flex items-start gap-3">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${n.sev === "med" ? "text-amber-400" : "text-info"}`} />
                <div><div className="text-sm font-medium">{n.c}</div><div className="text-xs text-muted-foreground">{n.t}</div></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Fuel & weight" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[{n:"Trip",v:124},{n:"Reserve",v:8},{n:"Alternate",v:6},{n:"Extra",v:4}]}>
              <XAxis dataKey="n" stroke="#7a8" fontSize={10} />
              <YAxis stroke="#7a8" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
              <Bar dataKey="v" fill="oklch(0.7 0.18 235)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  ),

  "pilot.flights": () => (
    <Card>
      <SectionTitle title="My upcoming flights" />
      {[["AN-204","JFK→LHR","Today 14:50"],["AN-330","LHR→DXB","Aug 14 09:20"],["AN-410","DXB→SIN","Aug 16 22:10"]].map((f) => (
        <div key={f[0]} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
          <div className="flex items-center gap-3"><Plane className="h-4 w-4 text-primary -rotate-45" /><div><div className="font-semibold">{f[1]}</div><div className="text-xs text-muted-foreground">{f[0]}</div></div></div>
          <div className="text-xs">{f[2]}</div>
        </div>
      ))}
    </Card>
  ),
  "pilot.preflight": () => SECTIONS["pilot.dashboard"](),
  "pilot.weather": () => (
    <Card>
      <SectionTitle title="Weather briefing" sub="Route JFK → LHR" />
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { c: "KJFK", t: "22°C · 220/12 · 10SM · FEW040" },
          { c: "EINN", t: "11°C · 270/22 · 8SM · OVC020" },
          { c: "EGLL", t: "14°C · 240/15 · 10SM · BKN030" },
        ].map((w) => (
          <div key={w.c} className="rounded-lg bg-secondary p-4"><div className="font-mono text-sm">{w.c}</div><div className="text-xs text-muted-foreground mt-1">{w.t}</div></div>
        ))}
      </div>
    </Card>
  ),
  "pilot.notams": () => SECTIONS["pilot.dashboard"](),
  "pilot.crew": () => <CrewList />,
  "pilot.maint": () => <MaintLogList />,

  // ====================== CREW ======================
  "crew.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Passengers" value="284" icon={Users} />
        <Stat label="Boarded" value="176" delta="62%" icon={CheckCircle2} color="text-emerald-400" />
        <Stat label="Special meals" value="14" icon={Coffee} color="text-accent" />
        <Stat label="Requests" value="3" icon={Bell} color="text-amber-400" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle title="Passenger requests" />
          <div className="space-y-2">
            {[
              { s: "14C", t: "Water", time: "2m ago" },
              { s: "22F", t: "Blanket", time: "5m ago" },
              { s: "31A", t: "Special assistance", time: "8m ago" },
            ].map((r) => (
              <div key={r.s} className="rounded-lg bg-secondary p-3 flex justify-between">
                <div className="flex gap-3 items-center"><span className="font-mono text-sm">{r.s}</span><span className="text-sm">{r.t}</span></div>
                <span className="text-xs text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Cabin status" />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["First","8/8"],["Business","32/32"],["Economy","136/244"]].map(([k,v]) => (
              <div key={k} className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="text-lg font-bold mt-1">{v}</div></div>
            ))}
          </div>
          <SectionTitle title="Meal distribution" />
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={[{n:"Standard",v:240},{n:"Vegetarian",v:24},{n:"Gluten-free",v:12},{n:"Kosher",v:8}]} dataKey="v" innerRadius={30} outerRadius={55}>
                {["oklch(0.7 0.18 235)","oklch(0.72 0.16 195)","oklch(0.72 0.17 155)","oklch(0.78 0.17 75)"].map((c,i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  ),
  "crew.schedule": () => SECTIONS["pilot.flights"](),
  "crew.pax": () => SECTIONS["crew.dashboard"](),
  "crew.meals": () => SECTIONS["crew.dashboard"](),
  "crew.boarding": () => (
    <Card>
      <SectionTitle title="Boarding management" sub="Group-based boarding active" />
      <div className="space-y-2">
        {[
          { g: "Priority", b: 24, t: 24 },
          { g: "Group 1", b: 56, t: 56 },
          { g: "Group 2", b: 78, t: 90 },
          { g: "Group 3", b: 18, t: 80 },
          { g: "Group 4", b: 0, t: 34 },
        ].map((g) => (
          <div key={g.g} className="rounded-lg bg-secondary p-3">
            <div className="flex justify-between text-sm mb-2"><span>{g.g}</span><span className="text-muted-foreground">{g.b}/{g.t}</span></div>
            <div className="h-1.5 rounded-full bg-background overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(g.b/g.t)*100}%`, background: "var(--gradient-primary)" }} /></div>
          </div>
        ))}
      </div>
    </Card>
  ),
  "crew.emergency": () => (
    <Card>
      <SectionTitle title="Emergency checklist" />
      <div className="space-y-2">
        {["Decompression","Fire / Smoke","Medical","Turbulence","Ditching","Evacuation"].map((e) => (
          <button key={e} className="w-full text-left rounded-lg bg-secondary hover:bg-rose-500/10 hover:border-rose-500/40 border border-transparent p-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-400" /> {e}</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </Card>
  ),
  "crew.chat": () => (
    <Card>
      <SectionTitle title="Crew chat" />
      <div className="space-y-3">
        {[
          { u: "Cpt. Reyes", m: "Boarding looks good — wheels up in 25.", t: "13:42" },
          { u: "Lead FA", m: "All special meals confirmed.", t: "13:44" },
          { u: "You", m: "Copy that. Cabin secure in 10.", t: "13:46" },
        ].map((c) => (
          <div key={c.t} className={`flex ${c.u === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md rounded-2xl px-3 py-2 ${c.u === "You" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              <div className="text-[10px] opacity-70">{c.u} · {c.t}</div>
              <div className="text-sm">{c.m}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  ),
  "crew.reports": () => <ReportsList />,

  // ====================== MAINTENANCE ======================
  "maintenance.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Fleet health" value="94%" delta="+2%" icon={Activity} color="text-emerald-400" />
        <Stat label="Open faults" value="5" icon={AlertTriangle} color="text-amber-400" />
        <Stat label="In service" value="42" icon={Plane} />
        <Stat label="Grounded" value="2" icon={Wrench} color="text-rose-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle title="Engine diagnostics" sub="Last 12 hours" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <XAxis dataKey="name" stroke="#7a8" fontSize={10} />
              <YAxis stroke="#7a8" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="flights" stroke="oklch(0.7 0.18 235)" strokeWidth={2} dot={false} name="EGT" />
              <Line type="monotone" dataKey="delays" stroke="oklch(0.78 0.17 75)" strokeWidth={2} dot={false} name="Vibration" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle title="Engine health" />
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius="40%" outerRadius="100%" data={[
              { name: "ENG1", v: 96, fill: "oklch(0.72 0.17 155)" },
              { name: "ENG2", v: 88, fill: "oklch(0.78 0.17 75)" },
              { name: "APU", v: 92, fill: "oklch(0.7 0.18 235)" },
            ]}>
              <RadialBar dataKey="v" background cornerRadius={8} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Open fault reports" />
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border/50">
            <tr><th className="text-left py-2">Tail</th><th className="text-left">Fault</th><th className="text-left">Severity</th><th className="text-left">Reported</th></tr>
          </thead>
          <tbody>
            {[
              ["N847AN","Hydraulic pressure drop","High","2h ago"],
              ["N221AN","APU EGT high","Med","5h ago"],
              ["N555AN","Cabin pressure sensor","Low","11h ago"],
            ].map((r) => (
              <tr key={r[0]} className="border-b border-border/30">
                <td className="py-3 font-mono">{r[0]}</td><td>{r[1]}</td>
                <td><span className={`text-[10px] uppercase px-2 py-1 rounded-full ${
                  r[2] === "High" ? "bg-rose-500/20 text-rose-300" :
                  r[2] === "Med" ? "bg-amber-500/20 text-amber-300" : "bg-info/20 text-info"
                }`}>{r[2]}</span></td>
                <td className="text-muted-foreground">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
  "maintenance.health": () => SECTIONS["maintenance.dashboard"](),
  "maintenance.engine": () => SECTIONS["maintenance.dashboard"](),
  "maintenance.repairs": () => <MaintLogList />,
  "maintenance.faults": () => SECTIONS["maintenance.dashboard"](),
  "maintenance.scheduled": () => (
    <Card>
      <SectionTitle title="Scheduled maintenance" />
      {[["N847AN","C-Check","Aug 18"],["N221AN","Engine borescope","Aug 21"],["N555AN","Tire change","Aug 22"]].map((r) => (
        <div key={r[0]} className="flex justify-between py-3 border-b border-border/30 last:border-0">
          <div><div className="font-mono text-sm">{r[0]}</div><div className="text-xs text-muted-foreground">{r[1]}</div></div>
          <div className="text-sm">{r[2]}</div>
        </div>
      ))}
    </Card>
  ),
  "maintenance.inventory": () => (
    <div className="grid md:grid-cols-4 gap-3">
      {[["Hydraulic seals",128],["Brake pads",42],["Tires (B777)",18],["Filters",256],["Lamps",330],["Sensors",91],["Fasteners",1240],["O-rings",520]].map(([n,v]) => (
        <Card key={n as string}><div className="text-xs text-muted-foreground">{n}</div><div className="text-2xl font-bold mt-1">{v}</div><div className="text-[10px] text-emerald-400 mt-1">In stock</div></Card>
      ))}
    </div>
  ),

  // ====================== SECURITY ======================
  "security.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active threats" value="2" icon={AlertTriangle} color="text-rose-400" />
        <Stat label="Screening" value="1,284" delta="Throughput" icon={ScanLine} />
        <Stat label="Access events" value="3,210" icon={Lock} color="text-info" />
        <Stat label="Cameras online" value="148/150" icon={Camera} color="text-emerald-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle title="Live monitoring" sub="Terminal grid" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-black/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <Camera className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/50" />
                <div className="absolute top-1 left-1 text-[9px] font-mono bg-black/60 px-1 rounded">CAM-{String(i+1).padStart(2,"0")}</div>
                <div className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Threat alerts" />
          <div className="space-y-2">
            {[
              { t: "Unattended bag · Gate 7", sev: "high", time: "2m" },
              { t: "Restricted zone breach attempt", sev: "med", time: "14m" },
              { t: "Watchlist match · screening", sev: "high", time: "27m" },
            ].map((a, i) => (
              <div key={i} className="rounded-lg bg-secondary p-3 flex justify-between items-start">
                <div className="flex gap-2"><AlertTriangle className={`h-4 w-4 mt-0.5 ${a.sev === "high" ? "text-rose-400" : "text-amber-400"}`} /><span className="text-sm">{a.t}</span></div>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Access logs" sub="Last hour" />
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border/50">
            <tr><th className="text-left py-2">Time</th><th className="text-left">Zone</th><th className="text-left">Badge</th><th className="text-left">Result</th></tr>
          </thead>
          <tbody>
            {[
              ["14:02","Apron A","SEC-2241","Granted"],
              ["14:03","Bag handling","CRW-7782","Granted"],
              ["14:05","Tower","UNK-XXXX","Denied"],
              ["14:09","Hangar 3","MX-3310","Granted"],
            ].map((r) => (
              <tr key={r[0]+r[2]} className="border-b border-border/30">
                <td className="py-3 font-mono">{r[0]}</td><td>{r[1]}</td><td className="font-mono">{r[2]}</td>
                <td><span className={`text-[10px] px-2 py-1 rounded-full ${r[3] === "Granted" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>{r[3]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
  "security.threats": () => SECTIONS["security.dashboard"](),
  "security.screening": () => (
    <Card>
      <SectionTitle title="Passenger screening" sub="Throughput per lane" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={[{l:"Lane 1",v:212},{l:"Lane 2",v:188},{l:"Lane 3",v:241},{l:"Lane 4",v:165},{l:"Lane 5",v:198}]}>
          <XAxis dataKey="l" stroke="#7a8" fontSize={10} /><YAxis stroke="#7a8" fontSize={10} />
          <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
          <Bar dataKey="v" fill="oklch(0.72 0.16 195)" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  ),
  "security.access": () => SECTIONS["security.dashboard"](),
  "security.incidents": () => <ReportsList />,
  "security.zones": () => (
    <div className="grid md:grid-cols-3 gap-3">
      {["Apron A","Apron B","Tower","Hangar 1","Hangar 3","Fuel depot","Ramp","Cargo","Tarmac"].map((z) => (
        <Card key={z}><div className="flex justify-between"><span className="font-semibold">{z}</span><Shield className="h-4 w-4 text-primary" /></div><div className="text-xs text-emerald-400 mt-2">Secure</div></Card>
      ))}
    </div>
  ),
  "security.cameras": () => SECTIONS["security.dashboard"](),

  // ====================== ADMIN ======================
  "admin.dashboard": () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active flights" value="312" delta="+8 last hour" icon={Plane} />
        <Stat label="Users online" value="1,284" delta="+12%" icon={Users} color="text-accent" />
        <Stat label="Revenue today" value="$4.2M" delta="+6.4%" icon={TrendingUp} color="text-emerald-400" />
        <Stat label="AI requests" value="48.3K" delta="+18%" icon={Bot} color="text-info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle title="Flight traffic" sub="Last 24 hours" />
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.18 235)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.7 0.18 235)" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.17 75)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.78 0.17 75)" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#7a8" fontSize={10} /><YAxis stroke="#7a8" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
              <Area dataKey="flights" stroke="oklch(0.7 0.18 235)" fill="url(#g1)" strokeWidth={2} />
              <Area dataKey="delays" stroke="oklch(0.78 0.17 75)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle title="System health" />
          {[["API gateway",99.98],["AI pipeline",99.7],["Database",99.99],["Edge CDN",99.96]].map(([k,v]) => (
            <div key={k as string} className="mb-3">
              <div className="flex justify-between text-xs"><span>{k}</span><span className="text-emerald-400 font-mono">{v}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle title="Weekly revenue" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="d" stroke="#7a8" fontSize={10} /><YAxis stroke="#7a8" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 252)", border: "1px solid oklch(0.32 0.04 252)", borderRadius: 8 }} />
              <Bar dataKey="v" radius={[6,6,0,0]} fill="oklch(0.72 0.16 195)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Live operations" />
          <div className="space-y-2 text-sm">
            {[
              ["AN-204","JFK→LHR","Cruise","FL370"],
              ["AN-330","LHR→DXB","Climb","FL230"],
              ["AN-512","CDG→JFK","Descent","FL120"],
              ["AN-118","NRT→SFO","Cruise","FL360"],
            ].map((r) => (
              <div key={r[0]} className="flex justify-between rounded-lg bg-secondary p-2.5">
                <span className="font-mono">{r[0]}</span><span className="text-muted-foreground">{r[1]}</span>
                <span className="text-xs">{r[2]} · {r[3]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  ),
  "admin.analytics": () => SECTIONS["admin.dashboard"](),
  "admin.users": () => (
    <Card>
      <SectionTitle title="User management" />
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground border-b border-border/50">
          <tr><th className="text-left py-2">Name</th><th className="text-left">Role</th><th className="text-left">Status</th><th className="text-left">Last active</th></tr>
        </thead>
        <tbody>
          {[
            ["Alex Sterling","Pilot","Active","2m ago"],
            ["Maria Chen","Crew","Active","5m ago"],
            ["Sam Patel","Maintenance","Idle","32m ago"],
            ["Jordan Lee","Security","Active","just now"],
            ["Priya Rao","Passenger","Offline","2h ago"],
          ].map((r) => (
            <tr key={r[0]} className="border-b border-border/30">
              <td className="py-3">{r[0]}</td><td>{r[1]}</td>
              <td><span className={`text-[10px] px-2 py-1 rounded-full ${r[2] === "Active" ? "bg-emerald-500/20 text-emerald-300" : r[2] === "Idle" ? "bg-amber-500/20 text-amber-300" : "bg-muted/40 text-muted-foreground"}`}>{r[2]}</span></td>
              <td className="text-muted-foreground">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  ),
  "admin.ops": () => SECTIONS["admin.dashboard"](),
  "admin.crew": () => <CrewList />,
  "admin.maint": () => SECTIONS["maintenance.dashboard"](),
  "admin.security": () => SECTIONS["security.dashboard"](),
  "admin.logs": () => (
    <Card>
      <SectionTitle title="System logs" />
      <div className="font-mono text-xs space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
        {Array.from({ length: 30 }).map((_, i) => {
          const t = new Date(Date.now() - i * 60000).toISOString().slice(11, 19);
          const levels = ["INFO","INFO","WARN","INFO","ERROR"];
          const lvl = levels[i % 5];
          return (
            <div key={i} className="flex gap-3">
              <span className="text-muted-foreground">{t}</span>
              <span className={lvl === "ERROR" ? "text-rose-400" : lvl === "WARN" ? "text-amber-400" : "text-emerald-400"}>{lvl}</span>
              <span>auth.session.refresh user={1000 + i}</span>
            </div>
          );
        })}
      </div>
    </Card>
  ),
  "admin.api": () => <IntegrationsList />,
  "admin.reports": () => <ReportsList />,
};

// ---------- Shared subcomponents ----------
function CrewList() {
  return (
    <Card>
      <SectionTitle title="Crew assignments" />
      {[
        { n: "Cpt. Marcus Reyes", r: "Captain", st: "On duty" },
        { n: "FO. Sara Khan", r: "First Officer", st: "On duty" },
        { n: "Elena Voss", r: "Lead FA", st: "On duty" },
        { n: "Tomas Lima", r: "Flight Attendant", st: "Standby" },
        { n: "Aisha Bello", r: "Flight Attendant", st: "On duty" },
      ].map((c) => (
        <div key={c.n} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              {c.n.split(" ").map((p) => p[0]).slice(0,2).join("")}
            </div>
            <div><div className="text-sm font-medium">{c.n}</div><div className="text-xs text-muted-foreground">{c.r}</div></div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full ${c.st === "On duty" ? "bg-emerald-500/20 text-emerald-300" : "bg-muted/40 text-muted-foreground"}`}>{c.st}</span>
        </div>
      ))}
    </Card>
  );
}

function MaintLogList() {
  return (
    <Card>
      <SectionTitle title="Maintenance log" />
      {[
        ["Aug 9","N847AN","Hydraulic line replaced","Closed"],
        ["Aug 8","N221AN","APU service","Closed"],
        ["Aug 7","N555AN","Tire pressure check","Closed"],
        ["Aug 7","N847AN","Software update — FMC","Closed"],
      ].map((r) => (
        <div key={r[0]+r[1]} className="flex justify-between py-3 border-b border-border/30 last:border-0 text-sm">
          <div className="flex gap-4"><span className="text-muted-foreground w-14">{r[0]}</span><span className="font-mono">{r[1]}</span><span>{r[2]}</span></div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">{r[3]}</span>
        </div>
      ))}
    </Card>
  );
}

function LiveUpdates() {
  return (
    <Card>
      <SectionTitle title="Live updates" />
      <div className="space-y-2">
        {[
          { t: "Gate change", d: "AN-204 moved to B24", time: "3m" },
          { t: "Boarding", d: "AN-330 now boarding", time: "12m" },
          { t: "Delay", d: "AN-118 delayed 25 min", time: "21m" },
        ].map((u) => (
          <div key={u.t+u.time} className="flex justify-between rounded-lg bg-secondary p-3">
            <div><div className="text-sm font-semibold">{u.t}</div><div className="text-xs text-muted-foreground">{u.d}</div></div>
            <span className="text-[10px] text-muted-foreground">{u.time} ago</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function IntegrationsList() {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {[
        ["Amadeus","Booking GDS","Connected"],
        ["FlightAware","Tracking","Connected"],
        ["SITA","Messaging","Connected"],
        ["Stripe","Payments","Connected"],
        ["Twilio","SMS / Voice","Disconnected"],
        ["OpenWeather","Weather data","Connected"],
      ].map(([n,d,s]) => (
        <Card key={n as string}>
          <div className="flex justify-between"><div><div className="font-semibold">{n}</div><div className="text-xs text-muted-foreground">{d}</div></div>
            <span className={`text-[10px] px-2 py-1 rounded-full h-fit ${s === "Connected" ? "bg-emerald-500/20 text-emerald-300" : "bg-muted/40 text-muted-foreground"}`}>{s}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function DocumentsList() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {[
        ["Passport","Verified","Exp 2031"],
        ["Visa — UK","Valid","Exp 2026"],
        ["Boarding pass AN-204","Active","Today"],
        ["TSA PreCheck","Active","Member"],
      ].map((d) => (
        <Card key={d[0]}>
          <div className="flex items-start justify-between">
            <div className="flex gap-3"><FileText className="h-5 w-5 text-primary" /><div><div className="font-semibold">{d[0]}</div><div className="text-xs text-muted-foreground">{d[2]}</div></div></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">{d[1]}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ReportsList() {
  return (
    <Card>
      <SectionTitle title="Recent reports" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-between py-3 border-b border-border/30 last:border-0">
          <div className="flex gap-3 items-center"><FileText className="h-4 w-4 text-primary" /><div><div className="text-sm font-medium">Report #{2024100 + i}</div><div className="text-xs text-muted-foreground">Filed {i+1} day{i?"s":""} ago</div></div></div>
          <button className="text-xs text-primary hover:underline">View</button>
        </div>
      ))}
    </Card>
  );
}

function NotificationsSection() {
  return (
    <Card>
      <SectionTitle title="Notifications" />
      {[
        ["Gate B24 confirmed","2 min ago","info"],
        ["Boarding starts in 30 min","12 min ago","info"],
        ["Lounge access activated","1h ago","success"],
        ["Weather advisory for LHR","2h ago","warn"],
      ].map(([t, time, sev]) => (
        <div key={t as string} className="flex gap-3 py-3 border-b border-border/30 last:border-0">
          <Bell className={`h-4 w-4 mt-1 ${sev === "warn" ? "text-amber-400" : sev === "success" ? "text-emerald-400" : "text-info"}`} />
          <div className="flex-1"><div className="text-sm">{t}</div><div className="text-xs text-muted-foreground">{time}</div></div>
        </div>
      ))}
    </Card>
  );
}

function SupportSection() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card><div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><div><div className="font-semibold">24/7 support</div><div className="text-xs text-muted-foreground">+1 (800) 555-0199</div></div></div></Card>
      <Card><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><div><div className="font-semibold">Email us</div><div className="text-xs text-muted-foreground">support@aeronexus.io</div></div></div></Card>
      <Card className="md:col-span-2">
        <SectionTitle title="FAQ" />
        {["How do I change my booking?","What's my baggage allowance?","Can I upgrade my seat?","Where do I download my invoice?"].map((q) => (
          <div key={q} className="py-3 border-b border-border/30 last:border-0 text-sm flex justify-between"><span>{q}</span><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></div>
        ))}
      </Card>
    </div>
  );
}

function ProfileSection({ user }: { user: AuthUser }) {
  const meta = ROLE_META[user.role];
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 text-center">
        <div className="h-24 w-24 rounded-full mx-auto grid place-items-center text-2xl font-bold text-primary-foreground glow" style={{ background: "var(--gradient-primary)" }}>
          {user.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
        </div>
        <h3 className="mt-4 text-xl font-bold">{user.name}</h3>
        <div className={`inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full text-white bg-gradient-to-r ${meta.color}`}>{meta.label}</div>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div className="font-mono">{user.id}</div>
          <div>{user.email}</div>
          <div>{user.phone}</div>
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Active</div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <SectionTitle title="Role-specific information" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Department", ROLE_META[user.role].label],
              ["Clearance", user.role === "security" || user.role === "admin" ? "Level 5" : "Standard"],
              ["Base", "JFK"],
              ["Joined", "Jan 2023"],
            ].map(([k,v]) => (
              <div key={k} className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium mt-0.5">{v}</div></div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Assigned flights" />
          {[["AN-204","JFK→LHR","Today"],["AN-330","LHR→DXB","Aug 14"],["AN-410","DXB→SIN","Aug 16"]].map((f) => (
            <div key={f[0]} className="flex justify-between py-2.5 border-b border-border/30 last:border-0 text-sm">
              <span className="font-mono">{f[0]}</span><span className="text-muted-foreground">{f[1]}</span><span>{f[2]}</span>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle title="Activity log" />
          {[
            ["Signed in","just now"],
            ["Viewed flight AN-204","2 min ago"],
            ["Opened AI assistant","5 min ago"],
            ["Updated notification settings","1h ago"],
          ].map(([a,t]) => (
            <div key={a} className="flex justify-between py-2 border-b border-border/30 last:border-0 text-sm">
              <span>{a}</span><span className="text-xs text-muted-foreground">{t}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SettingsSection() {
  const groups: { title: string; items: { l: string; v: string | boolean }[] }[] = [
    { title: "Account", items: [{ l: "Display name", v: "Alex Sterling" }, { l: "Email", v: "alex@aeronexus.io" }, { l: "Phone", v: "+1 (555) 010-2244" }] },
    { title: "Notifications", items: [{ l: "Email alerts", v: true }, { l: "SMS alerts", v: true }, { l: "Push", v: false }] },
    { title: "Privacy & Security", items: [{ l: "Two-factor auth", v: true }, { l: "Active sessions", v: "3 devices" }, { l: "Data export", v: "Available" }] },
    { title: "Preferences", items: [{ l: "Theme", v: "Aviation Dark" }, { l: "Language", v: "English (US)" }, { l: "Timezone", v: "UTC-05:00" }] },
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {groups.map((g) => (
        <Card key={g.title}>
          <SectionTitle title={g.title} />
          <div className="space-y-2">
            {g.items.map((it) => (
              <div key={it.l} className="flex justify-between items-center rounded-lg bg-secondary px-3 py-2.5">
                <span className="text-sm">{it.l}</span>
                {typeof it.v === "boolean" ? (
                  <div className={`h-5 w-9 rounded-full ${it.v ? "bg-primary" : "bg-muted"} relative`}>
                    <span className={`absolute top-0.5 ${it.v ? "right-0.5" : "left-0.5"} h-4 w-4 rounded-full bg-white transition-all`} />
                  </div>
                ) : <span className="text-xs text-muted-foreground">{it.v}</span>}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function AISection({ role }: { role: Role }) {
  const tips: Record<Role, string[]> = {
    passenger: ["Ask: 'Where is my gate?'", "Ask: 'Translate my boarding pass to Japanese'", "Ask: 'Is my flight delayed?'"],
    pilot: ["Ask: 'Weather at KJFK in 2 hours'", "Ask: 'Fuel for LHR→JFK at FL370'", "Ask: 'Active NOTAMs on my route'"],
    crew: ["Ask: 'How many vegetarian meals?'", "Ask: 'Open passenger requests'", "Ask: 'Boarding progress'"],
    maintenance: ["Ask: 'Engine 2 health on N847AN'", "Ask: 'Predict next failure'", "Ask: 'Open fault reports'"],
    security: ["Ask: 'Current threat level'", "Ask: 'Screening throughput last hour'", "Ask: 'Recent access denials'"],
    admin: ["Ask: 'Today's revenue'", "Ask: 'System health overview'", "Ask: 'AI usage trends'"],
  };
  return (
    <Card>
      <div className="text-center py-6">
        <div className="h-16 w-16 rounded-2xl mx-auto grid place-items-center glow" style={{ background: "var(--gradient-primary)" }}>
          <Bot className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="mt-4 text-2xl font-bold">Your AI assistant is ready</h3>
        <p className="text-sm text-muted-foreground mt-1">Open it from the floating button anytime.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-4">
        {tips[role].map((t) => (
          <div key={t} className="rounded-xl bg-secondary p-4 text-sm flex gap-2"><Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>{t}</span></div>
        ))}
      </div>
    </Card>
  );
}
