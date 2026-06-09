import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.svg";

export default function PublicLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Red Elk" className="h-9 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
                >
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    await logout();navigate("/");}}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Log In
                </Link>
                <button
                  onClick={() => navigate("/login?mode=register")}
                  className="px-4 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
        {/* Gradient accent line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, #da8f93 30%, #C0392B 50%, #da8f93 70%, transparent 100%)", opacity: 0.4 }} />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
