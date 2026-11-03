import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  FaUserGear,
  FaBookOpenReader,
  FaClipboard,
  FaDoorOpen,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import {IoIosArrowBack} from "react-icons/io"

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
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar>
        {user ? (
          <div className="relative mx-2">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100"
            >
              <img src="/avatar.jpeg" alt="" className="w-9 rounded-full" />
              <span className="max-w-32 truncate text-sm">{username}</span>
              <IoIosArrowBack
                className={`transform transition-transform duration-300 ease-in-out ${isDropdownOpen ? "rotate-90" : "-rotate-90"}`}
              />
            </button>

            <div
              aria-hidden={!isDropdownOpen}
              inert={!isDropdownOpen}
              className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-2 shadow-lg transition-all duration-150 ease-out ${isDropdownOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"}`}
            >
              <div className="truncate border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                <h2>{username}</h2>
                <h3 className="text-gray-400">{email}</h3>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
              >
                <FaUserGear aria-hidden="true" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/my-recipes"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
              >
                <FaBookOpenReader aria-hidden="true" />
                <span>My Recipes</span>
              </Link>
              <Link
                to="/workspace"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
              >
                <FaClipboard />
                <span>Workspace</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-100 font-semibold"
              >
                <FaDoorOpen />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-x-2">
            <Link
              to="/auth/register"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              SignUp
            </Link>
          </div>
        )}
      </Navbar>
      <Outlet />
      <Footer />
    </div>
  );
}
