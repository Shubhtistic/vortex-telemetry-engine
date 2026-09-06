interface InputProps {
  label?: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
  id?: string
  disabled?: boolean
  maxLength?: number
  autoComplete?: string
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
  id,
  disabled = false,
  maxLength,
  autoComplete,
}: InputProps) {
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white font-dm text-sm placeholder-white/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400 font-dm">{error}</p>}
    </div>
  )
}
