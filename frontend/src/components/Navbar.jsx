import IconApp from "../assets/icons.png";
import { Link } from "react-router-dom";

export default function Navbar({ children }) {
  return (
    <header
      id="navbar"
      className="mx-auto mt-1 flex w-full max-w-full flex-wrap items-center justify-between gap-2 bg-white p-2 shadow-sm shadow-gray-400/30 backdrop-blur-md"
    >
      <Link to="/" aria-label="Ngenyangin - beranda">
        <img
          src={IconApp}
          alt="Ngenyangin"
          width={151.45}
          height={52}
          className="max-w-full"
        />
      </Link>
      <div>{children}</div>
    </header>
  );
}
