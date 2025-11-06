export default function Logo() {
  return (
    // Positioned like the Figma header
    <div className="absolute top-8 left-10 flex items-center gap-4">
      {/* White rounded square with a soft shadow */}
      <div className="h-14 w-14 rounded-xl bg-white border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
        {/* Medical cross (green) */}
        <span className="text-emerald-600 text-3xl font-bold leading-none">+</span>
      </div>

      {/* Two-line title */}
      <div className="flex flex-col leading-tight">
        <span className="text-white text-[28px] font-semibold tracking-wide">
          KESHAV MEDICAL
        </span>
        <span className="text-white text-[28px] font-semibold tracking-wide">
          CENTRE
        </span>
      </div>
    </div>
  );
}
