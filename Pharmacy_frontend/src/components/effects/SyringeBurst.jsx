// src/components/effects/SyringeBurst.jsx
export default function SyringeBurst({ active }) {
  return (
    <div className="pointer-events-none absolute -left-14 -top-10">
      <svg width="120" height="80" viewBox="0 0 120 80" className={active ? "syringe-anim" : ""}>
        <rect x="25" y="32" width="56" height="16" rx="4" fill="#e2e8f0" stroke="#94a3b8"/>
        <rect x="12" y="36" width="22" height="8" rx="2" fill="#cbd5e1" stroke="#94a3b8"/>
        <rect x="81" y="38" width="28" height="4" rx="2" fill="#94a3b8"/>
        {active && (
          <>
            <circle cx="110" cy="30" r="3" fill="#22c55e" className="spray-dot"/>
            <circle cx="104" cy="26" r="2.5" fill="#10b981" className="spray-dot"/>
            <circle cx="100" cy="32" r="2" fill="#34d399" className="spray-dot"/>
          </>
        )}
      </svg>

      {active && (
        <div className="absolute left-16 top-6">
          <div className="pill w-4 h-7 rounded-full bg-white border border-slate-300"></div>
          <div className="pill p2 w-7 h-4 rounded-full bg-white border border-slate-300"></div>
          <div className="pill p3 w-7 h-4 rounded-full bg-gradient-to-r from-white to-rose-200 border border-slate-300"></div>
          <div className="pill p4 w-4 h-7 rounded-full bg-gradient-to-b from-white to-blue-200 border border-slate-300"></div>
        </div>
      )}
    </div>
  );
}
