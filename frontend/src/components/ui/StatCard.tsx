import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number | ReactNode
  icon?: ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export default function StatCard({ label, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-sm p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/40 font-dm">{label}</p>
          <p className="text-2xl font-syne font-bold text-white">
            {typeof value === "string" || typeof value === "number" ? value : null}
          </p>
          {trend && (
            <p
              className={`text-xs font-dm ${
                trend.positive ? "text-[var(--color-accent2)]" : "text-[var(--color-red)]"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-white/30">{icon}</div>}
      </div>
    </div>
  )
}
