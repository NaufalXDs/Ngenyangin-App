export default function Form({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
  rightElement,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[12px] font-bold font-sans text-[#31281F]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            error ? "border-red-500 bg-red-50/30" : "border-gray-300 bg-white"
          } ${rightElement ? "pr-10" : ""}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
