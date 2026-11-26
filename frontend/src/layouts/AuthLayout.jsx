import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "@/components";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar variant="auth" />
      <Outlet />
      <Footer />
    </div>
  );
}
