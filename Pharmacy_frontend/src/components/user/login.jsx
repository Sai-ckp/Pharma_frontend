import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/logo";
import { login } from "../../api/auth";

const SESSION_TOKEN_KEY = "session_token";

/* tiny sound helper (optional) */
function useBeep() {
  const ctxRef = useRef(null);
  const ensure = () =>
    (ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)());
  const play = (f = 880, ms = 120, type = "sine", gain = 0.03) => {
    const ctx = ensure();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = gain;
    o.connect(g); g.connect(ctx.destination); o.start();
    setTimeout(() => o.stop(), ms);
  };
  return {
    success: () => { play(1046, 120); setTimeout(() => play(1318, 140), 130); },
    fail: () => { play(220, 160, "square", 0.02); setTimeout(() => play(180, 180, "sine", 0.02), 110); }
  };
}

/* ===== soft, pharmacy-themed animated background (inline SVG icons) ===== */
function MedicalIconField() {
  const icons = useMemo(() => {
    const items = [];
    const Svg = ({ children, w = 36, h = 18 }) => (
      <svg width={w} height={h} viewBox={`0 0 ${w*2} ${h*2}`} fill="none">{children}</svg>
    );
    const Pill = () => (
      <Svg w={36} h={16}>
        <rect x="2" y="2" width="68" height="28" rx="14" fill="#fff" stroke="#cbd5e1"/>
        <rect x="2" y="2" width="34" height="28" rx="14" fill="#22c55e" opacity=".25"/>
      </Svg>
    );
    const Cross = () => (
      <Svg w={22} h={22}>
        <rect x="12" y="4" width="20" height="36" rx="4" fill="#10b981" opacity=".35"/>
        <rect x="4" y="12" width="36" height="20" rx="4" fill="#10b981" opacity=".35"/>
      </Svg>
    );
    const Syringe = () => (
      <Svg w={36} h={18}>
        <rect x="12" y="10" width="70" height="16" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
        <rect x="80" y="14" width="28" height="8" rx="4" fill="#94a3b8"/>
        <rect x="2" y="14" width="14" height="8" rx="2" fill="#cbd5e1"/>
      </Svg>
    );
    const Bottle = () => (
      <Svg w={22} h={28}>
        <rect x="10" y="6" width="24" height="8" rx="3" fill="#cbd5e1" stroke="#94a3b8"/>
        <rect x="8" y="14" width="28" height="36" rx="6" fill="#eef2f7" stroke="#94a3b8"/>
        <rect x="12" y="38" width="20" height="10" rx="2" fill="#34d399" opacity=".4"/>
      </Svg>
    );
    const parts = [Pill, Cross, Syringe, Bottle, Pill, Cross, Syringe, Bottle];
    for (let i = 0; i < 18; i++) items.push(parts[i % parts.length]);
    return items;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[#BEE3F8]/70" />
      <div className="absolute inset-0">
        {icons.map((Ico, idx) => (
          <div
            key={idx}
            className="absolute animate-float-slow opacity-70"
            style={{
              left: `${(idx * 7 + 5) % 95}%`,
              top: `${(idx * 11 + 8) % 90}%`,
              animationDelay: `${(idx % 10) * 300}ms`,
            }}
          >
            <Ico />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== centered logo-only carousel overlay shown ONLY after success ===== */
function CenterLogoCarousel({ show }) {
  if (!show) return null;

  // Mini logo chips (emoji here; swap to brand SVGs easily)
  const Row = () => (
    <div className="flex items-center gap-4 px-4">
      {["💊","💉","🩺","➕","🧴","🔬","🛡️","🧪"].map((em, i) => (
        <div key={i} className="logo-chip text-xl">{em}</div>
      ))}
    </div>
  );

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center z-40">
      <div className="w-[520px] rounded-xl overflow-hidden ring-1 ring-black/5 shadow-2xl bg-white/70 backdrop-blur animate-carousel-enter">
        {/* duplicate rows for seamless loop */}
        <div className="flex whitespace-nowrap animate-logo-marquee">
          <Row /><Row />
        </div>
      </div>
    </div>
  );
}

/* ======== MAIN LOGIN ======== */
export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { success: playSuccess, fail: playFail } = useBeep();

  // always ask login on open; clear on hard reload
  useEffect(() => {
    const n = performance.getEntriesByType("navigation")[0];
    if (n && n.type === "reload") sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }, []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      sessionStorage.setItem(SESSION_TOKEN_KEY, res.token || "ok");

      // show LOGO-ONLY carousel RIGHT AWAY (no big photos)
      setShowSuccess(true);
      playSuccess();
      setTimeout(() => navigate("/dashboard", { replace: true }), 1800);
    } catch (error) {
      setErr(error?.message || "Invalid credentials");
      playFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full px-6 py-6">
      {/* Soft animated icon background */}
      <MedicalIconField />

      <Logo />

      {/* Success logo strip overlay (center) */}
      <CenterLogoCarousel show={showSuccess} />

      <div className="relative mx-auto max-w-3xl pt-28">
        <div className="flex flex-col items-center justify-center">
          {/* Login card */}
          <div className="relative w-full max-w-[520px]">
            <div className="rounded-xl bg-white shadow-2xl ring-1 ring-emerald-500/10 p-6 sm:p-8">
              <h1 className="text-xl font-semibold text-gray-900 text-center">Login to an account</h1>

              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                    User Name<span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={form.username}
                    onChange={onChange}
                    placeholder="Enter your user name"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] animate-focus-glow"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                    Password<span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={onChange}
                      placeholder="Enter password"
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 animate-focus-glow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute inset-y-0 right-0 grid place-items-center px-3 text-gray-500 hover:text-gray-700"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3l18 18"/><path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58"/><path d="M16.24 16.24A9.77 9.77 0 0 1 12 18c-5 0-9-4.5-10-6 0 0 2.18-3.18 5.64-5.14"/><path d="M14.12 9.88A2 2 0 0 0 12 8a2 2 0 0 0-2 2"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <a href="#" className="text-xs text-gray-700 hover:underline">Forgot password</a>
                  </div>
                </div>

                {err && <p className="text-sm text-rose-600">{err}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
