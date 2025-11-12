import React from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  Edit2,
  Ruler,
  CreditCard,
  Calendar,
  Package,
  Tag,
  FlaskConical,
} from "lucide-react";

/**
 * MastersDashboard — revised visual match
 * - TailwindCSS classes (same style system your app uses)
 * - icons chosen to closely match the screenshot
 * - thin rounded borders, top-right icon pill, compact total badge
 */

export default function MastersDashboard() {
  const items = [
    {
      path: "/medicinecategories",
      label: "Medicine Categories",
      icon: <Pill size={16} />,
      total: 0,
      accent: "teal",
    },
    {
      path: "/medicineforms",
      label: "Medicine Forms",
      icon: <Pill size={16} />,
      total: 0,
      accent: "orange",
    },
    {
      path: "/unitofmeasurement",
      label: "Units of Measurement",
      icon: <Ruler size={16} />,
      total: 0,
      accent: "blue",
    },
    {
      path: "/masters/payment-methods",
      label: "Payment Methods",
      icon: <CreditCard size={16} />,
      total: 5,
      accent: "teal",
    },
    {
      path: "/masters/payment-terms",
      label: "Payment Terms",
      icon: <Calendar size={16} />,
      total: 0,
      accent: "orange",
    },
    {
      path: "/masters/rack-locations",
      label: "Rack Locations",
      icon: <Package size={16} />,
      total: 0,
      accent: "blue",
    },
  ];

  const accentColors = {
    teal: {
      ring: "group-hover:border-teal-400",
      iconText: "text-teal-500",
      border: "border-teal-300",
    },
    orange: {
      ring: "group-hover:border-orange-400",
      iconText: "text-orange-500",
      border: "border-orange-300",
    },
    blue: {
      ring: "group-hover:border-sky-400",
      iconText: "text-sky-500",
      border: "border-sky-300",
    },
  };

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Master Data Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all configurable fields and dropdown options</p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const accent = accentColors[it.accent] ?? accentColors.teal;

          return (
            <Link key={it.path} to={it.path} className="group">
              <div
                className={`relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${accent.border}`}
                style={{ minHeight: 120 }}
              >
                {/* top-right small icon pill */}
                <div
                  className={`absolute right-4 top-4 inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-600 ${accent.ring}`}
                  aria-hidden
                >
                  <span className={`${accent.iconText}`}>{it.icon}</span>
                </div>

                {/* Title */}
                <div className="mb-6 pr-12">
                  <h2 className="text-lg font-medium text-gray-800">{it.label}</h2>
                </div>

                {/* Footer with compact badge */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Total Items:</span>
                  <span className="inline-flex h-7 min-w-[1.6rem] items-center justify-center rounded-full border border-gray-200 px-2 text-xs text-gray-700 bg-white">
                    {it.total ?? "—"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
