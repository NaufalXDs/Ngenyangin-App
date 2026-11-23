import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  FaUserGear,
  FaChartPie,
  FaDoorOpen,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import { IoIosArrowBack } from "react-icons/io";

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = user?.username || user?.name || user?.email || "Account";
  const email = user?.email || "Account Email";

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
    navigate("/auth/login");
  };

  const searchBar = (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search food recipes..."
        className="w-full rounded-[10px] border border-gray-300 px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar centerContent={searchBar}>
        {user ? (
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-32 truncate text-sm font-medium">
                {username}
              </span>
              <IoIosArrowBack
                className={`transform transition-transform duration-300 ease-in-out ${isDropdownOpen ? "rotate-90" : "-rotate-90"}`}
              />
            </button>

            <div
              aria-hidden={!isDropdownOpen}
              inert={!isDropdownOpen}
              className={`absolute right-0 z-[100] top-12 w-56 origin-top-right rounded-2xl border border-gray-200 bg-white py-2 shadow-xl transition-all duration-150 ease-out ${isDropdownOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"}`}
            >
              <div className="truncate border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                <h2>{username}</h2>
                <h3 className="text-muted-foreground text-xs">{email}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold uppercase">
                  {user.role}
                </span>
              </div>
              <hr className="border-gray-200" />
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl font-semibold"
              >
                <FaUserGear aria-hidden="true" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/workspace/summary"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-primary"
              >
                <FaChartPie />
                <span>Workspace</span>
              </Link>
              <hr className="border-gray-200 my-1" />
              <Link
                to="/"
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold"
              >
                <FaDoorOpen />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button to="/auth/login" variant="outline" size="md">
              Login
            </Button>
            <Button to="/auth/register" variant="primary" size="md">
              Register
            </Button>
          </div>
        )}
      </Navbar>
      <Outlet />
      <Footer />
    </div>
  );
}
