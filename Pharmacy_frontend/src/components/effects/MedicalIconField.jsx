import React from "react";

/** Soft, animated icon background. */
export default function MedicalIconField() {
  const icons = [
    Pill(), Capsule(), Cross(), Syringe(), Bottle(),
    Pill(), Cross(), Capsule(), Bottle(), Syringe(),
    Pill(), Capsule(), Cross(), Syringe(), Bottle(),
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#BEE3F8]/70 rounded-2xl" />
      <div className="absolute inset-0">
        {icons.map((Icon, idx) => (
          <div
            key={idx}
            className="absolute animate-float-slow opacity-70"
            style={{
              left: `${(idx * 7 + 5) % 95}%`,
              top: `${(idx * 11 + 8) % 90}%`,
              animationDelay: `${(idx % 10) * 300}ms`,
            }}
          >
            <Icon />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- tiny SVG logos (no images needed) --- */
function Pill() {
  return (
    <svg width="36" height="16" viewBox="0 0 72 32" fill="none">
      <rect x="1" y="1" width="70" height="30" rx="15" fill="#fff" stroke="#cbd5e1"/>
      <rect x="1" y="1" width="35" height="30" rx="15" fill="#22c55e" opacity=".25"/>
    </svg>
  );
}
function Capsule() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="6" width="36" height="36" rx="18" fill="#fff" stroke="#cbd5e1"/>
      <rect x="6" y="6" width="18" height="36" rx="18" fill="#38bdf8" opacity=".25"/>
    </svg>
  );
}
function Cross() {
  return (
    <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
      <rect x="12" y="4" width="20" height="36" rx="4" fill="#10b981" opacity=".35"/>
      <rect x="4" y="12" width="36" height="20" rx="4" fill="#10b981" opacity=".35"/>
    </svg>
  );
}
function Syringe() {
  return (
    <svg width="36" height="18" viewBox="0 0 120 36" fill="none">
      <rect x="12" y="10" width="70" height="16" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <rect x="80" y="14" width="28" height="8" rx="4" fill="#94a3b8"/>
      <rect x="2" y="14" width="14" height="8" rx="2" fill="#cbd5e1" />
    </svg>
  );
}
function Bottle() {
  return (
    <svg width="22" height="28" viewBox="0 0 44 56" fill="none">
      <rect x="10" y="6" width="24" height="8" rx="3" fill="#cbd5e1" stroke="#94a3b8"/>
      <rect x="8" y="14" width="28" height="36" rx="6" fill="#eef2f7" stroke="#94a3b8"/>
      <rect x="12" y="38" width="20" height="10" rx="2" fill="#34d399" opacity=".4"/>
    </svg>
  );
}
