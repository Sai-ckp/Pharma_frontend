export default function TonicFill({ active }) {
  return active ? (
    <div className="pointer-events-none absolute -left-14 -top-10 animate-bounce">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <rect x="35" y="10" width="30" height="60" fill="#e2e8f0" stroke="#94a3b8"/>
        <rect x="41" y="65" width="18" height="25" fill="#10b981" stroke="#065f46">
          <animate
            attributeName="height"
            from="0" to="25"
            dur="0.7s"
            fill="freeze"
          />
        </rect>
      </svg>
    </div>
  ) : null;
}
