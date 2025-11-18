// src/components/user/login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/logo";
import MedicalCarousel from "../common/MedicalCarousel";
import { login as apiLogin } from "../../api/auth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [carouselOn, setCarouselOn] = useState(false);
  const [hovered, setHovered] = useState(false); // used for opening "mouth"
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await apiLogin(form.username, form.password);
      setCarouselOn(true);
      setTimeout(() => {
        setCarouselOn(false);
        navigate("/dashboard", { replace: true });
      }, 1600);
    } catch (error) {
      setErr(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background image & tint */}
      <img
        src="/assets/medical-bg.jpg"
        alt="medical background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#BEE3F8]/65" />

      <Logo />

      {/* Centered area */}
      <div className="z-30 relative w-full max-w-[980px] px-4">
        <div className="mx-auto flex items-center justify-center gap-8">
          {/* Left: (we keep empty so the login card sits centered visually) */}
          <div style={{ width: 420 }} />

          {/* Login card wrapper (center) */}
          <div
            aria-live="polite"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative"
            style={{ width: 420 }}
          >
            {/* visual frame */}
            <div
              className={`origin-top transition-all duration-450 ease-[cubic-bezier(.2,.9,.3,1)]`}
              style={{
                transformOrigin: "top center",
                perspective: 800,
              }}
            >
              {/* Card shell */}
              <div
                className={`relative rounded-xl bg-white/95 backdrop-blur-sm overflow-hidden shadow-[0_10px_30px_rgba(8,15,25,0.12)]`}
                style={{
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {/* Header (always visible) */}
                <div
                  className="px-6 py-6 text-center select-none"
                  style={{
                    cursor: "default",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
                  }}
                >
                  <h2 className="text-2xl font-semibold text-slate-800">Login to an account</h2>
                </div>

                {/* Collapsible "mouth" area: scaleY/translate for mouth opening */}
                <div
                  className={`px-6 overflow-hidden`}
                  style={{
                    // when not hovered: collapse to zero height, when hovered open to normal
                    transition: "max-height 420ms cubic-bezier(.22,1,.36,1), transform 420ms cubic-bezier(.22,1,.36,1), box-shadow 320ms",
                    maxHeight: hovered ? 420 : 0,
                    transformOrigin: "top center",
                  }}
                >
                  {/* inner form container that animates like an opening mouth */}
                  <div
                    className="pt-4 pb-6"
                    style={{
                      transform: hovered ? "translateY(0) scaleY(1)" : "translateY(-10px) scaleY(.9)",
                      transition: "transform 420ms cubic-bezier(.22,1,.36,1), opacity 320ms",
                      opacity: hovered ? 1 : 0,
                    }}
                  >
                    <form onSubmit={onSubmit} className="space-y-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          User Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          name="username"
                          value={form.username}
                          onChange={onChange}
                          className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          placeholder="Enter your user name"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative mt-2">
                          <input
                            name="password"
                            type={showPwd ? "text" : "password"}
                            value={form.password}
                            onChange={onChange}
                            className="block w-full rounded-md border border-gray-200 px-3 py-3 pr-14 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                            aria-label={showPwd ? "Hide password" : "Show password"}
                          >
                            {showPwd ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      {err && <div className="text-sm text-rose-600">{err}</div>}

                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-md bg-emerald-600 text-white py-3 font-medium shadow hover:bg-emerald-700 transition"
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                      </div>

                      <div className="text-right">
                        <a className="text-xs text-gray-600 hover:underline" href="#">
                          Forgot password
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* decorative "jaw" shadow when closed vs open */}
              <div
                className="absolute left-4 right-4 -bottom-3 rounded-lg pointer-events-none transition-opacity duration-300"
                style={{
                  height: 20,
                  boxShadow: hovered ? "0 30px 50px rgba(8,15,25,0.18)" : "0 8px 22px rgba(8,15,25,0.10)",
                }}
              />
            </div>
          </div>

          {/* Right: reserved for symmetry / or small carousel icon if you want */}
          <div style={{ width: 420 }} />
        </div>
      </div>

      {/* Center carousel overlay after successful login */}
      <MedicalCarousel show={carouselOn} />

      {/* local styles for the mouth animation */}
      <style>{`
        /* smaller durations and cubic bezier for snappy 'mouth' feel */
        .duration-450 { transition-duration: 450ms; }
      `}</style>
    </div>
  );
}
