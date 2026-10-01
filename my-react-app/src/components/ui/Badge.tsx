import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "new" | "progress" | "done";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    new: "bg-blue-50 text-blue-700",
    progress: "bg-amber-50 text-amber-700",
    done: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        px-3.5 py-2
        text-xs font-medium
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
