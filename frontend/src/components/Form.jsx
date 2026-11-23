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
          className="block text-xs font-semibold text-foreground"
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
          className={`w-full rounded-md border border-input px-3 py-2 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition ${
            error ? "border-destructive bg-destructive/10" : ""
          } ${rightElement ? "pr-10" : ""}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
