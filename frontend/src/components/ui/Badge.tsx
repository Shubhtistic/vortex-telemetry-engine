import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

const variantClasses = {
  default: "bg-white/5 text-white/60 border-white/10",
  success:
    "bg-[var(--color-accent2)]/10 text-[var(--color-accent2)] border-[var(--color-accent2)]/20",
  warning:
    "bg-[var(--color-accent3)]/10 text-[var(--color-accent3)] border-[var(--color-accent3)]/20",
  danger: "bg-[var(--color-red)]/10 text-[var(--color-red)] border-[var(--color-red)]/20",
  info: "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-[var(--color-brand)]/20",
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-dm border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
