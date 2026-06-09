import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Building2, CheckCircle, BarChart2, FileDown } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import logo from "../../assets/logo.svg";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  company: z.string().min(1, "Company name is required"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const features = [
  { icon: BarChart2, text: "Radar chart across all AI dimensions" },
  { icon: FileDown, text: "PDF report generated automatically" },
  { icon: CheckCircle, text: "Benchmark against industry tiers" },
];

export default function LoginPage() {
  const [params] = useSearchParams();
  const isRegister = params.get("mode") === "register";
  const [mode, setMode] = useState<"login" | "register">(isRegister ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const { waitForUserLoad, reloadUser } = useAuth();

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
    }
  }

  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData | RegisterData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginData | RegisterData) {
    setServerError("");
    try {
      if (mode === "register") {
        const { company, ...creds } = values as RegisterData;
        const { error } = await supabase.auth.signUp(creds);
        if (error) throw error;
        await api.post("/auth/register", { company });
        await reloadUser();
      } else {
        const { error } = await supabase.auth.signInWithPassword(values as LoginData);
        if (error) throw error;
        await waitForUserLoad();
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setServerError(msg);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="grain hidden lg:flex lg:w-[45%] bg-elk-maroon flex-col relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-elk-red opacity-20" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-elk-rose opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2.5 inline-flex w-fit">
            <img src={logo} alt="Red Elk" className="h-8 w-auto" />
          </div>

          <div className="flex-1 flex flex-col justify-center mt-12">
            <p className="text-elk-rose text-sm font-semibold tracking-widest uppercase mb-4">
              AI Maturity Platform
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-5">
              Measure your<br />organisation's<br />AI readiness
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
              Get a scored report, radar chart, and PDF roadmap benchmarked
              against industry tiers — in minutes.
            </p>

            <ul className="space-y-4">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-elk-rose" />
                  </div>
                  <span className="text-white/75 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-white/25 text-xs">© {new Date().getFullYear()} Red Elk. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 min-h-screen relative">
        <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="Red Elk" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {mode === "login" ? "Welcome back" : "Get started free"}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === "login"
                ? "Sign in to your Red Elk account"
                : "Create your account and start your assessment"}
            </p>
          </div>

          {/* Forgot password inline form */}
          {forgotMode && (
            <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-800 mb-1">Reset your password</h3>
              {forgotSent ? (
                <p className="text-sm text-green-700 font-medium">
                  Reset link sent! Check your inbox.
                </p>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3 mt-3">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elk-rose"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2 bg-elk-red hover:bg-red-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      {forgotLoading ? "Sending…" : "Send reset link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-700 text-xs font-bold">!</span>
              </div>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-elk-rose focus:border-elk-red transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-elk-rose focus:border-elk-red transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
              )}
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="mt-1.5 text-xs text-elk-red hover:underline font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register("company" as keyof (LoginData | RegisterData))}
                    placeholder="Acme Corp"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-elk-rose focus:border-elk-red transition-all"
                  />
                </div>
                {"company" in errors && errors.company && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.company.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
            >
              {isSubmitting
                ? "Please wait…"
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-elk-red font-semibold hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-elk-red font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
