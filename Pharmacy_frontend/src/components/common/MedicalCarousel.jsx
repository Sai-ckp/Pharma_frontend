// src/components/common/MedicalCarousel.jsx
import React, { useEffect, useState } from "react";

/**
 * MedicalCarousel
 * props:
 *  - show (bool) : whether to render overlay carousel
 *  - slides (array of image urls) optional - defaults to /assets/carousel/*
 */
export default function MedicalCarousel({ show = false, slides: incoming = null }) {
  const defaultSlides = [
    "/assets/carousel/01.jpg",
    "/assets/carousel/02.jpg",
    "/assets/carousel/03.jpg",
    "/assets/carousel/04.jpg",
  ];
  const slides = Array.isArray(incoming) && incoming.length ? incoming : defaultSlides;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % slides.length), 1100);
    return () => clearInterval(t);
  }, [show, slides.length]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center">
      <div
        className="relative w-[520px] h-[320px] rounded-xl shadow-2xl overflow-visible"
        style={{ perspective: 1400 }}
      >
        <div
          className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-md"
          style={{ boxShadow: "0 30px 60px rgba(8,15,40,0.28)" }}
        />
        <div
          className="absolute inset-0 grid place-items-center"
          aria-hidden
        >
          <div
            className="relative w-[360px] h-[260px] transform-style-3d"
            style={{
              perspective: 1400,
            }}
          >
            {slides.map((src, i) => {
              // compute transform for 3D rotation (cards placed in circle)
              const offset = i - index;
              // keep offset within [-n/2, n/2]
              const half = Math.floor(slides.length / 2);
              let o = offset;
              if (offset > half) o = offset - slides.length;
              if (offset < -half) o = offset + slides.length;

              const deg = o * 12; // spread angle
              const z = -Math.abs(o) * 20; // push back based on distance
              const scale = 1 - Math.abs(o) * 0.06;
              const opacity = o === 0 ? 1 : 0.45 - Math.abs(o) * 0.05;

              return (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute left-1/2 top-1/2 w-[280px] h-[200px] rounded-xl object-contain bg-white p-3"
                  style={{
                    transform: `translate(-50%,-50%) rotateY(${deg}deg) translateZ(${z}px) scale(${scale})`,
                    transition: "transform 700ms cubic-bezier(.18,.9,.32,1), opacity 700ms ease",
                    opacity,
                    boxShadow: "0 12px 30px rgba(6,12,34,0.18)",
                    border: "6px solid rgba(255,255,255,0.12)",
                    background: "white",
                  }}
                />
              );
            })}
          </div>

          {/* small indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, d) => (
              <span
                key={d}
                className={`h-2 w-2 rounded-full ${d === index ? "bg-white" : "bg-white/40"}`}
                style={{ boxShadow: d === index ? "0 2px 6px rgba(0,0,0,0.25)" : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
