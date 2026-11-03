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
    "inline-flex items-center justify-center font-semibold transition border border-[#31281F] shadow-[4px_4px_0_#31281F] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#31281F] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_#31281F]";

  const variants = {
    primary: "bg-[#F3C743] text-[#31281F] hover:bg-[#e8b92e]",
    secondary: "bg-[#31281F] text-white hover:bg-[#463a2d]",
    outline: "bg-white text-[#31281F] hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "h-12 px-6 text-[15px]",
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
