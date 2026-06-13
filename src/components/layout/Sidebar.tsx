import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Flag,
  Target,
  Compass,
  ClipboardList,
  BarChart2,
  Table2,
  Users,
  Upload,
  LogOut,
  ChevronRight,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/RedElkonly.svg";

const adminLinks = [
  { to: "/admin", icon: BarChart2, label: "Analytics", isActive: (p: string) => p === "/admin" },
  { to: "/admin/sessions", icon: Table2, label: "All sessions", isActive: (p: string) => p.startsWith("/admin/sessions") },
  { to: "/admin/users", icon: Users, label: "Users", isActive: (p: string) => p.startsWith("/admin/users") },
  { to: "/admin/import", icon: Upload, label: "Import", isActive: (p: string) => p.startsWith("/admin/import") },
];

interface ItemDef {
  to: string | null;
  icon: React.ElementType;
  label: string;
  active: boolean;
  disabledHint?: string;
}

interface Props {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";
  const reportId = user?.maturity_summary?.as_of_session_id ?? null;

  const workspaceLinks: ItemDef[] = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      active: pathname.startsWith("/dashboard"),
    },
    {
      to: reportId ? `/sessions/${reportId}/report` : null,
      icon: LineChart,
      label: "Report",
      active: !!matchPath("/sessions/:id/report", pathname),
      disabledHint: "Complete an assessment to unlock",
    },
    {
      to: "/action-plan",
      icon: Flag,
      label: "Action plan",
      active: pathname === "/action-plan",
    },
    {
      to: "/benchmarks",
      icon: Target,
      label: "Benchmarks",
      active: pathname === "/benchmarks",
    },
    {
      to: "/assessments",
      icon: Compass,
      label: "Take assessment",
      active:
        !!matchPath("/assessments", pathname) ||
        !!matchPath("/assessments/:slug", pathname) ||
        !!matchPath("/sessions/:id/quiz", pathname),
    },
    {
      to: "/sessions",
      icon: ClipboardList,
      label: "My sessions",
      active: pathname === "/sessions",
    },
  ];

  function NavItem({ item }: { item: ItemDef }) {
    const Icon = item.icon;
    const inner = (
      <>
        <Icon size={17} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
        {item.active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
      </>
    );
    if (!item.to) {
      return (
        <span
          className="re-sidenav-item"
          title={item.disabledHint}
          style={{ opacity: 0.45, cursor: "default", marginBottom: 2 }}
        >
          {inner}
        </span>
      );
    }
    return (
      <Link
        to={item.to}
        onClick={onClose}
        className={`re-sidenav-item${item.active ? " active" : ""}`}
        style={{ marginBottom: 2 }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <aside
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-20 select-none"
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        padding: "18px 14px",
        fontFamily: "var(--font-ui)",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--sidebar-brand-tile)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 1px 2px rgba(0,0,0,.12)",
            }}
          >
            <img src={logo} alt="Red Elk" style={{ width: 26, height: 26, objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--sidebar-ink)", letterSpacing: "-.01em", lineHeight: 1.2 }}>
              Red Elk
            </p>
            <p style={{ fontSize: 10.5, color: "var(--sidebar-muted)", letterSpacing: ".02em" }}>AI MATURITY</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
            style={{ background: "transparent", border: "none", color: "var(--sidebar-muted)", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div style={{ padding: "0 11px 6px" }}>
          <span className="re-eyebrow" style={{ color: "var(--sidebar-muted)", opacity: 0.8 }}>Workspace</span>
        </div>
        {workspaceLinks.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}

        {user?.role === "admin" && (
          <>
            <div style={{ padding: "16px 11px 6px" }}>
              <span className="re-eyebrow" style={{ color: "var(--sidebar-muted)", opacity: 0.8 }}>Admin</span>
            </div>
            {adminLinks.map(({ to, icon, label, isActive }) => (
              <NavItem key={to} item={{ to, icon, label, active: isActive(pathname) }} />
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid var(--sidebar-border)", paddingTop: 12, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "var(--accent)",
              color: "#fff",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--sidebar-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </p>
            <p style={{ fontSize: 11, color: "var(--sidebar-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: user?.company ? undefined : "capitalize" }}>
              {user?.company ?? user?.role ?? "user"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            style={{ background: "transparent", border: "none", color: "var(--sidebar-muted)", cursor: "pointer", padding: 4, display: "flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sidebar-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sidebar-muted)")}
          >
            <LogOut size={16} />
          </button>
        </div>
        <button
          onClick={toggleTheme}
          className="re-sidenav-item"
          style={{ background: "transparent", border: "none", cursor: "pointer", marginTop: 2 }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span style={{ flex: 1, textAlign: "left" }}>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </aside>
  );
}
