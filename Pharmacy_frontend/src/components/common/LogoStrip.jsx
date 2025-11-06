import React, { useEffect, useRef } from "react";

export default function LogoStrip() {
  const ref = useRef(null);

  // loop the marquee by duplicating nodes
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.cloned) return;
    el.dataset.cloned = "1";
    el.innerHTML = el.innerHTML + el.innerHTML; // simple duplicate
  }, []);

  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-black/5 bg-gradient-to-r from-white to-slate-50">
      <div
        ref={ref}
        className="flex items-center gap-6 py-2 px-4 animate-logo-marquee"
        style={{ whiteSpace: "nowrap" }}
      >
        {iconsRow}
      </div>
    </div>
  );
}

/* row of mini logos (SVGs) */
const Icon = ({ children }) => (
  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/90 ring-1 ring-slate-200 shadow-sm">
    {children}
  </div>
);

const iconsRow = (
  <>
    <Icon><span role="img" aria-label="pill">💊</span></Icon>
    <Icon><span role="img" aria-label="syringe">💉</span></Icon>
    <Icon><span role="img" aria-label="cross">➕</span></Icon>
    <Icon><span role="img" aria-label="steth">🩺</span></Icon>
    <Icon><span role="img" aria-label="bottle">🧴</span></Icon>
    <Icon><span role="img" aria-label="microscope">🔬</span></Icon>
    <Icon><span role="img" aria-label="capsule">🟢</span></Icon>
    <Icon><span role="img" aria-label="shield">🛡️</span></Icon>
  </>
);
