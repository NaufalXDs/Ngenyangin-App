import IconApp from "../assets/favicon.png"
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex w-full flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-serif text-lg font-bold">
          <img src={IconApp} alt="Ngenyangin" className="h-10 w-auto" />
        </Link>
        <div
          aria-label="Navigasi footer"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
        >
          <p>Anyone can be a chef</p>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Ngenyangin</p>
      </div>
    </footer>
  );
}
