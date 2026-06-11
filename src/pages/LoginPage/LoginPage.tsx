import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import logo from "../../assets/RedElkonly.svg";
import "./login-atlas.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  company: z.string().min(1, "Company name is required"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const NS = "http://www.w3.org/2000/svg";

/** Static atmospheric background radar — ported from Login.html. */
function BgRadar() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.innerHTML = "";
    const cx = 410, cy = 410, R = 330;
    const scores = [82, 71, 79, 64, 58, 73];
    const n = scores.length;
    const ang = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pt = (i: number, r: number): [number, number] =>
      [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];
    const mk = (tag: string, a: Record<string, string | number>) => {
      const e = document.createElementNS(NS, tag);
      Object.entries(a).forEach(([k, v]) => e.setAttribute(k, String(v)));
      return e;
    };
    [0.25, 0.5, 0.75, 1].forEach((r, ri) => {
      svg.appendChild(mk("polygon", {
        points: scores.map((_, i) => pt(i, r).join(",")).join(" "),
        fill: ri === 3 ? "rgba(255,255,255,.025)" : "none",
        stroke: "rgba(255,255,255,.055)", "stroke-width": "1",
      }));
    });
    scores.forEach((_, i) => {
      const [x, y] = pt(i, 1);
      svg.appendChild(mk("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "rgba(255,255,255,.055)", "stroke-width": "1" }));
    });
    const pts = scores.map((s, i) => pt(i, s / 100).join(",")).join(" ");
    svg.appendChild(mk("polygon", { points: pts, fill: "rgba(247,233,228,.04)" }));
    svg.appendChild(mk("polygon", { points: pts, fill: "none", stroke: "rgba(247,233,228,.1)", "stroke-width": "1.5", "stroke-linejoin": "round" }));
    scores.forEach((s, i) => {
      const [x, y] = pt(i, s / 100);
      svg.appendChild(mk("circle", { cx: x, cy: y, r: "5", fill: "rgba(247,233,228,.12)" }));
    });
  }, []);
  return <svg ref={ref} className="bg-radar" width="820" height="820" viewBox="0 0 820 820" />;
}

function EyeIcon({ off }: { off: boolean }) {
  return off ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

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

  const heading = mode === "login" ? "Welcome back" : "Get started free";
  const sub =
    mode === "login"
      ? "Sign in to your workspace to continue."
      : "Create your account and start your assessment.";

  return (
    <div className="relk-login">
      <Link to="/" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back
      </Link>

      <div className="bg-glow" />
      <BgRadar />

      <div className="card">
        <div className="brand">
          <div className="brand-tile">
            <img src={logo} alt="Red Elk" />
          </div>
          <div>
            <div className="brand-name">Red Elk</div>
            <div className="brand-sub">AI Maturity</div>
          </div>
        </div>

        <h1 className="card-heading">{heading}</h1>
        <p className="card-sub">{sub}</p>

        {forgotMode && (
          <div className="reset-box">
            <h3>Reset your password</h3>
            {forgotSent ? (
              <p className="reset-ok">Reset link sent! Check your inbox.</p>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p>Enter your email and we'll send you a reset link.</p>
                <div className="input-wrap">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="reset-actions">
                  <button type="submit" className="btn-signin" disabled={forgotLoading}>
                    {forgotLoading ? "Sending…" : "Send reset link"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setForgotMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {serverError && (
          <div className="form-error">
            <span style={{ fontWeight: 700 }}>!</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <div className="input-wrap">
              <input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
            </div>
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="field">
            <div className="field-header">
              <label htmlFor="pw-input">Password</label>
              {mode === "login" && (
                <button type="button" className="forgot" onClick={() => setForgotMode(true)}>
                  Forgot password?
                </button>
              )}
            </div>
            <div className="input-wrap has-toggle">
              <input
                id="pw-input"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder="••••••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="pw-toggle"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          {mode === "register" && (
            <div className="field">
              <label htmlFor="company">Company</label>
              <div className="input-wrap">
                <input
                  id="company"
                  type="text"
                  placeholder="Acme Corp"
                  {...register("company" as keyof (LoginData | RegisterData))}
                />
              </div>
              {"company" in errors && errors.company && (
                <span className="field-error">{errors.company.message}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn-signin" disabled={isSubmitting}>
            <span>{isSubmitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">
            {mode === "login" ? "New to Red Elk?" : "Already have an account?"}
          </span>
          <div className="divider-line" />
        </div>

        <p className="signup-row">
          {mode === "login" ? (
            <button onClick={() => { setMode("register"); setServerError(""); }}>
              Get started free →
            </button>
          ) : (
            <button onClick={() => { setMode("login"); setServerError(""); }}>
              Sign in instead
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
