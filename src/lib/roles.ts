import type { Role } from "./auth";
import {
  LayoutDashboard, Plane, Ticket, ScanLine, Luggage, Bell, Bot, Sparkles, Activity, Plug,
  User, FileText, Settings, LifeBuoy, LogOut, ListChecks, Cloud, AlertTriangle, Users,
  Wrench, ClipboardList, Coffee, MessageSquare, Siren, Boxes, Stethoscope, Shield,
  Camera, Lock, BarChart3, ServerCog, Radio, Map, Briefcase, Compass, Gauge,
} from "lucide-react";

export type IconType = typeof LayoutDashboard;

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
}

export const ROLE_META: Record<Role, { label: string; color: string; tagline: string }> = {
  passenger:   { label: "Passenger",     color: "from-sky-500 to-cyan-400",     tagline: "Your journey, simplified." },
  pilot:       { label: "Pilot",         color: "from-indigo-500 to-blue-400",  tagline: "Command deck ready." },
  crew:        { label: "Cabin Crew",    color: "from-fuchsia-500 to-pink-400", tagline: "Cabin operations live." },
  maintenance: { label: "Maintenance",   color: "from-amber-500 to-orange-400", tagline: "Aircraft health monitor." },
  security:    { label: "Security",      color: "from-rose-500 to-red-400",     tagline: "Perimeter secure." },
  admin:       { label: "Administrator", color: "from-emerald-500 to-teal-400", tagline: "Global operations center." },
};

export const SIDEBAR: Record<Role, NavItem[]> = {
  passenger: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "flights", label: "Flights", icon: Plane },
    { id: "bookings", label: "Bookings", icon: Ticket },
    { id: "checkin", label: "Check-in", icon: ScanLine },
    { id: "trips", label: "My Trips", icon: Map },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "ai", label: "AI Assistant", icon: Bot },
    { id: "services", label: "Travel Services", icon: Sparkles },
    { id: "live", label: "Live Updates", icon: Activity },
    { id: "integrations", label: "API Integrations", icon: Plug },
    { id: "profile", label: "Profile", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
  pilot: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "flights", label: "My Flights", icon: Plane },
    { id: "preflight", label: "Pre-flight Check", icon: ListChecks },
    { id: "weather", label: "Weather Briefing", icon: Cloud },
    { id: "notams", label: "NOTAMs", icon: AlertTriangle },
    { id: "ai", label: "AI Briefing", icon: Bot },
    { id: "crew", label: "Crew List", icon: Users },
    { id: "maint", label: "Maintenance Log", icon: Wrench },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
  crew: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schedule", label: "Flight Schedule", icon: ClipboardList },
    { id: "pax", label: "Passenger Support", icon: Users },
    { id: "meals", label: "Meal Service", icon: Coffee },
    { id: "boarding", label: "Boarding Tasks", icon: ScanLine },
    { id: "emergency", label: "Emergency Tools", icon: Siren },
    { id: "chat", label: "Crew Chat", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
  maintenance: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "health", label: "Aircraft Health", icon: Stethoscope },
    { id: "engine", label: "Engine Diagnostics", icon: Gauge },
    { id: "repairs", label: "Repair Logs", icon: Wrench },
    { id: "faults", label: "Fault Reports", icon: AlertTriangle },
    { id: "scheduled", label: "Scheduled Maintenance", icon: ClipboardList },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "ai", label: "AI Diagnostics", icon: Bot },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
  security: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "threats", label: "Threat Alerts", icon: AlertTriangle },
    { id: "screening", label: "Passenger Screening", icon: ScanLine },
    { id: "access", label: "Access Control", icon: Lock },
    { id: "incidents", label: "Incident Reports", icon: FileText },
    { id: "zones", label: "Restricted Zones", icon: Shield },
    { id: "cameras", label: "Security Cameras", icon: Camera },
    { id: "ai", label: "AI Monitoring", icon: Bot },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "ops", label: "Flight Operations", icon: Plane },
    { id: "crew", label: "Crew Management", icon: Briefcase },
    { id: "maint", label: "Maintenance Control", icon: Wrench },
    { id: "security", label: "Security Center", icon: Shield },
    { id: "ai", label: "AI Monitoring", icon: Bot },
    { id: "logs", label: "System Logs", icon: ServerCog },
    { id: "api", label: "API Management", icon: Plug },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ],
};

export const AI_PERSONA: Record<Role, { name: string; intro: string; suggestions: string[] }> = {
  passenger: {
    name: "Nexus Travel AI",
    intro: "Hi! I can help with flights, boarding, baggage and gate info.",
    suggestions: ["Where is my gate?", "Track my baggage", "Is my flight delayed?", "Translate boarding pass"],
  },
  pilot: {
    name: "Nexus FlightDeck AI",
    intro: "Pre-flight briefing ready. Ask about weather, fuel, NOTAMs or routing.",
    suggestions: ["Weather at KJFK", "Fuel for LHR→JFK", "Active NOTAMs", "Aircraft alerts"],
  },
  crew: {
    name: "Nexus Cabin AI",
    intro: "Cabin ops assistant. Passenger help, meals, boarding and emergencies.",
    suggestions: ["Special meal count", "Seat 14C request", "Emergency checklist", "Boarding status"],
  },
  maintenance: {
    name: "Nexus MX AI",
    intro: "Diagnostics online. Ask about engines, faults and predictive maintenance.",
    suggestions: ["Engine #2 health", "Predict next failure", "Open fault reports", "Repair suggestion"],
  },
  security: {
    name: "Nexus SecOps AI",
    intro: "Monitoring perimeter and screening. Threats, access, incidents.",
    suggestions: ["Active threats", "Screening throughput", "Restricted zone alerts", "Open incidents"],
  },
  admin: {
    name: "Nexus Command AI",
    intro: "Global ops overview. Analytics, users, operations, AI usage.",
    suggestions: ["System health", "Active users", "Today's revenue", "Fleet status"],
  },
};
