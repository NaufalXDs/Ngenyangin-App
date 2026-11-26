import { Link } from "react-router-dom";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  to,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-[10px] border border-border shadow-xs active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer disabled:opacity-50";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:scale-[1.02]",
    outline: "bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-[1.02]",
    destructive: "bg-destructive text-background hover:bg-destructive/80 hover:text-foreground hover:scale-[1.02]",
    ghost: "border-transparent bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-[1.02]",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? "w-full" : ""} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
