import { useEffect, useState } from "react";

const slides = [
  "/assets/carousel/01.jpg",
  "/assets/carousel/02.jpg",
  "/assets/carousel/03.jpg",
  "/assets/carousel/04.jpg",

];

export default function MedicalCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden lg:flex w-[420px] h-[360px] ml-10 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-xl relative">
      {slides.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i===idx ? "opacity-100" : "opacity-0"}`}
          loading="eager"
        />
      ))}
      {/* gradient overlay + caption */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-3 left-4 flex gap-2">
        {slides.map((_, d) => (
          <span key={d} className={`h-2 w-2 rounded-full ${i===d ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
