import { Link, matchPath, useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

const TITLES: { pattern: string; title: string; sub: string }[] = [
  { pattern: "/dashboard", title: "Overview", sub: "Your AI maturity at a glance" },
  { pattern: "/action-plan", title: "Action plan", sub: "Preview · your prioritised roadmap to the next maturity tier" },
  { pattern: "/benchmarks", title: "Benchmarks", sub: "Preview · how you compare against sector peers" },
  { pattern: "/sessions/:id/quiz", title: "Assessment", sub: "Answer honestly — there are no wrong answers" },
  { pattern: "/sessions/:id/report", title: "Assessment report", sub: "Your maturity results across all dimensions" },
  { pattern: "/sessions", title: "My sessions", sub: "Assessment history & progress" },
  { pattern: "/assessments", title: "Take assessment", sub: "Choose an assessment to begin" },
  { pattern: "/assessments/:slug", title: "Take assessment", sub: "Choose an assessment to begin" },
  { pattern: "/admin/sessions", title: "All sessions", sub: "Every assessment session across the platform" },
  { pattern: "/admin/users/:userId", title: "User detail", sub: "Profile and sessions for this user" },
  { pattern: "/admin/users", title: "Users", sub: "Manage roles and subscription tiers" },
  { pattern: "/admin/import", title: "Import", sub: "Create or update an assessment from XLSX" },
  { pattern: "/admin", title: "Platform analytics", sub: "Across all companies and assessments" },
];

interface Props {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
  const { pathname } = useLocation();

  const entry = TITLES.find((t) => matchPath(t.pattern, pathname)) ?? TITLES[0];
  const newAssessmentTo = "/assessments";

  return (
    <header
      className="px-4 py-4 sm:px-8 sm:py-5"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg) 72%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Open menu"
            style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <Menu size={22} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.015em", lineHeight: 1.1, color: "var(--ink)" }}>
            {entry.title}
          </h1>
          <p className="hidden sm:block" style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--muted)" }}>
            {entry.sub}
          </p>
        </div>
      </div>

      <Link
        to={newAssessmentTo}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 15px",
          borderRadius: "var(--radius)",
          background: "var(--accent)",
          color: "var(--accent-ink)",
          fontWeight: 600,
          fontSize: 13.5,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 2px rgba(0,0,0,.10)",
          transition: "background .18s var(--ease)",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-press)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
      >
        <Plus size={15} />
        <span className="hidden sm:inline">New assessment</span>
      </Link>
    </header>
  );
}
