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

/* centered carousel shown ONLY after success */
function CenterCarousel({ show, slides }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!show || !slides?.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 900);
    return () => clearInterval(t);
  }, [show, slides]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center z-40">
      <div className="w-[520px] h-[300px] rounded-xl overflow-hidden ring-1 ring-black/5 shadow-2xl relative animate-carousel-enter bg-white/40 backdrop-blur">
        {slides.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] ease-out ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, d) => (
            <span key={d} className={`h-2 w-2 rounded-full ${i === d ? "bg-white" : "bg-white/50"}`} />
          ))}
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

  const [showSuccessCarousel, setShowSuccessCarousel] = useState(false);
  const navigate = useNavigate();
  const { success: playSuccess, fail: playFail } = useBeep();

  // always ask login on open; clear on hard reload
  useEffect(() => {
    const n = performance.getEntriesByType("navigation")[0];
    if (n && n.type === "reload") sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }, []);

  const slides = useMemo(() => [
    "/assets/carousel/01.jpg",
    "/assets/carousel/02.jpg",
    "/assets/carousel/03.jpg",
    "/assets/carousel/04.jpg",
  ], []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      sessionStorage.setItem(SESSION_TOKEN_KEY, res.token || "ok");

      // show centered carousel RIGHT AWAY
      setShowSuccessCarousel(true);
      playSuccess();

      // navigate after carousel plays a bit
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
      {/* Background from /public/assets */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center rounded-2xl"
        style={{ backgroundImage: "url('/assets/medical-bg.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[#BEE3F8]/70 rounded-2xl" aria-hidden="true" />

      <Logo />

      {/* Success carousel overlay (center) */}
      <CenterCarousel show={showSuccessCarousel} slides={slides} />

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
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
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
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
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

          {/* (No side carousel here) */}
        </div>
      </div>
    </div>
  );
}
