interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  id?: string
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  id,
}: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs uppercase tracking-widest text-white/50 font-dm mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-dm text-sm focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-colors appearance-none"
      >
        <option value="" className="bg-neutral-900">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
