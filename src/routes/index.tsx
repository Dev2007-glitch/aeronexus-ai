import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AeroNexus AI Portal" },
      { name: "description", content: "Aviation operations command center with role-based dashboards and AI assistance." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useAuth();
  return <Navigate to={user ? "/app" : "/login"} />;
}
