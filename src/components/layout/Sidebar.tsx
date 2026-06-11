import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
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

const navLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sessions", icon: ClipboardList, label: "My Sessions" },
];

const adminLinks = [
  { to: "/admin", icon: BarChart2, label: "Analytics", end: true },
  { to: "/admin/sessions", icon: Table2, label: "All Sessions", end: false },
  { to: "/admin/users", icon: Users, label: "Users", end: false },
  { to: "/admin/import", icon: Upload, label: "Import", end: false },
];

interface Props {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <aside className="grain fixed top-0 left-0 h-full w-60 bg-elk-maroon flex flex-col z-20 select-none">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-1.5 shrink-0">
              <img src={logo} alt="Red Elk" className="h-7 w-auto" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>Red Elk</p>
              <p className="text-white/35 text-xs mt-0.5">AI Assessment</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.1em] px-3 mb-2">
          Main
        </p>

        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-white/8 text-white font-semibold px-3 py-2"
                  : "text-white/60 hover:bg-white/8 hover:text-white font-medium px-3 py-2"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={17} />
              {label}
            </span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.1em]">
                Admin
              </p>
            </div>
            {adminLinks.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-white/8 text-white font-semibold px-3 py-2"
                      : "text-white/60 hover:bg-white/8 hover:text-white font-medium px-3 py-2"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {label}
                </span>
                <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
            style={{ background: "var(--gradient-brand)" }}
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white/80 text-xs font-medium truncate">{user?.email}</p>
            {user?.company ? (
              <p className="text-white/35 text-xs truncate">{user.company}</p>
            ) : (
              <p className="text-white/30 text-xs capitalize">{user?.role ?? "user"}</p>
            )}
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white/80 transition-all"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white/80 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
