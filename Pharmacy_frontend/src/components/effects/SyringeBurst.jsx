// SyringeBurst.jsx - small effect component shows on failure (burst) or success (fill)
import React, { useEffect } from "react";

export default function SyringeBurst({ active = false, type = "fail" /* 'fail'|'success' */ }) {
  // type "fail" -> pill pop + ring + syringe shake
  // type "success" -> bottle fill + pill-pop + ambulance slide
  useEffect(() => {
    if (!active) return;
    // nothing JS heavy required — CSS animations handle the visuals.
  }, [active]);

  if (!active) return null;

  if (type === "fail") {
    return (
      <div className="pointer-events-none absolute -top-10 -right-6 z-50">
        <div className="syringe-icon" aria-hidden />
        <div className="relative">
          <div className="fail-ring" />
          <div className="pill-burst-wrapper" style={{ position: "absolute", left: -12, top: 12 }}>
            <div className="pill-burst pill-1" />
            <div className="pill-burst pill-2" />
            <div className="pill-burst pill-3" />
            <div className="pill-burst pill-4" />
          </div>
        </div>
      </div>
    );
  }

  // success view: bottle + liquid + ambulance
  return (
    <div className="pointer-events-none absolute -top-14 -left-8 z-50 flex items-center gap-4">
      <div className="bottle">
        <div className="liquid" />
        <div className="pill-pop" />
      </div>
      <div className="ambulance-run" style={{ width: 140, height: 44 }} />
    </div>
  );
}
