import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import {
  FaChartPie,
  FaBookOpenReader,
  FaClipboardList,
  FaUsers,
  FaBookBookmark,
  FaUserGear,
} from "react-icons/fa6";

export default function WorkspaceLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const isReviewerOrAdmin = user?.role === "REVIEWER" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  const tabs = [
    {
      id: "summary",
      label: "Summary",
      path: "/workspace/summary",
      icon: <FaChartPie className="mr-1.5" />,
      show: false,
    },
    {
      id: "mine",
      label: "My Recipes",
      path: "/workspace/my-recipes",
      icon: <FaBookOpenReader className="mr-1.5" />,
      show: true,
    },
    {
      id: "review",
      label: "Review Recipes",
      path: "/workspace/review",
      icon: <FaClipboardList className="mr-1.5" />,
      show: isReviewerOrAdmin,
    },
    {
      id: "admin-recipes",
      label: "Recipe Management",
      path: "/workspace/recipes",
      icon: <FaBookBookmark className="mr-1.5" />,
      show: isAdmin,
    },
    {
      id: "admin-users",
      label: "User Management",
      path: "/workspace/users",
      icon: <FaUsers className="mr-1.5" />,
      show: isAdmin,
    },
    {
      id: "account",
      label: "Account",
      path: "/account",
      icon: <FaUserGear className="mr-1.5" />,
      show: true,
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full bg-orange-50/40">
      <div className="max-w-full px-4 sm:px-8 py-3 w-full space-y-6">
        {/* Workspace Sub-Navbar Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-gray-200">
          {tabs
            .filter((t) => t.show)
            .map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Button
                  key={tab.id}
                  to={tab.path}
                  variant={isActive ? "primary" : "outline"}
                  size="md"
                  className={isActive ? "shadow-md scale-[1.02]" : " bg-white"}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Button>
              );
            })}
        </div>

        {/* Workspace Content Area */}
        <div className="w-full">{children || <Outlet />}</div>
      </div>
    </div>
  );
}
