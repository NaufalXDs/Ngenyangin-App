import { Link } from "react-router-dom";
import iconApp from "@/assets/icons.png";

export default function Navbar({ variant = "default", centerContent, children, className = "" }) {
  const variants = {
    default: "justify-between px-4 sm:px-8",
    auth: "justify-center px-4",
  };

  return (
    <header
      id="navbar"
      className={`relative z-50 mx-auto mt-1 flex flex-row w-full max-w-full items-center bg-white py-3 shadow-sm shadow-gray-400/30 backdrop-blur-md ${variants[variant] || variants.default} ${className}`}
    >
      <Link to="/" aria-label="Ngenyangin - beranda" className="flex items-center shrink-0">
        <img
          src={iconApp}
          alt="Ngenyangin"
          width={151.45}
          height={52}
          className="max-w-full h-auto"
        />
      </Link>

      {variant === "default" && centerContent && (
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          {centerContent}
        </div>
      )}

      {variant === "default" && <div>{children}</div>}
    </header>
  );
}
