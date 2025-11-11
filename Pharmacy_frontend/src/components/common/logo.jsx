// src/components/common/logo.jsx
import React from "react";

export default function Logo() {
  return (
    <div
      className="absolute top-5 left-5 z-50 flex items-center gap-3 p-2 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* square icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
        aria-hidden
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" />
          <path d="M12 7v10M8 12h8" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* brand text (keeps compact) */}
      <div className="flex flex-col leading-tight select-none">
        <span className="text-white font-extrabold text-[16px] tracking-wide drop-shadow-sm">
          KESHAV MEDICALS
        </span>
        <span className="text-white font-semibold text-[13px] opacity-95 -mt-0.5">
          CENTRE
        </span>
      </div>
    </div>
  );
}
